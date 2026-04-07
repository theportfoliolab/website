import pandas as pd

def apply_monitoring_flags(df: pd.DataFrame, summary: pd.DataFrame) -> pd.DataFrame:
    flagged = summary.copy()

    underperformance_flags = []
    drawdown_flags = []

    for fund_name, group in df.groupby("fund_name"):
        group = group.sort_values("date")

        fund_cum = cumulative_growth(group["fund"])
        fund_dd = drawdown(fund_cum)
        excess = excess_return(group["fund"], group["benchmark"])

        underperformance_flags.append(
            rolling_underperformance_flag(excess)
        )
        drawdown_flags.append(
            drawdown_breach_flag(fund_dd)
        )

    flagged["underperformance_flag"] = underperformance_flags
    flagged["drawdown_breach_flag"] = drawdown_flags

    flagged["requires_review"] = (
        flagged["underperformance_flag"] |
        flagged["drawdown_breach_flag"]
    )

    return flagged

def rolling_underperformance_flag(
    excess_returns: pd.Series,
    window: int = 3,
    threshold: float = 0.0,
) -> bool:
    rolling_mean = excess_returns.rolling(window).mean()
    return bool((rolling_mean < threshold).any())


def drawdown_breach_flag(
    drawdown_series: pd.Series,
    threshold: float = -0.10,
) -> bool:
    return bool((drawdown_series < threshold).any())

def rank_funds(summary: pd.DataFrame) -> pd.DataFrame:
    ranked = summary.copy()

    RETURN_WEIGHT = 0.45
    DRAWDOWN_WEIGHT = 0.35
    EXCESS_WEIGHT = 0.20

    ranked["return_rank"] = ranked["final_fund_value"].rank(ascending=False)
    ranked["drawdown_rank"] = ranked["max_drawdown"].rank(ascending=False)
    ranked["excess_rank"] = ranked["average_excess_return"].rank(ascending=False)

    ranked["composite_score"] = (
        ranked["return_rank"] * RETURN_WEIGHT +
        ranked["drawdown_rank"] * DRAWDOWN_WEIGHT +
        ranked["excess_rank"] * EXCESS_WEIGHT
    )

    return ranked.sort_values("composite_score").reset_index(drop=True)

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

from analytics.calculations import cumulative_growth, drawdown, excess_return

def summarise_fund_metrics(
    fund_cumulative: pd.Series,
    benchmark_cumulative: pd.Series,
    fund_drawdown: pd.Series,
    excess_returns: pd.Series,
) -> dict:
    return {
        "final_fund_value": fund_cumulative.iloc[-1],
        "final_benchmark_value": benchmark_cumulative.iloc[-1],
        "max_drawdown": fund_drawdown.min(),
        "average_excess_return": excess_returns.mean(),
    }


def build_summary_table(
    fund_cumulative: pd.Series,
    benchmark_cumulative: pd.Series,
    fund_drawdown: pd.Series,
    excess_returns: pd.Series,
) -> pd.DataFrame:
    metrics = summarise_fund_metrics(
        fund_cumulative=fund_cumulative,
        benchmark_cumulative=benchmark_cumulative,
        fund_drawdown=fund_drawdown,
        excess_returns=excess_returns,
    )

    summary = pd.DataFrame(
        {
            "Metric": [
                "Final Fund Value",
                "Final Benchmark Value",
                "Maximum Drawdown",
                "Average Excess Return",
            ],
            "Value": [
                metrics["final_fund_value"],
                metrics["final_benchmark_value"],
                metrics["max_drawdown"],
                metrics["average_excess_return"],
            ],
        }
    )

    return summary


def run_analysis(df: pd.DataFrame) -> pd.DataFrame:
    rows = []

    for fund_name, group in df.groupby("fund_name"):
        group = group.sort_values("date")

        fund = group["fund"]
        benchmark = group["benchmark"]

        fund_cum = cumulative_growth(fund)
        benchmark_cum = cumulative_growth(benchmark)
        fund_dd = drawdown(fund_cum)
        excess = excess_return(fund, benchmark)

        metrics = summarise_fund_metrics(
            fund_cumulative=fund_cum,
            benchmark_cumulative=benchmark_cum,
            fund_drawdown=fund_dd,
            excess_returns=excess,
        )

        rows.append({
            "fund_name": fund_name,
            **metrics,
            "periods": len(group),
        })

    return pd.DataFrame(rows).sort_values("fund_name").reset_index(drop=True)