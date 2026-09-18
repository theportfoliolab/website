from __future__ import annotations

from collections import defaultdict
from dataclasses import dataclass
from typing import Callable

import matplotlib.pyplot as plt
import pandas as pd
import yfinance as yf


PositionSizer = Callable[[float, pd.DataFrame], dict[str, float]]


@dataclass
class BacktestResult:
    """
    Standard container returned by backtest simulations.

    The raw pandas objects remain available for article-specific
    tables, charts, and investigation.
    """

    equity: pd.DataFrame
    trades: pd.DataFrame
    events: pd.DataFrame
    metrics: pd.Series


# ============================================================
# MARKET DATA
# ============================================================

def download_prices(
    tickers: list[str],
    start: str,
    end: str | None = None,
    warmup_days: int = 0,
) -> pd.DataFrame:
    """
    Download adjusted daily closing prices from Yahoo Finance.

    warmup_days allows indicators to be calculated before the formal
    analysis period begins.
    """

    download_start = (
        pd.Timestamp(start)
        - pd.Timedelta(days=warmup_days)
    )

    raw = yf.download(
        tickers,
        start=download_start,
        end=end,
        auto_adjust=True,
        actions=False,
        progress=False,
    )

    prices = extract_close_prices(raw)

    return prices.sort_index()


def extract_close_prices(
    raw: pd.DataFrame,
) -> pd.DataFrame:
    """
    Extract a consistently shaped close-price DataFrame from a
    yfinance response.
    """

    if raw.empty:
        raise ValueError(
            "No market data was downloaded."
        )

    if isinstance(raw.columns, pd.MultiIndex):

        if "Close" not in raw.columns.get_level_values(0):
            raise ValueError(
                "Downloaded data does not contain close prices."
            )

        prices = raw["Close"].copy()

    elif "Close" in raw.columns:

        prices = raw["Close"].copy()

        if isinstance(prices, pd.Series):
            prices = prices.to_frame()

    else:

        raise ValueError(
            "Downloaded data does not contain close prices."
        )

    if isinstance(prices, pd.Series):
        prices = prices.to_frame()

    return prices.dropna(
        axis="columns",
        how="all",
    )


def require_columns(
    prices: pd.DataFrame,
    columns: list[str],
    label: str,
) -> pd.DataFrame:
    """
    Return prices for required columns, raising a clear error when
    downloaded data is missing an expected ticker.
    """

    missing = [
        column
        for column in columns
        if column not in prices.columns
    ]

    if missing:
        raise ValueError(
            f"Missing {label} price columns: "
            f"{', '.join(missing)}"
        )

    return prices.loc[:, columns].copy()


def resample_prices(
    prices: pd.DataFrame,
    frequency: str,
) -> pd.DataFrame:
    """
    Convert daily prices to another observation frequency.

    For example:
        W-FRI -> weekly closing observations
        ME    -> month-end observations
    """

    return (
        prices
        .resample(frequency)
        .last()
    )


# ============================================================
# INDICATORS / SIGNAL HELPERS
# ============================================================

def moving_average(
    prices: pd.DataFrame,
    periods: int,
) -> pd.DataFrame:
    """
    Calculate a simple moving average over the requested
    number of observations.
    """

    return prices.rolling(
        periods,
        min_periods=periods,
    ).mean()


def crosses_above(
    values: pd.DataFrame,
    reference: pd.DataFrame,
) -> pd.DataFrame:
    """
    Identify observations where values move from below or equal
    to a reference series to above it.

    A signal is only generated where both the current and previous
    reference observations exist. This prevents the first valid
    reference observation from being incorrectly classified as a
    crossover.
    """

    above = values > reference

    previous_above = (
        above
        .shift(1)
        .fillna(False)
        .astype(bool)
    )

    valid = (
        values.notna()
        & values.shift(1).notna()
        & reference.notna()
        & reference.shift(1).notna()
    )

    signals = (
        valid
        & above
        & ~previous_above
    )

    return signals.fillna(False)


