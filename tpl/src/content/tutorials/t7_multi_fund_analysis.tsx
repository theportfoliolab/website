import Body from "@/components/content/body"
import Disclaimer from "@/components/content/disclaimer"
import { Text } from "@/components/content/text"
import type { PostMeta } from "@/components/content/types"

export const meta: PostMeta = {
    title: "Building a Fund Performance Analysis Workflow in Python Part 2: Multi Fund Comparison and Monitoring",
    description:
        "A direct follow on from Part 1, extending the fund performance analysis workflow into a multi fund comparison, ranking, monitoring, and reporting system.",
    date: "2026-04-02",
    tags: ["finance", "python", "analysis", "pandas"],
    type: "tutorial",
    slug: "fund-manager-performance-analysis-tool-python-part-2",
    nextInSeriesSlug: "fund-manager-performance-analysis-tool-python-part-3",
    seriesId: "fund-performance-analysis-workflow",
    seriesTitle: "Fund Manager Performance Analysis Tool",
    seriesDescription:
        "Build the workflow from core metrics through to real data, portfolio review, and rebalance evaluation.",
    homepagePriority: 1,
}

export default function Tutorial() {
    return (
        <Body>
            <Disclaimer
                linkHref="/tutorials/fund-manager-performance-analysis-tool-python"
                linkLabel="Open Part 1"
            >
                This tutorial is a direct follow on from Part 1, and assumes you already have the project files and code from that tutorial in place.
            </Disclaimer>


            <Text
                content={`Ensure you already have the required project files, folder structure, and core analysis functions built in part 1 before continuing here.

In Part 1, we built a performance analysis pipeline for a single fund. In this tutorial, we extend that system to compare and monitor multiple fund managers.`}
            />

            <Text
                content={`If you are starting from a clean environment, make sure pandas, matplotlib, and cycler are installed before continuing. Part 2 still depends on the same core packages introduced in Part 1.`}
            />

            <Text
                heading="From Single Fund Analysis to Manager Comparison"
                content={`Part 1 of this tutorial ended with a system that can produce performance metrics for a single fund.

In practice, funds are rarely evaluated in isolation. Analysts are typically working across a group of managers, where the goal is to understand relative performance rather than absolute results.

Instead of asking whether a fund performed well on its own, we want to understand which managers are adding value, which are underperforming, and how those outcomes compare on a consistent basis. That is why we now need to add support for multiple funds to the analysis pipeline.`}
            />

            <Text
                heading="1. Starting Off: Flexible Multi Fund Loading"
                content={`In Part 1, we defined a simple data contract built around one file containing one fund and its benchmark. That kept things clean while we focused on the core performance calculations.

But to make comparisons, we must add support for more than one fund.`}
            />

            <Text
                lead={`For flexibility, we will adopt two input styles:`}
                bullets={[
                    "A consolidated CSV file containing multiple funds",
                    "A folder of CSV files, with one fund per file",
                ]}
            />

            <Text
                content={`A consolidated file containing multiple funds might look like:`}
                code={`date,fund_name,fund,benchmark
2020-01-31,Fund_A,0.020,0.015
2020-01-31,Fund_B,0.018,0.015
2020-01-31,Fund_C,0.015,0.015
2020-02-29,Fund_A,-0.030,-0.025
2020-02-29,Fund_B,-0.028,-0.025
2020-02-29,Fund_C,-0.035,-0.025`}
            />

            <Text
                content={`Alternatively, if data is provided as multiple files, each file would contain a single fund, for example:`}
                code={`date,fund,benchmark
2020-01-31,0.020,0.015
2020-02-29,-0.030,-0.025
2020-03-31,-0.065,-0.080`}
            />

            <Text
                content={`In this case, the fund name will be derived from the filename, for example Fund_A.csv, Fund_B.csv, and so on.`}
            />

            <Text
                content={`Regardless of how the data is provided, both input styles will be standardised into the same internal structure:`}
                code={`date,fund_name,fund,benchmark
2020-01-31,Fund_A,0.020,0.015
2020-01-31,Fund_B,0.018,0.015
2020-02-29,Fund_A,-0.030,-0.025`}
            />

            <Text
                content={`Once the data is in this format, the rest of the analysis pipeline does not need to care where it came from.`}
            />

            <Text
                content={`For usability, we will introduce a small command line interface.

The user will pass either a CSV file path or a folder path, and the loader will decide which mode to use. From that point onward, everything is treated the same.`}
            />

            <Text
                heading="2. Updating the Input Layer for Multi Fund Data"
                content={`Since we now expect multiple funds in one dataset, our loading and verification logic no longer holds up. Let's look at a new dataset to understand why:`}
            />

            <Text
                lead="2.1 Sample Multi Fund Dataset"
                content={`Create a new file called multi_fund_returns.csv inside your data folder, and paste in the following data:`}
                code={`date,fund_name,fund,benchmark
2020-01-31,Fund_A,0.024,0.015
2020-02-29,Fund_A,-0.026,-0.025
2020-03-31,Fund_A,-0.055,-0.080
2020-04-30,Fund_A,0.050,0.035
2020-05-31,Fund_A,0.020,0.012
2020-06-30,Fund_A,0.012,0.008
2020-01-31,Fund_B,0.017,0.015
2020-02-29,Fund_B,-0.027,-0.025
2020-03-31,Fund_B,-0.068,-0.080
2020-04-30,Fund_B,0.040,0.035
2020-05-31,Fund_B,0.013,0.012
2020-06-30,Fund_B,0.008,0.008
2020-01-31,Fund_C,0.012,0.015
2020-02-29,Fund_C,-0.038,-0.025
2020-03-31,Fund_C,-0.074,-0.080
2020-04-30,Fund_C,0.032,0.035
2020-05-31,Fund_C,0.009,0.012
2020-06-30,Fund_C,0.004,0.008`}
            />

            <Text
                content={`This dataset is deliberately small and clean.

It contains three funds over the same six monthly periods, all compared against a shared benchmark. This is enough to verify the loader and grouping logic before moving on to the full analysis pipeline.`}
            />

            <Text
                content={`The key difference for our script is the addition of a new column, fund_name. Let's build a new loader to handle this.`}
            />

            <Text
                content={`Dates may repeat across funds, but must be unique within each fund.`}
            />

            <Text
                lead="2.2 Loader Update (analytics/transforms.py)"
                content={`Open analytics/transforms.py and replace your existing load_returns() function with:`}
            />

            <Text
                lead="Function update (analytics/transforms.py):"
                code={`from pathlib import Path

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

    return df`}
            />

            <Text
                content={`This function now supports both input modes. It either reads a single multi fund CSV directly, or combines multiple single fund CSV files into the same internal structure.`}
            />

            <Text
                lead="2.3 Updating main.py to Accept Multi Fund Data"
                content={`Next, we will update main() so that it accepts an external input path rather than relying on a hardcoded file.`}
            />

            <Text
                content={`Open main.py. At the top of the file, add the argparse import if it is not already present, then add the helper below your imports:`}
                code={`import argparse

def parse_args():
    parser = argparse.ArgumentParser(
        description="Fund performance comparison tool"
    )

    parser.add_argument(
        "input_path",
        help="Path to a CSV file or folder of CSV files"
    )

    return parser.parse_args()`}
            />

            <Text
                content={`Still in main.py, replace the body of main() with the following:`}
                code={`def main():
    args = parse_args()

    df = load_returns(args.input_path)

    if df["fund_name"].nunique() < 2:
        print("Warning: only one fund identified, comparison output will be limited.")

    print(df.head())`}
            />

            <Text
                lead="2.4 Verifying the Loader"
                content={`We have our multi fund loader, so let's test it. Run the script using the sample dataset:`}
                code={`python main.py data/multi_fund_returns.csv`}
            />

            <Text
                content={`If everything is working correctly, you should see output similar to:`}
                code={`        date fund_name   fund  benchmark
0 2020-01-31    Fund_A  0.024      0.015
1 2020-02-29    Fund_A -0.026     -0.025
2 2020-03-31    Fund_A -0.055     -0.080
3 2020-04-30    Fund_A  0.050      0.035
4 2020-05-31    Fund_A  0.020      0.012`}
            />

            <Text
                content={`This confirms that:`}
                bullets={[
                    "The file has been loaded correctly",
                    "The date column has been parsed as a datetime",
                    "The dataset has been sorted by fund_name and date",
                    "The internal structure matches the expected data contract",
                ]}
            />

            <Text
                content={`You may notice that only Fund_A appears in the output. This is expected, because print(df.head()) only shows the first five rows.

To confirm that all funds were loaded, you can temporarily run:`}
                code={`print(df["fund_name"].unique())`}
            />

            <Text
                content={`Which should produce:`}
                code={`['Fund_A' 'Fund_B' 'Fund_C']`}
            />

            <Text
                content={`The input layer now correctly supports loading data for multiple funds. We can now move on to applying the analysis pipeline across all funds.`}
            />

            <Text
                heading="3. Running the Pipeline per Fund"
                content={`The next step is to actually run the analysis on multiple funds.

In Part 1, we built the core single fund calculations and the summary logic in analytics/summaries.py. We can reuse that same structure here, and extend it so the same summary metrics are collected for every fund in the dataset.`}
            />

            <Text
                content={`Conceptually, this is a simple pattern:`}
                bullets={[
                    "Split the dataset by fund",
                    "Apply the same analysis to each subset",
                    "Combine the results into a summary table",
                ]}
            />

            <Text
                content={`In pandas, this pattern can be implemented using groupby().`}
            />

            <Text
                content={`Open analytics/summaries.py and update it so that the single fund summary logic is reusable across both Part 1 and Part 2:`}
            />

            <Text
                lead="Function addition (analytics/summaries.py):"
                code={`from analytics.calculations import cumulative_growth, drawdown, excess_return

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

    return pd.DataFrame(rows).sort_values("fund_name").reset_index(drop=True)`}
            />

            <Text
                content={`This keeps the summary logic in one place. Part 1 can still build a compact single fund summary table, and Part 2 can now reuse the same metrics when creating one row per fund.`}
            />

            <Text
                content={`Let's test this function by calling it from main.py.

Update your main() function so it imports and runs run_analysis():`}
            />

            <Text
                lead="Main workflow update (main.py):"
                code={`from analytics.summaries import run_analysis

def main():
    args = parse_args()

    df = load_returns(args.input_path)

    if df["fund_name"].nunique() < 2:
        print("Warning: only one fund identified, comparison output will be limited.")

    summary = run_analysis(df)

    print(summary)`}
            />

            <Text
                content={`Run the script again using the sample dataset.

You should now see output similar to:`}
                code={`  fund_name  final_fund_value  final_benchmark_value  max_drawdown  average_excess_return  periods
0    Fund_A          1.022472               0.961577     -0.079570               0.007667        6
1    Fund_B          0.978351               0.961577     -0.101164               0.002000        6
2    Fund_C          0.934970               0.961577     -0.110188              -0.006167        6`}
            />

            <Text
                content={`The exact values will vary slightly depending on rounding, but the structure should match.

Each row represents a single fund, and each column represents a summary statistic derived from the same underlying calculations.`}
            />

            <Text
                content={`With this table, we can already answer some basic questions:`}
                bullets={[
                    "Which fund delivered the strongest overall return?",
                    "Which fund experienced the deepest drawdowns?",
                    "Which fund added the most value relative to its benchmark?",
                ]}
            />

            <Text
                content={`However, these metrics still exist in isolation.

Analysts rarely stop at this stage, because each metric captures only one aspect of performance.

To move from description to decision support, we need a way to compare funds across multiple dimensions in a consistent and structured way.`}
            />

            <Text
                heading="4. Building a Reporting Framework"
                content={`The next step is to organise these outputs into a structure that supports reporting and decision making.

In practice, analysts do not just present raw tables of metrics. Instead, they work within a reporting framework that combines several components:`}
                bullets={[
                    "A comparison table of key performance metrics",
                    "A ranking system that summarises relative performance",
                    "Monitoring rules that flag funds requiring attention",
                ]}
            />

            <Text
                content={`The comparison table provides the raw information, the ranking system summarises performance across multiple dimensions, and the monitoring rules highlight where further investigation may be needed.

In most organisations, these frameworks are not defined ad hoc. They are typically:`}
                bullets={[
                    "Defined by senior management or an investment committee",
                    "Aligned with the mandate of the fund or strategy",
                    "Influenced by other research inputs, such as macroeconomic views or risk reports",
                    "Applied consistently across reporting cycles",
                ]}
            />

            <Text
                content={`The role of the analyst is not always to invent the methodology, but to implement it clearly, maintain it consistently, and ensure that it reflects the priorities of the investment process.

For this tutorial, we will build a simplified version of this framework. The goal is not to construct an optimal portfolio selection model, but to demonstrate how these components can be structured and integrated into a practical workflow.`}
            />

            <Text
                lead="4.1 Ranking Fund Managers"
                content={`We begin with the ranking component of the reporting framework.

In practice, portfolio strategy involves balancing return and risk rather than maximising a single metric in isolation. Different organisations may formalise this in different ways, but the underlying idea is consistent: the scoring system should reflect what the investment process is trying to prioritise.

For this tutorial, let's pretend we're in charge of the portfolio. We decide that we want our portfolio to have:`}
                bullets={[
                    "Best possible overall performance from our selected funds",
                    "More stable returns",
                    "Positive value added relative to the benchmark",
                ]}
            />

            <Text
                content={`We can build a simple scoring system based on our performance metrics, to easily see how each fund is contributing towards our portfolio goals.

We will take returns as our main factor, punish funds with high drawdown to increase stability, and use excess return as a supporting factor.`}
            />

            <Text
                content={`Our example scoring framework uses:`}
                bullets={[
                    "Return weight: 0.45",
                    "Drawdown weight: 0.35",
                    "Excess return weight: 0.20",
                ]}
            />

            <Text
                content={`The specific values are not the important part. What matters is that the weighting is explicit, consistent, and aligned with the priorities of the reporting framework.`}
            />

            <Text
                content={`So let's get the scores. Add the following function to summaries.py:`}
            />

            <Text
                lead="Function addition (analytics/summaries.py):"
                code={`def rank_funds(summary: pd.DataFrame) -> pd.DataFrame:
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

    return ranked.sort_values("composite_score").reset_index(drop=True)`}
            />

            <Text
                content={`Return and excess return are ranked in descending order, because higher values are better.

Drawdown is also ranked in descending order. Since drawdown is negative, a less severe drawdown such as -5% is higher than a deeper drawdown such as -15%, so it should receive the better rank.`}
            />

            <Text
                content={`Lower scores indicate stronger overall performance under this framework. When sorted by composite score, the strongest funds will appear at the top of the table.`}
            />

            <Text
                content={`Let's test this by updating main.py to run the full pipeline:`}
            />

            <Text
                lead="Main workflow update (main.py):"
                code={`from analytics.summaries import run_analysis, rank_funds

def main():
    args = parse_args()

    df = load_returns(args.input_path)

    if df["fund_name"].nunique() < 2:
        print("Warning: only one fund identified, comparison output will be limited.")

    summary = run_analysis(df)
    ranked = rank_funds(summary)

    print("\\nRanked fund summary:")
    print(ranked)`}
            />

            <Text
                content={`Run the script again using the same dataset, and you should see a new column appear with a score for each fund.`}
            />

            <Text
                lead="4.2 Monitoring and Flagging"
                content={`Ranking provides a relative comparison, but we may also want to identify when specific conditions require attention, regardless of rank.

We can do this by defining some escalation triggers.`}
            />

            <Text
                content={`Pretending again that we are the portfolio manager, and we want to monitor funds which:`}
                bullets={[
                    "Persistently underperform relative to the benchmark",
                    "Have drawdowns exceeding a defined threshold",
                ]}
            />

            <Text
                content={`Add the following functions to summaries.py:`}
            />

            <Text
                lead="Function additions (analytics/summaries.py):"
                code={`def rolling_underperformance_flag(
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
    return bool((drawdown_series < threshold).any())`}
            />

            <Text
                content={`These functions give us flags which address our original monitoring goals.

rolling_underperformance_flag() identifies periods where a fund has persistently underperformed its benchmark over a rolling three period window, while drawdown_breach_flag() detects whether a fund has experienced a drawdown that exceeds a certain threshold.`}
            />

            <Text
                content={`In a more complex system, additional flags could be introduced, and combined using additional logic. For example, a fund might only be flagged for review if it breaches multiple conditions, or different flags could be weighted based on their severity.`}
            />

            <Text
                content={`For this tutorial, we will keep the logic simple and transparent, and flag a fund if it fails any of our two conditions.`}
            />

            <Text
                content={`Let's now apply this new system to the analysis pipeline:`}
            />

            <Text
                lead="Function addition (analytics/summaries.py):"
                code={`def apply_monitoring_flags(df: pd.DataFrame, summary: pd.DataFrame) -> pd.DataFrame:
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

    return flagged`}
            />

            <Text
                content={`Now update main.py to include monitoring:`}
            />

            <Text
                lead="Main workflow update (main.py):"
                code={`from analytics.summaries import (
    run_analysis,
    rank_funds,
    apply_monitoring_flags,
)

def main():
    args = parse_args()

    df = load_returns(args.input_path)

    summary = run_analysis(df)
    ranked = rank_funds(summary)
    monitored = apply_monitoring_flags(df, ranked)

    print(monitored)`}
            />

            <Text
                content={`Run the script again.

You should now see that one fund is flagged for both underperformance and breaching the drawdown threshold.`}
            />

            <Text
                content={`We now have all the main reporting components in place, and we can bring them together into a single main() function that runs the full reporting workflow up to this stage.

This gives us one clean checkpoint before moving on to the output layer.`}
            />

            <Text
                lead="Main workflow checkpoint (main.py):"
                code={`from analytics.summaries import (
    run_analysis,
    rank_funds,
    apply_monitoring_flags,
)

def main():
    args = parse_args()

    df = load_returns(args.input_path)

    if df["fund_name"].nunique() < 2:
        print("Warning: only one fund identified, comparison output will be limited.")

    summary = run_analysis(df)
    ranked = rank_funds(summary)
    monitored = apply_monitoring_flags(df, ranked)

    print("\\nFund reporting summary:")
    print(monitored)`}
            />

            <Text
                content={`Run the script again using the same dataset.

You should now see a single table that combines the key outputs built so far:`}
                bullets={[
                    "Per fund summary metrics",
                    "Weighted ranking scores",
                    "Monitoring flags",
                    "A requires_review field",
                ]}
            />

            <Text
                content={`From here, the next natural step is to improve how this information is presented.`}
            />

            <Text
                heading="5. Structuring Outputs for Reporting"
                content={`Our current output is still quite raw. In practice, analysts need outputs that are easy to read, easy to share, and suitable for further use in reporting workflows.

In this section, we will extend the system to produce formatted tables, exported files, console messages, and comparison charts.`}
            />

            <Text
                content={`To keep this organised, extend the reporting layer by adding a new file called outputs.py to your reporting folder.`}
            />

            <Text
                content={`Your project structure should now look like:`}
                code={`project/
├── analytics/
│   ├── calculations.py
│   ├── transforms.py
│   └── summaries.py
├── data/
│   ├── sample_returns.csv
│   └── multi_fund_returns.csv
├── reporting/
│   ├── charts.py
│   └── outputs.py
└── main.py`}
            />

            <Text
                content={`We will place table formatting, CSV export, and simple console output into this new file.`}
            />

            <Text
                lead="5.1 Formatting the Summary Table"
                content={`Our reporting table already contains the information we need, but we still need to improve its readability before it becomes a more useful reporting output.`}
            />

            <Text
                content={`The easiest way to keep this organised is to define the overall table layout once, then separately define which columns should be shown in percentage terms.

From there, we can derive the remaining numeric columns automatically for rounding.`}
            />

            <Text
                lead="5.1.1 Defining the Table Layout"
                content={`Start by adding the following function to reporting/outputs.py:`}
            />

            <Text
                lead="Function addition (reporting/outputs.py):"
                code={`import pandas as pd

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

    return formatted`}
            />

            <Text
                content={`This gives us three small pieces of structure that will come in handy later:`}
                bullets={[
                    "column_order defines the report layout",
                    "percentage_cols defines which metrics need to be scaled into percentage terms",
                    "numeric_cols is derived automatically from the full layout by excluding the non numeric fields",
                ]}
            />

            <Text
                lead="5.1.2 Converting the Percentage Based Metrics"
                content={`Some of our key metrics are still shown in raw decimal form.

That is useful while building the system, but it is not the most natural way to present performance data.

Add the following loop after the column selection step:`}
            />

            <Text
                lead="Function update (reporting/outputs.py):"
                code={`for col in percentage_cols:
    if col in {"final_fund_value", "final_benchmark_value"}:
        formatted[col] = (formatted[col] - 1) * 100
    else:
        formatted[col] = formatted[col] * 100`}
            />

            <Text
                content={`This keeps the conversion logic compact while still making it clear which metrics are being transformed.`}
            />

            <Text
                lead="5.1.3 Rounding the Numeric Columns"
                content={`The final formatting step is to round the numeric fields.

Because numeric_cols is derived from the table layout, we do not need to type every numeric column name again.

Add the following line after the percentage conversion step:`}
            />

            <Text
                lead="Function update (reporting/outputs.py):"
                code={`formatted[numeric_cols] = formatted[numeric_cols].round(2)`}
            />

            <Text
                content={`This gives us a cleaner reporting table.

Final fund value and final benchmark value are now shown as total percentage return over the sample period, while drawdown and average excess return are also expressed in percentage terms.`}
            />

            <Text
                lead="5.2 Exporting Results to CSV"
                content={`A practical next step is to export the formatted results to a CSV file.

Add this function to reporting/outputs.py:`}
            />

            <Text
                lead="Function addition (reporting/outputs.py):"
                code={`from pathlib import Path

def export_summary(df: pd.DataFrame, path: str = "output/fund_report_summary.csv") -> None:
    output_path = Path(path)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    df.to_csv(output_path, index=False)`}
            />

            <Text
                lead="5.3 Lightweight Console Output"
                content={`A simple list of flagged funds gives us a quick checkpoint when running the script.

This is useful during development and testing, because it lets us immediately see whether any funds require review without scanning the full output table or opening the exported files.

Add this function to reporting/outputs.py:`}
            />

            <Text
                lead="Function addition (reporting/outputs.py):"
                code={`def print_flags(df: pd.DataFrame) -> None:
    flagged = df[df["requires_review"]]

    if flagged.empty:
        print("\\nNo funds require review.")
    else:
        print("\\nFunds requiring review:")
        for fund_name in flagged["fund_name"]:
            print(f"- {fund_name}")`}
            />

            <Text
                lead="5.4 Output Layer Checkpoint"
                content={`At this point, reporting/outputs.py should contain all of the output helpers built in this chapter:`}
            />

            <Text
                lead="Module checkpoint (reporting/outputs.py):"
                code={`from pathlib import Path

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
        print("\\nNo funds require review.")
    else:
        print("\\nFunds requiring review:")
        for fund_name in flagged["fund_name"]:
            print(f"- {fund_name}")`}
            />

            <Text
                content={`This structure is still manual, which is intentional. The output table is explicit and easy to control, which is useful in a small reporting tool like this.

The trade off is that if we later add many more fields, we would need to keep these lists updated. For our small reporting layer, that is a reasonable compromise.`}
            />

            <Text
                content={`So at this point, we have a more usable reporting layer.`}
            />

            <Text
                lead="5.5 Multi Fund Reporting Charts"
                content={`Now that we are working with multiple funds in a single dataset, the charting layer needs to follow the same pattern as the rest of the pipeline: group the data by fund, apply the same calculation, and combine the results into a comparison view.

We will update charts.py so that it accepts the full dataset and handles the grouping internally.`}
            />

            <Text
                content={`This allows us to produce a comparison chart directly from the multi fund DataFrame, without needing to prepare separate inputs for each fund.`}
            />

            <Text
                content={`Because Part 1 only needed two series, the default colour cycle was very small. For a multi fund chart, we should expand it so larger peer groups are easier to read.

Update your charting setup in reporting/charts.py so that it includes a broader colour cycle, for example:`}
            />

            <Text
                lead="Function update (reporting/charts.py):"
                code={`
COLORS = {
    "bg": "#FDFBF7",
    "fg": "#0E0C21",
    "accent": "#3FC083",
    "benchmark": "#0A95FF",
    "border": "#464F54",
}

SERIES_COLORS = [
    "#3FC083",
    "#0A95FF",
    "#FF8A65",
    "#7E57C2",
    "#26A69A",
    "#EC407A",
    "#AB47BC",
    "#FFA726",
]

def setup_matplotlib_style():
    plt.rcParams["figure.facecolor"] = COLORS["bg"]
    plt.rcParams["axes.facecolor"] = COLORS["bg"]
    plt.rcParams["savefig.facecolor"] = COLORS["bg"]

    plt.rcParams["text.color"] = COLORS["fg"]
    plt.rcParams["axes.labelcolor"] = COLORS["fg"]
    plt.rcParams["xtick.color"] = COLORS["fg"]
    plt.rcParams["ytick.color"] = COLORS["fg"]
    plt.rcParams["axes.edgecolor"] = COLORS["border"]

    plt.rcParams["font.family"] = ["Merriweather", "DejaVu Serif"]
    plt.rcParams["font.size"] = 11
    plt.rcParams["axes.titlesize"] = 16
    plt.rcParams["axes.labelsize"] = 12

    plt.rcParams["axes.prop_cycle"] = cycler(color=SERIES_COLORS)

    plt.rcParams["axes.grid"] = False
    plt.rcParams["axes.axisbelow"] = True
    plt.rcParams["grid.color"] = COLORS["border"]
    plt.rcParams["grid.alpha"] = 0.25
    plt.rcParams["grid.linestyle"] = "--"
    plt.rcParams["grid.linewidth"] = 0.8`}
            />

            <Text
                content={`This does not need to be a perfect house style yet, but it does give us enough distinct colours that a larger multi fund comparison chart is still readable.`}
            />

            <Text
                content={`Now let's improve our chart function in charts.py:`}
            />

            <Text
                lead="Function update (reporting/charts.py):"
                code={`from pathlib import Path
from analytics.calculations import cumulative_growth

def plot_cumulative_performance(df, save_path: str | None = None):
    fig, ax = plt.subplots()
    style_axes(fig, ax, grid=True, zero_line=False)

    # Plot each fund
    for fund_name, group in df.groupby("fund_name"):
        group = group.sort_values("date")

        fund_cum = cumulative_growth(group["fund"])

        ax.plot(
            group["date"],
            fund_cum,
            linewidth=2.2,
            zorder=3,
            label=fund_name,
        )

    # Plot benchmark (assumes shared benchmark across funds)
    benchmark_series = df.sort_values("date").drop_duplicates("date")
    benchmark_cum = cumulative_growth(benchmark_series["benchmark"])

    ax.plot(
        benchmark_series["date"],
        benchmark_cum,
        linewidth=2.8,
        linestyle="--",
        color=COLORS["benchmark"],
        zorder=5,
        label="Benchmark",
    )

    ax.set_title("Fund Performance Comparison")
    ax.set_xlabel("Date")
    ax.set_ylabel("Growth Index")
    ax.legend(frameon=False)

    plt.tight_layout()

    if save_path:
        output_path = Path(save_path)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        plt.savefig(output_path, dpi=150)
        print(f"\\nChart saved to: {output_path}")

    plt.show()`}
            />

            <Text
                content={`Each fund is normalised to a starting value of 1.0, so all lines begin at the same point.

This allows us to compare performance on a consistent basis, showing how each fund would have grown over the same period. While this can look slightly artificial, it is a standard approach used in fund comparison reporting.

We also plot the benchmark as a single reference line. For simplicity, we assume that all funds share the same benchmark. In practice, different funds may have different benchmarks, which would require a slightly different chart structure.`}
            />

            <Text
                content={`At this stage, we are keeping the visual layer simple. The goal is to confirm that our reporting pipeline can produce consistent comparison outputs.

We will revisit chart design and styling in Part 3.`}
            />

            <Text
                lead="5.6 Bringing the Output Layer Together"
                content={`We can now update main.py to run the full workflow. Before pasting this in, clean up the import block at the top so it only includes helpers that are still used:`}
            />

            <Text
                lead="Main workflow update (main.py):"
                code={`from analytics.transforms import load_returns
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
    print("\\nFormatted summary:")
    print(formatted)

    plot_cumulative_performance(df, save_path="output/fund_comparison.png")`}
            />

            <Text
                content={`Additionally, the chart is now saved alongside the CSV output, making it easy to include in reports or presentations, while still being displayed for immediate inspection.`}
            />

            <Text
                heading="6. Scaling the Workflow"
                content={`So far, we have used a small dataset to keep each stage of the system easy to follow and verify.

The same workflow can now be applied to a larger dataset without any changes to the code. This is the key benefit of the structure we have built.`}
            />

            <Text
                content={`Create a new file called multi_fund_returns_large.csv inside your data folder:`}
                code={`project/
├── analytics/
│   ├── calculations.py
│   ├── transforms.py
│   └── summaries.py
├── data/
│   ├── sample_returns.csv
│   ├── multi_fund_returns.csv
│   └── multi_fund_returns_large.csv
├── reporting/
│   ├── charts.py
│   └── outputs.py
└── main.py`}
            />

            <Text
                content={`Paste the following dataset into data/multi_fund_returns_large.csv:`}
                code={`date,fund_name,fund,benchmark
2020-01-31,Fund_A,0.021,0.015
2020-02-29,Fund_A,-0.024,-0.025
2020-03-31,Fund_A,-0.060,-0.080
2020-04-30,Fund_A,0.048,0.035
2020-05-31,Fund_A,0.019,0.012
2020-06-30,Fund_A,0.011,0.008
2020-07-31,Fund_A,0.020,0.017
2020-08-31,Fund_A,0.013,0.011
2020-09-30,Fund_A,-0.010,-0.015
2020-10-31,Fund_A,0.010,0.007
2020-11-30,Fund_A,0.028,0.025
2020-12-31,Fund_A,0.015,0.013

2020-01-31,Fund_B,0.017,0.015
2020-02-29,Fund_B,-0.026,-0.025
2020-03-31,Fund_B,-0.070,-0.080
2020-04-30,Fund_B,0.040,0.035
2020-05-31,Fund_B,0.014,0.012
2020-06-30,Fund_B,0.008,0.008
2020-07-31,Fund_B,0.018,0.017
2020-08-31,Fund_B,0.011,0.011
2020-09-30,Fund_B,-0.013,-0.015
2020-10-31,Fund_B,0.008,0.007
2020-11-30,Fund_B,0.025,0.025
2020-12-31,Fund_B,0.012,0.013

2020-01-31,Fund_C,0.011,0.015
2020-02-29,Fund_C,-0.035,-0.025
2020-03-31,Fund_C,-0.082,-0.080
2020-04-30,Fund_C,0.028,0.035
2020-05-31,Fund_C,0.008,0.012
2020-06-30,Fund_C,0.003,0.008
2020-07-31,Fund_C,0.010,0.017
2020-08-31,Fund_C,0.006,0.011
2020-09-30,Fund_C,-0.018,-0.015
2020-10-31,Fund_C,0.004,0.007
2020-11-30,Fund_C,0.017,0.025
2020-12-31,Fund_C,0.006,0.013

2020-01-31,Fund_D,0.026,0.015
2020-02-29,Fund_D,-0.030,-0.025
2020-03-31,Fund_D,-0.090,-0.080
2020-04-30,Fund_D,0.060,0.035
2020-05-31,Fund_D,0.024,0.012
2020-06-30,Fund_D,0.014,0.008
2020-07-31,Fund_D,0.024,0.017
2020-08-31,Fund_D,0.016,0.011
2020-09-30,Fund_D,-0.015,-0.015
2020-10-31,Fund_D,0.012,0.007
2020-11-30,Fund_D,0.032,0.025
2020-12-31,Fund_D,0.018,0.013

2020-01-31,Fund_E,0.014,0.015
2020-02-29,Fund_E,-0.024,-0.025
2020-03-31,Fund_E,-0.078,-0.080
2020-04-30,Fund_E,0.034,0.035
2020-05-31,Fund_E,0.011,0.012
2020-06-30,Fund_E,0.007,0.008
2020-07-31,Fund_E,0.016,0.017
2020-08-31,Fund_E,0.010,0.011
2020-09-30,Fund_E,-0.014,-0.015
2020-10-31,Fund_E,0.006,0.007
2020-11-30,Fund_E,0.024,0.025
2020-12-31,Fund_E,0.012,0.013

2020-01-31,Fund_F,0.009,0.015
2020-02-29,Fund_F,-0.040,-0.025
2020-03-31,Fund_F,-0.095,-0.080
2020-04-30,Fund_F,0.025,0.035
2020-05-31,Fund_F,0.006,0.012
2020-06-30,Fund_F,0.002,0.008
2020-07-31,Fund_F,0.008,0.017
2020-08-31,Fund_F,0.004,0.011
2020-09-30,Fund_F,-0.020,-0.015
2020-10-31,Fund_F,0.003,0.007
2020-11-30,Fund_F,0.015,0.025
2020-12-31,Fund_F,0.004,0.013`}
            />

            <Text
                content={`Run the same command with the new filepath:`}
                code={`python main.py data/multi_fund_returns_large.csv`}
            />

            <Text
                content={`The workflow is unchanged:`}
                bullets={[
                    "Data is loaded and validated",
                    "Analysis is applied per fund",
                    "Results are ranked and flagged",
                    "Outputs are formatted and exported",
                    "A comparison chart is produced",
                ]}
            />

            <Text
                content={`This demonstrates that the system scales naturally from a small test dataset to a larger peer group without requiring changes to the analysis or reporting logic.`}
            />

            <Text
                content={`At this stage, the outputs are still intentionally simple.

The focus of Part 2 is building a consistent and reusable pipeline, not refining presentation or interpretation.`}
            />

            <Text
                heading="What We Built"
                content={`Across Part 1 and Part 2, we have moved from a single fund analysis script to a structured multi fund reporting pipeline:`}
                bullets={[
                    "A flexible input layer for multi fund data",
                    "Reusable performance and risk calculations",
                    "Grouped analysis applied consistently across funds",
                    "A simple ranking framework based on weighted metrics",
                    "Monitoring flags to identify funds requiring attention",
                    "Structured outputs suitable for reporting",
                    "Basic comparison charts built from grouped data",
                ]}
            />

            <Text
                content={`This is not a finished reporting product, but it is a solid foundation.

The system is modular, consistent, and scalable, which makes it easy to extend and adapt.`}
            />

            <Text
                heading="Next Steps"
                content={`Part 2 focused on building the system.

In Part 3, we will focus on using it: working with real datasets, refining visual presentation, and interpreting the results in a way that supports investment decisions.`}
            />
        </Body>
    )
}
