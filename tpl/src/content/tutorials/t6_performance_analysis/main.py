from analytics.calculations import cumulative_growth, drawdown, excess_return
from analytics.summaries import build_summary_table
from analytics.transforms import load_returns
from reporting.charts import (
    setup_matplotlib_style,
    plot_cumulative_performance,
    plot_drawdown,
    plot_excess_return,
)

import argparse

def parse_args():
    parser = argparse.ArgumentParser(
        description="Fund performance comparison tool"
    )

    parser.add_argument(
        "input_path",
        help="Path to a CSV file or folder of CSV files"
    )

    return parser.parse_args()


from analytics.summaries import (
    run_analysis,
    rank_funds,
    apply_monitoring_flags,
)

from analytics.transforms import load_returns
from analytics.summaries import (
    run_analysis,
    rank_funds,
    apply_monitoring_flags,
)
from reporting.outputs import format_summary, export_summary, print_flags
from reporting.charts import (
    setup_matplotlib_style,
    plot_cumulative_performance,
)

def main():
    args = parse_args()

    setup_matplotlib_style()

    df = load_returns(args.input_path)

    if df["fund_name"].nunique() < 2:
        print("Warning: only one fund identified, comparison output will be limited.")

    summary = run_analysis(df)
    ranked = rank_funds(summary)
    monitored = apply_monitoring_flags(df, ranked)

    formatted = format_summary(monitored)

    export_summary(formatted)
    print_flags(formatted)
    print("\nFormatted summary:")
    print(formatted)

    plot_cumulative_performance(df, save_path="output/fund_comparison.png")


if __name__ == "__main__":
    main()