# ============================================================
# SIGNAL / EVENT PROCESSING
# ============================================================

def signals_to_events(
    signals: pd.DataFrame,
    execution_index: pd.DatetimeIndex,
    action: str = "buy",
    metadata: dict[str, pd.DataFrame | pd.Series | object] | None = None,
) -> pd.DataFrame:
    """
    Convert a boolean signal matrix into individual trade events.

    Signals may be generated from weekly or monthly data while
    execution_index contains daily trading dates.

    Each signal is assigned to the next available trading day,
    avoiding look-ahead bias.

    Optional metadata can attach extra columns such as signal value,
    reference value, strategy name, or rule name.
    """

    rows = []

    execution_index = execution_index.sort_values()
    metadata = metadata or {}

    for signal_date, row in signals.iterrows():

        triggered_tickers = row[row].index

        if len(triggered_tickers) == 0:
            continue

        trade_position = execution_index.searchsorted(
            signal_date,
            side="right",
        )

        if trade_position >= len(execution_index):
            continue

        trade_date = execution_index[trade_position]

        for ticker in triggered_tickers:

            event = {
                "ticker": ticker,
                "signal_date": signal_date,
                "trade_date": trade_date,
                "action": action,
            }

            for name, values in metadata.items():

                if isinstance(values, pd.DataFrame):
                    event[name] = values.loc[
                        signal_date,
                        ticker,
                    ]
                elif isinstance(values, pd.Series):
                    event[name] = values.loc[
                        signal_date
                    ]
                else:
                    event[name] = values

            rows.append(event)

    events = pd.DataFrame(
        rows,
        columns=[
            "ticker",
            "signal_date",
            "trade_date",
            "action",
            *metadata.keys(),
        ],
    )

    if events.empty:
        return events

    return (
        events
        .sort_values(
            ["trade_date", "ticker"]
        )
        .reset_index(drop=True)
    )


def monthly_event_counts(
    events: pd.DataFrame,
    start: str,
    end: str | pd.Timestamp,
) -> pd.Series:
    """
    Count signal events per calendar month.

    Months containing no events are explicitly restored so that
    zero-signal months are included in the distribution.
    """

    first_month = (
        pd.Timestamp(start)
        .to_period("M")
    )

    last_month = (
        pd.Timestamp(end)
        .to_period("M")
    )

    all_months = pd.period_range(
        first_month,
        last_month,
        freq="M",
    )

    if events.empty:

        return pd.Series(
            0,
            index=all_months,
            dtype=int,
        )

    counts = (
        events
        .groupby(
            events["signal_date"]
            .dt.to_period("M")
        )
        .size()
    )

    return counts.reindex(
        all_months,
        fill_value=0,
    )


def print_event_statistics(
    counts: pd.Series,
) -> None:
    """
    Print descriptive statistics for the monthly event distribution.
    """

    print("\nSIGNAL FREQUENCY")

    print(
        f"Total signals:       "
        f"{counts.sum():.0f}"
    )

    print(
        f"Average per month:   "
        f"{counts.mean():.2f}"
    )

    print(
        f"Median per month:    "
        f"{counts.median():.0f}"
    )

    print(
        f"Maximum in a month:  "
        f"{counts.max():.0f}"
    )

    zero_months = (
        counts == 0
    ).sum()

    print(
        f"Months with zero:    "
        f"{zero_months} / {len(counts)}"
    )

    print(
        f"Zero-signal rate:    "
        f"{zero_months / len(counts):.1%}"
    )

    print(
        "\nMonthly signal distribution:"
    )

    distribution = (
        counts
        .value_counts()
        .sort_index()
        .rename("months")
    )

    print(
        distribution.to_string()
    )


# ============================================================
# PORTFOLIO / BACKTEST HELPERS
# ============================================================

