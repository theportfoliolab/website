import pandas as pd

from analytics.calculations import cumulative_growth, drawdown, excess_return
from analytics.summaries import build_summary_table
from reporting.charts import (
    setup_matplotlib_style,
    plot_cumulative_performance,
    plot_drawdown,
    plot_excess_return,
)

def load_returns(path: str) -> pd.DataFrame:
    df = pd.read_csv(path, parse_dates=["date"])

    required_cols = {"date", "fund", "benchmark"}
    if not required_cols.issubset(df.columns):
        raise ValueError("Missing required columns")

    df = df.sort_values("date")

    if df["date"].duplicated().any():
        raise ValueError("Duplicate dates detected")

    if df.isnull().any().any():
        raise ValueError("Missing values detected")

    return df


def main():
    setup_matplotlib_style()

    df = load_returns("data/sample_returns.csv")

    fund = df["fund"]
    benchmark = df["benchmark"]
    dates = df["date"]

    fund_cum = cumulative_growth(fund)
    benchmark_cum = cumulative_growth(benchmark)

    fund_dd = drawdown(fund_cum)
    excess = excess_return(fund, benchmark)

    summary = build_summary_table(
        fund_cumulative=fund_cum,
        benchmark_cumulative=benchmark_cum,
        fund_drawdown=fund_dd,
        excess_returns=excess,
    )

    print(summary)

    plot_cumulative_performance(dates, fund_cum, benchmark_cum)
    plot_drawdown(dates, fund_dd)
    plot_excess_return(dates, excess)


if __name__ == "__main__":
    main()