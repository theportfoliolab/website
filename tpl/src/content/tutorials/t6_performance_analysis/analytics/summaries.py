import pandas as pd

def build_summary_table(
    fund_cumulative: pd.Series,
    benchmark_cumulative: pd.Series,
    fund_drawdown: pd.Series,
    excess_returns: pd.Series,
) -> pd.DataFrame:
    summary = pd.DataFrame(
        {
            "Metric": [
                "Final Fund Value",
                "Final Benchmark Value",
                "Maximum Drawdown",
                "Average Excess Return",
            ],
            "Value": [
                fund_cumulative.iloc[-1],
                benchmark_cumulative.iloc[-1],
                fund_drawdown.min(),
                excess_returns.mean(),
            ],
        }
    )

    return summary