def validate_events(
    events: pd.DataFrame,
) -> None:
    """
    Validate the minimal event schema used by the simulator.
    """

    required = [
        "ticker",
        "trade_date",
    ]

    missing = [
        column
        for column in required
        if column not in events.columns
    ]

    if missing:
        raise ValueError(
            "Events are missing required columns: "
            f"{', '.join(missing)}"
        )

    if (
        "action" in events.columns
        and not events["action"].isin(["buy", "sell"]).all()
    ):
        raise ValueError(
            "Event action must be 'buy' or 'sell'."
        )


def validate_price_alignment(
    prices: pd.DataFrame,
    events: pd.DataFrame,
) -> None:
    """
    Check that all event trade dates fall inside the price index.
    """

    if events.empty:
        return

    missing_dates = (
        pd.DatetimeIndex(events["trade_date"])
        .difference(prices.index)
    )

    if len(missing_dates) > 0:
        raise ValueError(
            "Events contain trade dates not present in prices. "
            f"First missing date: {missing_dates[0]}"
        )


def summarise_missing_data(
    prices: pd.DataFrame,
) -> pd.DataFrame:
    """
    Summarise missing observations by ticker.
    """

    summary = pd.DataFrame(
        {
            "missing_observations": prices.isna().sum(),
            "total_observations": len(prices),
        }
    )

    summary["missing_rate"] = (
        summary["missing_observations"]
        / summary["total_observations"]
    )

    return summary.sort_values(
        "missing_observations",
        ascending=False,
    )


def validate_simulation_inputs(
    prices: pd.DataFrame,
    benchmark: str,
    buy_fraction: float | None,
) -> None:
    """
    Validate inputs that would otherwise fail later with unclear
    pandas or arithmetic errors.
    """

    if prices.empty:
        raise ValueError(
            "Price data is empty for the requested test period."
        )

    if benchmark not in prices.columns:
        raise ValueError(
            f"Benchmark '{benchmark}' "
            "is not present in price data."
        )

    if (
        buy_fraction is not None
        and not 0 < buy_fraction <= 1
    ):
        raise ValueError(
            "buy_fraction must be between "
            "0 and 1."
        )


def events_by_trade_day(
    events: pd.DataFrame,
) -> dict[pd.Timestamp, pd.DataFrame]:
    """
    Group executable events by trading day.
    """

    if events.empty:
        return {}

    return {
        date: group
        for date, group
        in events.groupby("trade_date")
    }


def executable_tickers(
    tickers: pd.Series,
    row: pd.Series,
    benchmark: str,
) -> list[str]:
    """
    Keep only signal tickers that can actually be bought on the
    current trading day.
    """

    benchmark_price = row[benchmark]

    if pd.isna(benchmark_price):
        return []

    return [
        ticker
        for ticker in tickers
        if (
            ticker in row.index
            and not pd.isna(row[ticker])
        )
    ]


def spend_for_signal_group(
    cash: float,
    signal_count: int,
    buy_fraction: float,
) -> float:
    """
    Calculate the per-signal spend for one trading day.
    """

    if cash <= 0 or signal_count <= 0:
        return 0.0

    return min(
        buy_fraction * cash,
        cash / signal_count,
    )


def build_contribution_schedule(
    prices: pd.DataFrame,
    contributions: float | pd.Series,
    contribution_frequency: str = "MS",
) -> pd.Series:
    """
    Build external cash flows aligned to available trading dates.

    A numeric contribution creates a recurring schedule. A Series is
    treated as an explicit cash-flow schedule and shifted to the next
    available trading day when needed.
    """

    schedule = pd.Series(
        0.0,
        index=prices.index,
    )

    if isinstance(contributions, pd.Series):
        source = contributions.sort_index()
    else:
        first_period_start = (
            prices.index[0]
            .to_period("M")
            .to_timestamp()
        )

        source = pd.Series(
            float(contributions),
            index=pd.date_range(
                first_period_start,
                prices.index[-1],
                freq=contribution_frequency,
            ),
        )

    for cash_date, amount in source.items():

        trade_position = prices.index.searchsorted(
            pd.Timestamp(cash_date),
            side="left",
        )

        if trade_position >= len(prices.index):
            continue

        schedule.iloc[trade_position] += float(amount)

    return schedule


