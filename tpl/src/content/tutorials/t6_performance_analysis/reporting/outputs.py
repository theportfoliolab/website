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

    formatted = formatted[column_order]

    for col in percentage_cols:
        if col in {"final_fund_value", "final_benchmark_value"}:
            formatted[col] = (formatted[col] - 1) * 100
        else:
            formatted[col] = formatted[col] * 100

    formatted[numeric_cols] = formatted[numeric_cols].round(2)

    return formatted


def export_summary(df: pd.DataFrame, path: str = "output/fund_report_summary.csv") -> None:
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