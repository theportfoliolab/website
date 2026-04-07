from pathlib import Path

import pandas as pd


def format_summary(df: pd.DataFrame) -> pd.DataFrame:
    formatted = df.copy()

    column_order = [
        "fund_name",
        "final_fund_value",
        "final_benchmark_value",
        "max_drawdown",
        "average_excess_return",
        "return_rank",
        "drawdown_rank",
        "excess_rank",
        "composite_score",
        "underperformance_flag",
        "drawdown_breach_flag",
        "requires_review",
    ]

    percentage_cols = [
        "final_fund_value",
        "final_benchmark_value",
        "max_drawdown",
        "average_excess_return",
    ]

    non_numeric_cols = {
        "fund_name",
        "underperformance_flag",
        "drawdown_breach_flag",
        "requires_review",
    }

    numeric_cols = [col for col in column_order if col not in non_numeric_cols]

    for col in percentage_cols:
        if col in {"final_fund_value", "final_benchmark_value"}:
            formatted[col] = (formatted[col] - 1) * 100
        else:
            formatted[col] = formatted[col] * 100

    formatted[numeric_cols] = formatted[numeric_cols].round(2)

    return formatted[column_order]


def export_summary(df: pd.DataFrame, path: str = "output/fund_report_summary.csv") -> None:
    output_path = Path(path)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    df.to_csv(output_path, index=False)


def export_table(df: pd.DataFrame, path: str) -> None:
    output_path = Path(path)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    df.to_csv(output_path, index=False)


def print_flags(df: pd.DataFrame) -> None:
    flagged = df[df["requires_review"]]

    if flagged.empty:
        print("\nNo funds require review.")
    else:
        print("\nFunds requiring review:")
        for fund_name in flagged["fund_name"]:
            print(f"- {fund_name}")


def compare_portfolio_summaries(
    original_formatted: pd.DataFrame,
    rebalanced_formatted: pd.DataFrame,
) -> pd.DataFrame:
    original = original_formatted.iloc[0]
    rebalanced = rebalanced_formatted.iloc[0]

    comparison = pd.DataFrame(
        {
            "metric": [
                "Final Value (%)",
                "Benchmark Value (%)",
                "Maximum Drawdown (%)",
                "Average Excess Return (%)",
            ],
            "original_portfolio": [
                original["final_fund_value"],
                original["final_benchmark_value"],
                original["max_drawdown"],
                original["average_excess_return"],
            ],
            "rebalanced_portfolio": [
                rebalanced["final_fund_value"],
                rebalanced["final_benchmark_value"],
                rebalanced["max_drawdown"],
                rebalanced["average_excess_return"],
            ],
        }
    )

    comparison["change"] = (
        comparison["rebalanced_portfolio"] - comparison["original_portfolio"]
    ).round(2)

    return comparison


def print_comparison_facts(comparison_df: pd.DataFrame) -> None:
    final_value_change = comparison_df.loc[
        comparison_df["metric"] == "Final Value (%)",
        "change",
    ].iloc[0]
    drawdown_original = comparison_df.loc[
        comparison_df["metric"] == "Maximum Drawdown (%)",
        "original_portfolio",
    ].iloc[0]
    drawdown_rebalanced = comparison_df.loc[
        comparison_df["metric"] == "Maximum Drawdown (%)",
        "rebalanced_portfolio",
    ].iloc[0]

    print(f"\nReturn changed by {final_value_change:.2f} percentage points.")
    print(
        f"Maximum drawdown moved from {drawdown_original:.2f}% "
        f"to {drawdown_rebalanced:.2f}%."
    )