def fraction_of_cash(
    fraction: float,
) -> PositionSizer:
    """
    Create a position sizer that spends the same fraction of cash on
    each signal, while dividing cash fairly across simultaneous buys.
    """

    if not 0 < fraction <= 1:
        raise ValueError(
            "fraction must be between 0 and 1."
        )

    def position_sizer(
        cash: float,
        signals: pd.DataFrame,
    ) -> dict[str, float]:

        tickers = list(signals["ticker"])

        spend_per_signal = spend_for_signal_group(
            cash=cash,
            signal_count=len(tickers),
            buy_fraction=fraction,
        )

        return {
            ticker: spend_per_signal
            for ticker in tickers
        }

    return position_sizer


def execute_purchases(
    tickers: list[str],
    row: pd.Series,
    benchmark: str,
    strategy_cash: float,
    benchmark_cash: float,
    strategy_shares: defaultdict[str, float],
    benchmark_shares: float,
    buy_fraction: float,
    date: pd.Timestamp,
    transaction_cost_bps: float = 0.0,
    slippage_bps: float = 0.0,
) -> tuple[float, float, float, list[dict[str, object]]]:
    """
    Execute one day's valid signal purchases for both the strategy
    and the matched benchmark.
    """

    trades = []

    spend_per_signal = spend_for_signal_group(
        cash=strategy_cash,
        signal_count=len(tickers),
        buy_fraction=buy_fraction,
    )

    for ticker in tickers:

        stock_price = row[ticker] * (
            1 + slippage_bps / 10_000
        )

        benchmark_price = row[benchmark] * (
            1 + slippage_bps / 10_000
        )

        cost_multiplier = (
            1
            + transaction_cost_bps / 10_000
        )

        spend = min(
            spend_per_signal,
            strategy_cash / cost_multiplier,
            benchmark_cash / cost_multiplier,
        )

        transaction_cost = (
            spend
            * transaction_cost_bps
            / 10_000
        )

        total_spend = spend + transaction_cost

        if total_spend <= 0:
            continue

        if total_spend - strategy_cash > 1e-9:
            continue

        strategy_shares[ticker] += (
            spend / stock_price
        )

        benchmark_shares += (
            spend / benchmark_price
        )

        strategy_cash -= min(
            total_spend,
            strategy_cash,
        )

        benchmark_cash -= min(
            total_spend,
            benchmark_cash,
        )

        trades.append(
            {
                "date": date,
                "ticker": ticker,
                "action": "buy",
                "amount": spend,
                "transaction_cost": transaction_cost,
                "stock_price": stock_price,
                "benchmark_price": benchmark_price,
            }
        )

    return (
        strategy_cash,
        benchmark_cash,
        benchmark_shares,
        trades,
    )


def execute_sells(
    tickers: list[str],
    row: pd.Series,
    strategy_cash: float,
    strategy_shares: defaultdict[str, float],
    date: pd.Timestamp,
    transaction_cost_bps: float = 0.0,
    slippage_bps: float = 0.0,
) -> tuple[float, list[dict[str, object]]]:
    """
    Sell all held shares for each requested ticker.
    """

    trades = []

    for ticker in tickers:

        shares = strategy_shares[ticker]

        if shares <= 0:
            continue

        if ticker not in row.index or pd.isna(row[ticker]):
            continue

        stock_price = row[ticker] * (
            1 - slippage_bps / 10_000
        )

        proceeds = shares * stock_price

        transaction_cost = (
            proceeds
            * transaction_cost_bps
            / 10_000
        )

        strategy_cash += (
            proceeds
            - transaction_cost
        )

        strategy_shares[ticker] = 0.0

        trades.append(
            {
                "date": date,
                "ticker": ticker,
                "action": "sell",
                "amount": proceeds,
                "transaction_cost": transaction_cost,
                "stock_price": stock_price,
                "benchmark_price": pd.NA,
            }
        )

    return strategy_cash, trades


