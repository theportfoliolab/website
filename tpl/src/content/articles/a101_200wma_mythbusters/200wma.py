from __future__ import annotations

from dataclasses import dataclass

import pandas as pd

from chart_creator import (
    bar_chart,
    multi_line_chart,
    capital_state_chart,
    setup_matplotlib_style,
)

from backtesting import (
    BacktestResult,
    crosses_above,
    download_prices,
    fraction_of_cash,
    monthly_event_counts,
    moving_average,
    print_backtest_results,
    print_event_statistics,
    require_columns,
    resample_prices,
    signals_to_events,
    simulate_periodic_investing,
)


# ============================================================
# ARTICLE CONFIGURATION
# ============================================================

QUALITY_STOCKS = [
    "MSFT", "AAPL", "GOOGL", "AMZN", "NVDA",
    "META", "UNH", "LLY", "JPM",
    "V", "MA", "PG", "COST", "HD",
    "AVGO", "ADBE", "PEP", "KO", "XOM",
    "JNJ", "MRK", "ABBV", "MCD", "NKE",
    "WMT", "TGT", "RTX", "CAT", "DE",
    "NEE", "DUK", "ORCL", "CRM", "CSCO", "INTC",
]

BENCHMARK = "SPY"
BERKSHIRE_PROXY = "BRK-B"

START = "2015-01-01"
END = None

# Enough calendar time to establish a 200-week moving average
# before the formal test period begins.
WARMUP_DAYS = 1600

SIGNAL_FREQUENCY = "W-FRI"
MA_PERIODS = 200

MONTHLY_CONTRIBUTION = 100.0

# Choose this using signal-frequency evidence, then lock it
# before examining the final backtest result.
BUY_FRACTION = 0.40


# ============================================================
# ARTICLE DATA
# ============================================================

@dataclass(frozen=True)
class SignalData:
    """
    Intermediate data used to construct and inspect the
    200-week moving-average signal.
    """

    weekly_prices: pd.DataFrame
    moving_average: pd.DataFrame
    signals: pd.DataFrame


# ============================================================
# DATA PREPARATION
# ============================================================

def load_article_prices() -> pd.DataFrame:
    """
    Download and validate the price history needed by the
    article experiment.
    """

    tickers = QUALITY_STOCKS + [BENCHMARK] + [BERKSHIRE_PROXY]

    prices = download_prices(
        tickers=tickers,
        start=START,
        end=END,
        warmup_days=WARMUP_DAYS,
    )

    return require_columns(
        prices,
        tickers,
        "required",
    )


# ============================================================
# SIGNAL CONSTRUCTION
# ============================================================

def build_signal_data(
    daily_prices: pd.DataFrame,
) -> SignalData:
    """
    Construct the weekly prices, moving average and confirmed
    signals for the quality-stock universe.
    """

    quality_prices = require_columns(
        daily_prices,
        QUALITY_STOCKS,
        "quality stock",
    )

    weekly_prices = resample_prices(
        quality_prices,
        frequency=SIGNAL_FREQUENCY,
    )

    average = moving_average(
        weekly_prices,
        periods=MA_PERIODS,
    )

    signals = crosses_above(
        weekly_prices,
        average,
    )

    signals = signals.loc[
        pd.Timestamp(START):
    ]

    return SignalData(
        weekly_prices=weekly_prices,
        moving_average=average,
        signals=signals,
    )


def build_events(
    signal_data: SignalData,
    daily_prices: pd.DataFrame,
) -> pd.DataFrame:
    """
    Convert weekly signals into executable daily events.
    """

    return signals_to_events(
        signals=signal_data.signals,
        execution_index=daily_prices.index,
        metadata={
            "signal_price": signal_data.weekly_prices,
            "moving_average": signal_data.moving_average,
            "rule": (
                f"{MA_PERIODS}-period moving average "
                f"on {SIGNAL_FREQUENCY} closes"
            ),
        },
    )


# ============================================================
# SIGNAL ANALYSIS
# ============================================================

