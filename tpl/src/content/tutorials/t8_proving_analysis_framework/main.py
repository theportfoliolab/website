import pandas as pd

from analytics.transforms import (
    build_portfolio_analysis_frame,
    load_market_analysis_frame,
    load_market_return_table,
    portfolio_returns_from_weights,
)
from analytics.summaries import (
    run_analysis,
    rank_funds,
    apply_monitoring_flags,
)
from reporting.outputs import export_summary, format_summary, print_flags
from reporting.charts import (
    setup_matplotlib_style,
    plot_cumulative_performance,
    plot_drawdown,
    plot_risk_return_scatter,
)


HOLDINGS = ["VOO", "QQQ", "IEFA", "EEM", "VNQ", "AGG"]
BENCHMARK = "VT"
PRICE_START = "2023-12-01"
PRICE_END = "2025-01-01"
ANALYSIS_START = "2024-01-31"
ANALYSIS_END = "2024-06-30"

WEIGHTS = {
    "VOO": 0.30,
    "QQQ": 0.25,
    "IEFA": 0.15,
    "EEM": 0.10,
    "VNQ": 0.10,
    "AGG": 0.10,
}

TICKERS = [*HOLDINGS, BENCHMARK]


def get_holdings_analysis_frame():
    return load_market_analysis_frame(
        holdings=HOLDINGS,
        benchmark_ticker=BENCHMARK,
        price_start=PRICE_START,
        price_end=PRICE_END,
        analysis_start=ANALYSIS_START,
        analysis_end=ANALYSIS_END,
    )


def analyse_frame(df):
    summary = run_analysis(df)
    ranked = rank_funds(summary)
    monitored = apply_monitoring_flags(df, ranked)
    return format_summary(monitored)


def get_analysis_return_table():
    return load_market_return_table(
        tickers=TICKERS,
        price_start=PRICE_START,
        price_end=PRICE_END,
        analysis_start=ANALYSIS_START,
        analysis_end=ANALYSIS_END,
    )


def build_current_portfolio_frame(analysis_returns):
    portfolio_returns = portfolio_returns_from_weights(
        returns=analysis_returns,
        weights=WEIGHTS,
    )
    return build_portfolio_analysis_frame(
        portfolio_returns=portfolio_returns,
        benchmark_returns=analysis_returns[BENCHMARK],
        portfolio_name="Current_Portfolio",
    )


def build_benchmark_frame(analysis_returns):
    return build_portfolio_analysis_frame(
        portfolio_returns=analysis_returns[BENCHMARK],
        benchmark_returns=analysis_returns[BENCHMARK],
        portfolio_name="Benchmark",
    )


def export_and_print_summary(formatted, path, heading, show_flags=False):
    export_summary(formatted, path=path)
    if show_flags:
        print_flags(formatted)
    print(f"\n{heading}:")
    print(formatted)


def plot_reporting_views(holdings_df, portfolio_df):
    plot_cumulative_performance(
        holdings_df,
        portfolio=portfolio_df,
        save_path="output/holdings_and_portfolio_comparison.png",
    )
    plot_drawdown(
        holdings_df,
        portfolio=portfolio_df,
        save_path="output/drawdown_overview.png",
    )
    plot_risk_return_scatter(
        holdings_df,
        portfolio=portfolio_df,
        save_path="output/risk_return_overview.png",
    )


def main():
    setup_matplotlib_style()

    holdings_df = get_holdings_analysis_frame()
    analysis_returns = get_analysis_return_table()
    portfolio_df = build_current_portfolio_frame(analysis_returns)
    benchmark_df = build_benchmark_frame(analysis_returns)

    formatted_holdings = analyse_frame(holdings_df)
    formatted_portfolio = analyse_frame(portfolio_df)

    export_and_print_summary(
        formatted_holdings,
        path="output/holdings_report_summary.csv",
        heading="Formatted holdings summary",
        show_flags=True,
    )
    export_and_print_summary(
        formatted_portfolio,
        path="output/portfolio_report_summary.csv",
        heading="Portfolio summary",
    )

    combined_df = pd.concat(
        [holdings_df, benchmark_df, portfolio_df],
        ignore_index=True,
    )
    formatted_combined = analyse_frame(combined_df)
    export_and_print_summary(
        formatted_combined,
        path="output/combined_report_summary.csv",
        heading="Combined summary",
    )
    plot_reporting_views(holdings_df, portfolio_df)


if __name__ == "__main__":
    main()