def execute_sized_buys(
    day_events: pd.DataFrame,
    row: pd.Series,
    benchmark: str,
    strategy_cash: float,
    benchmark_cash: float,
    strategy_shares: defaultdict[str, float],
    benchmark_shares: float,
    position_sizer: PositionSizer,
    date: pd.Timestamp,
    transaction_cost_bps: float = 0.0,
    slippage_bps: float = 0.0,
) -> tuple[float, float, float, list[dict[str, object]]]:
    """
    Execute buy events using a caller-provided position sizer.
    """

    valid_tickers = executable_tickers(
        tickers=day_events["ticker"],
        row=row,
        benchmark=benchmark,
    )

    valid_events = day_events[
        day_events["ticker"].isin(valid_tickers)
    ]

    target_spends = position_sizer(
        strategy_cash,
        valid_events,
    )

    trades = []

    for ticker in valid_tickers:

        requested_spend = target_spends.get(
            ticker,
            0.0,
        )

        stock_price = row[ticker] * (
            1 + slippage_bps / 10_000
        )

        benchmark_price = row[benchmark] * (
            1 + slippage_bps / 10_000
        )

        cost_multiplier = (
            1
            + transaction_cost_bps / 10_000
        )

        spend = min(
            requested_spend,
            strategy_cash / cost_multiplier,
            benchmark_cash / cost_multiplier,
        )

        transaction_cost = (
            spend
            * transaction_cost_bps
            / 10_000
        )

        total_spend = spend + transaction_cost

        if total_spend <= 0:
            continue

        if total_spend - strategy_cash > 1e-9:
            continue

        strategy_shares[ticker] += (
            spend / stock_price
        )

        benchmark_shares += (
            spend / benchmark_price
        )

        strategy_cash -= min(
            total_spend,
            strategy_cash,
        )

        benchmark_cash -= min(
            total_spend,
            benchmark_cash,
        )

        trades.append(
            {
                "date": date,
                "ticker": ticker,
                "action": "buy",
                "amount": spend,
                "transaction_cost": transaction_cost,
                "stock_price": stock_price,
                "benchmark_price": benchmark_price,
            }
        )

    return (
        strategy_cash,
        benchmark_cash,
        benchmark_shares,
        trades,
    )


def strategy_holdings_value(
    shares_by_ticker: defaultdict[str, float],
    valuation_row: pd.Series,
) -> float:
    """
    Value all current strategy holdings from the latest available
    prices.
    """

    return sum(
        shares * valuation_row[ticker]
        for ticker, shares
        in shares_by_ticker.items()
        if (
            ticker in valuation_row.index
            and not pd.isna(
                valuation_row[ticker]
            )
        )
    )


def make_equity_record(
    date: pd.Timestamp,
    strategy_cash: float,
    benchmark_cash: float,
    strategy_shares: defaultdict[str, float],
    benchmark_shares: float,
    valuation_row: pd.Series,
    benchmark: str,
    total_contributed: float,
) -> dict[str, float | pd.Timestamp]:
    """
    Build one daily equity-curve row.
    """

    strategy_value = (
        strategy_cash
        + strategy_holdings_value(
            strategy_shares,
            valuation_row,
        )
    )

    benchmark_value = (
        benchmark_cash
        + benchmark_shares
        * valuation_row[benchmark]
    )

    return {
        "date": date,
        "strategy": strategy_value,
        "benchmark": benchmark_value,
        "contributed": total_contributed,
        "strategy_cash": strategy_cash,
        "benchmark_cash": benchmark_cash,
    }