def analyse_signal_frequency(
    events: pd.DataFrame,
    daily_prices: pd.DataFrame,
) -> pd.Series:
    """
    Measure how many confirmed signals occur each month.
    """

    counts = monthly_event_counts(
        events=events,
        start=START,
        end=daily_prices.index[-1],
    )

    print_event_statistics(
        counts
    )

    plot_signal_distribution(
        counts
    )

    return counts


def plot_signal_distribution(
    counts: pd.Series,
) -> None:
    """
    Plot the empirical distribution of monthly signal counts.
    """

    distribution = (
        counts
        .value_counts()
        .sort_index()
    )

    bar_chart(
        categories=distribution.index,
        values=distribution.values,
        title=(
            "Distribution of confirmed "
            "200-week moving-average signals"
        ),
        xlabel="Signals in month",
        ylabel="Number of months",
        grid=True,
        zero_line=False,
    )


# ============================================================
# ALLOCATION
# ============================================================

def print_allocation_rule(
    buy_fraction: float,
) -> None:
    """
    Report the allocation rule used for the backtest.
    """

    print(
        f"\nUsing BUY_FRACTION = "
        f"{buy_fraction:.0%}"
    )

    print(
        "This value should be selected from "
        "the signal-frequency evidence and "
        "locked before interpreting returns."
    )
    
def get_cash_series(
    result: BacktestResult,
) -> pd.Series:
    """
    Extract the strategy cash series from result.equity.

    This helper looks for a column containing the word 'cash'.
    Adjust this if your backtesting output uses a different name.
    """

    equity = result.equity

    cash_candidates = [
        column
        for column in equity.columns
        if "cash" in str(column).lower()
    ]

    if not cash_candidates:
        raise ValueError(
            "Could not identify a cash column in result.equity. "
            f"Available columns: {list(equity.columns)}"
        )

    return equity[cash_candidates[0]].astype(float)


def build_capital_progress(
    result: BacktestResult,
) -> pd.DataFrame:
    """
    Build a time series showing how contributed capital is split
    between cash and deployed investment capital.

    Because this strategy does not sell and uses zero transaction
    costs and slippage, deployed capital is simply:

        cumulative contributions - cash
    """

    cash = get_cash_series(result)

    contribution_flow = pd.Series(
        0.0,
        index=cash.index,
    )

    active_cash = cash.loc[
        pd.Timestamp(START):
    ]

    first_trading_days = (
        active_cash
        .groupby(active_cash.index.to_period("M"))
        .apply(lambda month: month.index[0])
    )

    contribution_flow.loc[
        first_trading_days
    ] = MONTHLY_CONTRIBUTION

    cumulative_contributions = (
        contribution_flow.cumsum()
    )

    deployed_capital = (
        cumulative_contributions - cash
    ).clip(lower=0)

    purchase_mask = (
        deployed_capital
        .diff()
        .fillna(0)
        .gt(0)
    )

    return pd.DataFrame(
        {
            "cash": cash,
            "deployed_capital": deployed_capital,
            "cumulative_contributions": cumulative_contributions,
            "purchase_event": purchase_mask,
        },
        index=cash.index,
    )


def plot_capital_allocation_result(
    result: BacktestResult,
) -> None:
    """
    Plot how contributed capital moved from cash into investments.

    This uses capital spent rather than mark-to-market portfolio value.
    """

    capital = build_capital_progress(
        result
    )


    monthly = capital.resample("MS").last()

    capital_state_chart(
        dates=monthly.index,
        deployed=monthly["deployed_capital"],
        cash=monthly["cash"],
        title="Accumulation and Deployment of Capital",
    )


# ============================================================
# BACKTEST
# ============================================================

def run_backtest(
    daily_prices: pd.DataFrame,
    events: pd.DataFrame,
    benchmark_ticker: str = BENCHMARK,
) -> BacktestResult:
    """
    Run periodic investing using the confirmed signals.

    The benchmark ticker can be swapped so the same strategy
    can be compared against SPY, BRK-B, or another proxy
    using identical contribution timing.
    """

    return simulate_periodic_investing(
        prices=daily_prices,
        events=events,
        benchmark=benchmark_ticker,
        contributions=MONTHLY_CONTRIBUTION,
        contribution_frequency="MS",
        position_sizer=fraction_of_cash(
            BUY_FRACTION
        ),
        transaction_cost_bps=0,
        slippage_bps=0,
        start=START,
    )
    
