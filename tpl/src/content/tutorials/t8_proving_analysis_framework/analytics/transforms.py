import pandas as pd

from pathlib import Path
import yfinance as yf

def load_returns(path: str) -> pd.DataFrame:
    input_path = Path(path)

    if input_path.is_dir():
        frames = []

        for csv_path in sorted(input_path.glob("*.csv")):
            df = pd.read_csv(csv_path, parse_dates=["date"])

            required_cols = {"date", "fund", "benchmark"}
            if not required_cols.issubset(df.columns):
                raise ValueError(f"Missing required columns in {csv_path.name}")

            df["fund_name"] = csv_path.stem
            frames.append(df)

        if not frames:
            raise ValueError("No CSV files found in input folder")

        df = pd.concat(frames, ignore_index=True)

    else:
        df = pd.read_csv(input_path, parse_dates=["date"])

        required_cols = {"date", "fund_name", "fund", "benchmark"}
        if not required_cols.issubset(df.columns):
            raise ValueError("Missing required columns")

    df = df.sort_values(["fund_name", "date"]).reset_index(drop=True)

    if df.duplicated(subset=["fund_name", "date"]).any():
        raise ValueError("Duplicate fund_name/date combinations detected")

    if df.isnull().any().any():
        raise ValueError("Missing values detected")

    return df


def download_price_history(tickers, start, end):
    cache_dir = Path(".cache") / "yfinance"
    cache_dir.mkdir(parents=True, exist_ok=True)
    yf.set_tz_cache_location(str(cache_dir.resolve()))

    prices = yf.download(
        tickers=tickers,
        start=start,
        end=end,
        auto_adjust=True,
        progress=False,
    )

    if prices.empty:
        raise ValueError("No price data was returned for the requested tickers and date range")

    if isinstance(prices.columns, pd.MultiIndex):
        if "Close" not in prices.columns.get_level_values(0):
            raise ValueError("Downloaded price data did not include a Close column")
        prices = prices["Close"]

    if isinstance(prices, pd.Series):
        prices = prices.to_frame()

    prices = prices.dropna(how="all")
    if prices.empty:
        raise ValueError("Price history was empty after dropping all-null rows")

    return prices


def prices_to_monthly_returns(prices):
    monthly_prices = prices.resample("ME").last()
    monthly_returns = monthly_prices.pct_change().dropna(how="all")
    if monthly_returns.empty:
        raise ValueError("Monthly return series was empty after resampling")
    return monthly_returns


def load_market_analysis_frame(
    holdings: list[str],
    benchmark_ticker: str,
    price_start: str,
    price_end: str,
    analysis_start: str,
    analysis_end: str,
) -> pd.DataFrame:
    tickers = [*holdings, benchmark_ticker]

    prices = download_price_history(
        tickers=tickers,
        start=price_start,
        end=price_end,
    )

    monthly_returns = prices_to_monthly_returns(prices)
    analysis_returns = monthly_returns[
        (monthly_returns.index >= analysis_start) &
        (monthly_returns.index <= analysis_end)
    ]

    if analysis_returns.empty:
        raise ValueError("The analysis period did not contain any monthly returns")

    if benchmark_ticker not in analysis_returns.columns:
        raise ValueError(f"Benchmark ticker {benchmark_ticker} was not found in returns data")

    frames = []

    for ticker in analysis_returns.columns:
        if ticker == benchmark_ticker:
            continue

        frames.append(
            pd.DataFrame(
                {
                    "date": analysis_returns.index,
                    "fund_name": ticker,
                    "fund": analysis_returns[ticker].values,
                    "benchmark": analysis_returns[benchmark_ticker].values,
                }
            )
        )

    if not frames:
        raise ValueError("No holdings were available after excluding the benchmark ticker")

    return pd.concat(frames, ignore_index=True)


def portfolio_returns_from_weights(
    returns: pd.DataFrame,
    weights: dict[str, float],
) -> pd.Series:
    missing = [ticker for ticker in weights if ticker not in returns.columns]
    if missing:
        raise ValueError(f"Missing return series for tickers: {missing}")

    weighted = pd.DataFrame(
        {ticker: returns[ticker] * weight for ticker, weight in weights.items()}
    )

    return weighted.sum(axis=1)


def build_portfolio_analysis_frame(
    portfolio_returns: pd.Series,
    benchmark_returns: pd.Series,
    portfolio_name: str = "Example_Portfolio",
) -> pd.DataFrame:
    df = pd.DataFrame(
        {
            "date": portfolio_returns.index,
            "fund_name": portfolio_name,
            "fund": portfolio_returns.values,
            "benchmark": benchmark_returns.reindex(portfolio_returns.index).values,
        }
    )

    if df["benchmark"].isnull().any():
        raise ValueError("Benchmark series could not be aligned to portfolio returns")

    return df.reset_index(drop=True)


def load_market_return_table(
    tickers: list[str],
    price_start: str,
    price_end: str,
    analysis_start: str,
    analysis_end: str,
) -> pd.DataFrame:
    prices = download_price_history(
        tickers=tickers,
        start=price_start,
        end=price_end,
    )

    monthly_returns = prices_to_monthly_returns(prices)
    analysis_returns = monthly_returns[
        (monthly_returns.index >= analysis_start) &
        (monthly_returns.index <= analysis_end)
    ]

    if analysis_returns.empty:
        raise ValueError("The analysis period did not contain any monthly returns")

    return analysis_returns