def simulate_periodic_investing(
    prices: pd.DataFrame,
    events: pd.DataFrame,
    benchmark: str,
    monthly_contribution: float | None = None,
    buy_fraction: float | None = None,
    start: str | None = None,
    *,
    contributions: float | pd.Series | None = None,
    contribution_frequency: str = "MS",
    position_sizer: PositionSizer | None = None,
    transaction_cost_bps: float = 0.0,
    slippage_bps: float = 0.0,
    benchmark_mode: str = "matched_events",
) -> BacktestResult:
    """
    Simulate a buy-only strategy funded by regular monthly
    contributions.

    Whenever a signal occurs:

        - the strategy invests a fraction of available cash;
        - the benchmark invests exactly the same dollar amount;
        - neither portfolio sells holdings.

    This keeps cash flows and investment timing matched between
    the strategy and benchmark.
    """

    if benchmark_mode != "matched_events":
        raise ValueError(
            "Only benchmark_mode='matched_events' is currently supported."
        )

    if start is not None:
        prices = (
            prices
            .loc[pd.Timestamp(start):]
            .copy()
        )
    else:
        prices = prices.copy()

    if contributions is None:
        contributions = monthly_contribution

    if contributions is None:
        raise ValueError(
            "Provide contributions or monthly_contribution."
        )

    if position_sizer is None:

        if buy_fraction is None:
            raise ValueError(
                "Provide position_sizer or buy_fraction."
            )

        position_sizer = fraction_of_cash(
            buy_fraction
        )

    validate_simulation_inputs(
        prices,
        benchmark,
        buy_fraction,
    )

    events = events.copy()

    if "action" not in events.columns:
        events["action"] = "buy"

    validate_events(
        events
    )

    validate_price_alignment(
        prices,
        events,
    )

    # Carry the most recently observed price forward for portfolio
    # valuation only. Signal generation should use original data.
    valuation_prices = prices.ffill()

    grouped_events = events_by_trade_day(
        events
    )

    contribution_schedule = build_contribution_schedule(
        prices=prices,
        contributions=contributions,
        contribution_frequency=contribution_frequency,
    )

    strategy_cash = 0.0
    benchmark_cash = 0.0

    strategy_shares = defaultdict(float)
    benchmark_shares = 0.0

    total_contributed = 0.0

    records = []
    trades = []

    for date, row in prices.iterrows():

        contribution = contribution_schedule.loc[
            date
        ]

        if contribution != 0:
            strategy_cash += (
                contribution
            )

            benchmark_cash += (
                contribution
            )

            total_contributed += (
                contribution
            )

        day_events = grouped_events.get(
            date
        )

        if (
            day_events is not None
        ):

            sell_events = day_events[
                day_events["action"] == "sell"
            ]

            if not sell_events.empty:

                (
                    strategy_cash,
                    sell_trades,
                ) = execute_sells(
                    tickers=list(sell_events["ticker"]),
                    row=row,
                    strategy_cash=strategy_cash,
                    strategy_shares=strategy_shares,
                    date=date,
                    transaction_cost_bps=transaction_cost_bps,
                    slippage_bps=slippage_bps,
                )

                trades.extend(sell_trades)

            buy_events = day_events[
                day_events["action"] == "buy"
            ]

            (
                strategy_cash,
                benchmark_cash,
                benchmark_shares,
                day_trades,
            ) = execute_sized_buys(
                day_events=buy_events,
                row=row,
                benchmark=benchmark,
                strategy_cash=strategy_cash,
                benchmark_cash=benchmark_cash,
                strategy_shares=strategy_shares,
                benchmark_shares=benchmark_shares,
                position_sizer=position_sizer,
                date=date,
                transaction_cost_bps=transaction_cost_bps,
                slippage_bps=slippage_bps,
            )

            trades.extend(day_trades)

        valuation_row = (
            valuation_prices.loc[date]
        )

        records.append(
            make_equity_record(
                date=date,
                strategy_cash=strategy_cash,
                benchmark_cash=benchmark_cash,
                strategy_shares=strategy_shares,
                benchmark_shares=benchmark_shares,
                valuation_row=valuation_row,
                benchmark=benchmark,
                total_contributed=total_contributed,
            )
        )

    equity = (
        pd.DataFrame(records)
        .set_index("date")
    )

    trades = pd.DataFrame(
        trades,
        columns=[
            "date",
            "ticker",
            "action",
            "amount",
            "transaction_cost",
            "stock_price",
            "benchmark_price",
        ],
    )

    metrics = performance_summary(
        equity,
        trades,
    )

    return BacktestResult(
        equity=equity,
        trades=trades,
        events=events,
        metrics=metrics,
    )


