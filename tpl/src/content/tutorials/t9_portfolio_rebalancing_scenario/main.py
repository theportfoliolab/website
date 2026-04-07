import pandas as pd

from analytics.summaries import apply_monitoring_flags, rank_funds, run_analysis
from analytics.transforms import (
    build_portfolio_analysis_frame,
    load_market_analysis_frame,
    load_market_return_table,
    portfolio_returns_from_weights,
)
from reporting.charts import (
    plot_cumulative_performance,
    plot_drawdown,
    plot_risk_return_scatter,
    setup_matplotlib_style,
)
from reporting.outputs import (
    compare_portfolio_summaries,
    export_summary,
    export_table,
    format_summary,
    print_comparison_facts,
    print_flags,
)


HOLDINGS = ["VOO", "QQQ", "IEFA", "EEM", "VNQ", "AGG"]
BENCHMARK = "VT"
PRICE_START = "2023-12-01"
PRICE_END = "2025-01-01"
ANALYSIS_START = "2024-01-31"
ANALYSIS_END = "2024-06-30"
EVALUATION_START = "2024-07-31"
EVALUATION_END = "2024-12-31"

WEIGHTS = {
    "VOO": 0.20,
    "QQQ": 0.20,
    "IEFA": 0.20,
    "EEM": 0.10,
    "VNQ": 0.25,
    "AGG": 0.05,
}

REVISED_WEIGHTS = {
    "VOO": 0.20,
    "QQQ": 0.20,
    "IEFA": 0.05,
    "EEM": 0.15,
    "VNQ": 0.20,
    "AGG": 0.20,
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


def get_return_table(start_date, end_date):
    return load_market_return_table(
        tickers=TICKERS,
        price_start=PRICE_START,
        price_end=PRICE_END,
        analysis_start=start_date,
        analysis_end=end_date,
    )


def analyse_frame(df):
    summary = run_analysis(df)
    ranked = rank_funds(summary)
    monitored = apply_monitoring_flags(df, ranked)
    return format_summary(monitored)


def build_portfolio_frame(returns, weights, name):
    portfolio_returns = portfolio_returns_from_weights(
        returns=returns,
        weights=weights,
    )
    return build_portfolio_analysis_frame(
        portfolio_returns=portfolio_returns,
        benchmark_returns=returns[BENCHMARK],
        portfolio_name=name,
    )


def build_benchmark_frame(returns):
    return build_portfolio_analysis_frame(
        portfolio_returns=returns[BENCHMARK],
        benchmark_returns=returns[BENCHMARK],
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


def run_analysis_period():
    holdings_df = get_holdings_analysis_frame()
    analysis_returns = get_return_table(ANALYSIS_START, ANALYSIS_END)
    portfolio_df = build_portfolio_frame(analysis_returns, WEIGHTS, "Current_Portfolio")
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

    combined_df = pd.concat([holdings_df, benchmark_df, portfolio_df], ignore_index=True)
    formatted_combined = analyse_frame(combined_df)
    export_and_print_summary(
        formatted_combined,
        path="output/combined_report_summary.csv",
        heading="Combined summary",
    )

    plot_reporting_views(holdings_df, portfolio_df)


def run_evaluation_period():
    evaluation_returns = get_return_table(EVALUATION_START, EVALUATION_END)
    original_eval_df = build_portfolio_frame(
        evaluation_returns,
        WEIGHTS,
        "Original_Portfolio",
    )
    rebalanced_eval_df = build_portfolio_frame(
        evaluation_returns,
        REVISED_WEIGHTS,
        "Rebalanced_Portfolio",
    )

    formatted_original_eval = analyse_frame(original_eval_df)
    formatted_rebalanced_eval = analyse_frame(rebalanced_eval_df)

    export_and_print_summary(
        formatted_original_eval,
        path="output/original_portfolio_evaluation_summary.csv",
        heading="Original portfolio evaluation summary",
    )
    export_and_print_summary(
        formatted_rebalanced_eval,
        path="output/rebalanced_portfolio_evaluation_summary.csv",
        heading="Rebalanced portfolio evaluation summary",
    )

    comparison_table = compare_portfolio_summaries(
        formatted_original_eval,
        formatted_rebalanced_eval,
    )
    export_table(
        comparison_table,
        path="output/evaluation_portfolio_comparison.csv",
    )
    print("\nEvaluation comparison:")
    print(comparison_table)
    print_comparison_facts(comparison_table)

    plot_cumulative_performance(
        original_eval_df,
        portfolio=rebalanced_eval_df,
        save_path="output/evaluation_portfolio_comparison.png",
    )


def main():
    setup_matplotlib_style()
    run_analysis_period()
    run_evaluation_period()


if __name__ == "__main__":
    main()