def get_strategy_and_benchmark_series(
    result: BacktestResult,
) -> tuple[pd.Index, pd.Series, pd.Series]:
    """
    Extract the strategy and benchmark equity series from
    a BacktestResult.
    """

    equity = result.equity

    strategy_candidates = [
        column
        for column in equity.columns
        if "strategy" in str(column).lower()
    ]

    benchmark_candidates = [
        column
        for column in equity.columns
        if (
            "benchmark" in str(column).lower()
            or "spy" in str(column).lower()
            or "brk" in str(column).lower()
        )
    ]

    if not strategy_candidates:
        raise ValueError(
            "Could not identify a strategy equity column. "
            f"Available columns: {list(equity.columns)}"
        )

    if not benchmark_candidates:
        raise ValueError(
            "Could not identify a benchmark equity column. "
            f"Available columns: {list(equity.columns)}"
        )

    strategy_column = strategy_candidates[0]
    benchmark_column = benchmark_candidates[0]

    return (
        equity.index,
        equity[strategy_column],
        equity[benchmark_column],
    )


# ============================================================
# RESULTS
# ============================================================

def present_backtest_results(
    result: BacktestResult,
    daily_prices: pd.DataFrame,
    events: pd.DataFrame,
) -> None:
    """
    Print the backtest statistics and produce the article
    charts.
    """

    print_backtest_results(
        result,
        benchmark_label=f"{BENCHMARK} benchmark",
    )

    plot_equity_result(
        result
    )

    plot_berkshire_comparison_result(
        daily_prices,
        events,
    )

    plot_capital_allocation_result(
        result
    )


def plot_equity_result(
    result: BacktestResult,
) -> None:
    """
    Plot strategy and SPY benchmark equity using chart_creator.
    """

    dates, strategy_series, benchmark_series = (
        get_strategy_and_benchmark_series(result)
    )

    multi_line_chart(
        x=dates,
        series={
            (
                "200-week moving-average "
                "quality-stock strategy"
            ): strategy_series,
            (
                f"{BENCHMARK} on identical purchase dates"
            ): benchmark_series,
        },
        title=(
            "200-week moving-average strategy "
            f"vs matched {BENCHMARK} purchases"
        ),
        xlabel="Date",
        ylabel="Portfolio value ($)",
        grid=True,
    )
    
def plot_berkshire_comparison_result(
    daily_prices: pd.DataFrame,
    events: pd.DataFrame,
) -> None:
    """
    Plot the strategy against matched BRK.B purchases.

    This is not a like-for-like comparison with Berkshire's full
    capital-allocation machine, but it gives a useful proxy chart
    for article discussion.
    """

    brkb_result = run_backtest(
        daily_prices,
        events,
        benchmark_ticker=BERKSHIRE_PROXY,
    )

    dates, strategy_series, benchmark_series = (
        get_strategy_and_benchmark_series(brkb_result)
    )

    multi_line_chart(
        x=dates,
        series={
            (
                "200-week moving-average "
                "quality-stock strategy"
            ): strategy_series,
            (
                f"{BERKSHIRE_PROXY} on identical purchase dates"
            ): benchmark_series,
        },
        title=(
            "200-week moving-average strategy "
            f"vs matched {BERKSHIRE_PROXY} purchases"
        ),
        xlabel="Date",
        ylabel="Portfolio value ($)",
        grid=True,
    )


# ============================================================
# ARTICLE EXPERIMENT
# ============================================================

def run_article_experiment() -> BacktestResult:
    """
    Execute the complete article experiment.
    """

    daily_prices = load_article_prices()

    signal_data = build_signal_data(
        daily_prices
    )

    events = build_events(
        signal_data,
        daily_prices,
    )

    analyse_signal_frequency(
        events,
        daily_prices,
    )

    print_allocation_rule(
        BUY_FRACTION
    )

    result = run_backtest(
        daily_prices,
        events,
    )

    present_backtest_results(
        result,
        daily_prices,
        events,
    )

    return result


def main() -> None:
    setup_matplotlib_style()
    run_article_experiment()


if __name__ == "__main__":
    main()