# ============================================================
# PERFORMANCE METRICS
# ============================================================

def total_return(
    equity_curve: pd.Series,
) -> float:
    """
    Calculate total return from the first to last equity value.
    """

    equity_curve = equity_curve.dropna()

    if len(equity_curve) < 2 or equity_curve.iloc[0] == 0:
        return 0.0

    return (
        equity_curve.iloc[-1]
        / equity_curve.iloc[0]
        - 1
    )


def cagr(
    equity_curve: pd.Series,
) -> float:
    """
    Calculate compound annual growth rate from an equity curve.
    """

    equity_curve = equity_curve.dropna()

    if len(equity_curve) < 2 or equity_curve.iloc[0] == 0:
        return 0.0

    years = (
        equity_curve.index[-1]
        - equity_curve.index[0]
    ).days / 365.25

    if years <= 0:
        return 0.0

    return (
        equity_curve.iloc[-1]
        / equity_curve.iloc[0]
    ) ** (1 / years) - 1


def annualised_volatility(
    equity_curve: pd.Series,
    periods_per_year: int = 252,
) -> float:
    """
    Calculate annualised volatility from periodic equity returns.
    """

    returns = (
        equity_curve
        .pct_change()
        .replace([float("inf"), float("-inf")], pd.NA)
        .dropna()
    )

    if returns.empty:
        return 0.0

    return (
        returns.std()
        * periods_per_year ** 0.5
    )


def max_drawdown(
    equity_curve: pd.Series,
) -> float:
    """
    Calculate the largest peak-to-trough drawdown.
    """

    equity_curve = equity_curve.dropna()

    if equity_curve.empty:
        return 0.0

    running_high = equity_curve.cummax()

    drawdowns = (
        equity_curve
        / running_high
        - 1
    )

    return drawdowns.min()


def sharpe_ratio(
    equity_curve: pd.Series,
    risk_free_rate: float = 0.0,
    periods_per_year: int = 252,
) -> float:
    """
    Calculate annualised Sharpe ratio from an equity curve.
    """

    returns = (
        equity_curve
        .pct_change()
        .replace([float("inf"), float("-inf")], pd.NA)
        .dropna()
    )

    if returns.empty or returns.std() == 0:
        return 0.0

    periodic_risk_free = (
        risk_free_rate
        / periods_per_year
    )

    excess_returns = (
        returns
        - periodic_risk_free
    )

    return (
        excess_returns.mean()
        / returns.std()
        * periods_per_year ** 0.5
    )


def time_invested(
    equity: pd.DataFrame,
    value_column: str = "strategy",
    cash_column: str = "strategy_cash",
) -> float:
    """
    Estimate the share of periods where capital is invested.
    """

    if cash_column not in equity.columns:
        return 0.0

    invested_value = (
        equity[value_column]
        - equity[cash_column]
    )

    return (
        invested_value > 0
    ).mean()


def cash_utilisation(
    equity: pd.DataFrame,
    value_column: str = "strategy",
    cash_column: str = "strategy_cash",
) -> float:
    """
    Estimate average share of portfolio value not sitting in cash.
    """

    if cash_column not in equity.columns:
        return 0.0

    valid = equity[value_column] > 0

    if not valid.any():
        return 0.0

    invested_share = (
        1
        - equity.loc[valid, cash_column]
        / equity.loc[valid, value_column]
    )

    return invested_share.mean()


def turnover(
    equity: pd.DataFrame,
    trades: pd.DataFrame,
    value_column: str = "strategy",
) -> float:
    """
    Estimate turnover as total traded value divided by average equity.
    """

    if trades.empty or "amount" not in trades.columns:
        return 0.0

    average_equity = equity[value_column].mean()

    if average_equity <= 0:
        return 0.0

    return (
        trades["amount"].sum()
        / average_equity
    )


def performance_summary(
    equity: pd.DataFrame,
    trades: pd.DataFrame | None = None,
    value_column: str = "strategy",
    risk_free_rate: float = 0.0,
    periods_per_year: int = 252,
) -> pd.Series:
    """
    Calculate a compact set of reusable performance metrics.
    """

    equity_curve = equity[value_column]

    if trades is None:
        trades = pd.DataFrame()

    return pd.Series(
        {
            "total_return": total_return(equity_curve),
            "cagr": cagr(equity_curve),
            "annualised_volatility": annualised_volatility(
                equity_curve,
                periods_per_year,
            ),
            "max_drawdown": max_drawdown(equity_curve),
            "sharpe_ratio": sharpe_ratio(
                equity_curve,
                risk_free_rate,
                periods_per_year,
            ),
            "time_invested": time_invested(
                equity,
                value_column=value_column,
            ),
            "cash_utilisation": cash_utilisation(
                equity,
                value_column=value_column,
            ),
            "turnover": turnover(
                equity,
                trades,
                value_column=value_column,
            ),
        }
    )


# ============================================================
# REPORTING
# ============================================================

def print_money_line(
    label: str,
    value: float,
) -> None:
    """
    Print a dollar result with labels aligned for console output.
    """

    print(
        f"{label:<21}"
        f"${value:,.2f}"
    )


def print_backtest_results(
    result_or_equity: BacktestResult | pd.DataFrame,
    trades: pd.DataFrame | None = None,
    benchmark_label: str = "Benchmark",
) -> None:
    """
    Print headline results from the completed backtest.
    """

    if isinstance(result_or_equity, BacktestResult):
        equity = result_or_equity.equity
        trades = result_or_equity.trades
    else:
        equity = result_or_equity

    if trades is None:
        trades = pd.DataFrame()

    final = equity.iloc[-1]

    difference = (
        final["strategy"]
        - final["benchmark"]
    )

    print("\nBACKTEST RESULT")

    print_money_line(
        "Total contributed:",
        final["contributed"],
    )

    print_money_line(
        "Strategy value:",
        final["strategy"],
    )

    print_money_line(
        f"{benchmark_label} value:",
        final["benchmark"],
    )

    print_money_line(
        "Difference:",
        difference,
    )

    print(
        f"Purchases made:      "
        f"{len(trades)}"
    )

    if not trades.empty:

        capital_deployed = (
            trades["amount"].sum()
        )

        print_money_line(
            "Capital deployed:",
            capital_deployed,
        )

    if final["benchmark"] > 0:

        relative_result = (
            final["strategy"]
            / final["benchmark"]
            - 1
        )

        print(
            f"Relative result:     "
            f"{relative_result:+.2%}"
        )


def plot_signal_distribution(
    counts: pd.Series,
    title: str = "Distribution of signals per month",
) -> None:
    """
    Plot the frequency distribution of monthly signal counts.
    """

    distribution = (
        counts
        .value_counts()
        .sort_index()
    )

    plt.figure(
        figsize=(9, 5)
    )

    plt.bar(
        distribution.index.astype(str),
        distribution.values,
    )

    plt.title(title)

    plt.xlabel(
        "Signals in month"
    )

    plt.ylabel(
        "Number of months"
    )

    plt.tight_layout()
    plt.show()


def plot_equity(
    equity: pd.DataFrame,
    strategy_label: str = "Strategy",
    benchmark_label: str = "Benchmark",
    title: str = "Strategy vs benchmark",
) -> None:
    """
    Plot strategy and benchmark portfolio values through time.
    """

    plt.figure(
        figsize=(11, 6)
    )

    plt.plot(
        equity.index,
        equity["strategy"],
        label=strategy_label,
    )

    plt.plot(
        equity.index,
        equity["benchmark"],
        label=benchmark_label,
    )

    plt.plot(
        equity.index,
        equity["contributed"],
        label="Cash contributed",
        linestyle="--",
    )

    plt.title(title)

    plt.ylabel(
        "Portfolio value ($)"
    )

    plt.legend()

    plt.tight_layout()
    plt.show()
