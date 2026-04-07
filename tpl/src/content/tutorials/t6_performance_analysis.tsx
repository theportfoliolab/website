import Body from "@/components/content/body"
import Disclaimer from "@/components/content/disclaimer"
import Link from "@/components/content/link"
import { BlockMath } from "@/components/content/math"
import { Text } from "@/components/content/text"
import type { PostMeta } from "@/components/content/types"

export const meta: PostMeta = {
    title: "Building a Fund Performance Analysis Workflow in Python Part 1: Core Metrics and Reporting",
    description:
        "A practical tutorial on building a performance analysis pipeline for fund managers, including data alignment, metrics, summaries, and reporting charts.",
    date: "2026-04-01",
    tags: ["python", "finance", "pandas", "matplotlib", "performance analysis"],
    type: "tutorial",
    slug: "fund-manager-performance-analysis-tool-python",
    nextInSeriesSlug: "fund-manager-performance-analysis-tool-python-part-2",
}

export default function Tutorial() {
    return (
        <Body>
            <Disclaimer
                linkHref="/tutorials/fund-manager-performance-analysis-tool-python-part-2"
                linkLabel="Continue to Part 2"
            >
                This tutorial focuses on the performance analysis core. Multi fund analysis including ranking and monitoring is covered in Part 2 of this series.
            </Disclaimer>

            <Text
                heading="From Raw Returns to Investment Reporting"
                content={
                    <>
                        In investment management, performance analysis is more than just calculating returns.
                    </>
                }
            />

            <Text
                content={`Analysts are expected to take multiple return series from different managers, align them to a benchmark, calculate consistent metrics, and present the results in a way that supports reporting and decision making with much more context than simple figures can provide.

This tutorial builds the core workflow for a single fund (multi fund comparison is built in part 2):`}
                bullets={[
                    "Load and validate return data",
                    "Align fund and benchmark series",
                    "Calculate performance and risk metrics",
                    "Generate summary tables and reporting charts",
                    "Assemble a reusable analysis workflow",
                ]}
            />

            <Text
                content={`If you are starting from a clean environment, make sure pandas, matplotlib, and cycler are installed before you begin. The later charting chapters assume those packages are already available.`}
            />

            <Text
                heading="1. What This Tool Needs to Do"
                lead={"Before writing code, define the job clearly"}
                content={`An investment analyst typically needs to answer:
`}
                bullets={[
                    "How has this fund performed over time?",
                    "How does it compare to its benchmark?",
                    "What level of risk was taken?",
                    "Is performance consistent?",
                ]}
            />

            <Text
                content={`To answer these questions, our tool must produce structured outputs, not just calculations.

In practice, different metrics highlight different aspects of performance.

Some focus on absolute return, others on risk, and others on consistency or benchmark relative behaviour. The choice of metrics depends on the context of the analysis and the investment mandate.
`}
            />

            <Text
                content={"This tutorial will focus on a few core outputs that cover most of these performance aspects:"}
                bullets={[
                    "Cumulative return series",
                    "Drawdown series",
                    "Rolling return views",
                    "Summary performance metrics",
                    "Benchmark relative comparison",
                ]}
            />

            <Text
                content={"This is not an exhaustive list. In practice, analysts may also consider:"}
                bullets={[
                    "Downside deviation (volatility of negative returns only)",
                    "Sortino ratio (risk adjusted return using downside risk instead of total volatility)",
                    "Maximum drawdown duration (how long it takes to recover from losses)",
                    "Calmar ratio (return relative to maximum drawdown)",
                    "Tracking error (volatility of returns relative to the benchmark)",
                    "Information ratio (excess return per unit of tracking error)",
                    "Hit rate (percentage of periods outperforming the benchmark)",
                    "Rolling alpha (performance relative to benchmark over time)",
                ]}
            />

            <Text
                content={`Each of these metrics captures a different dimension of performance, and no single measure should be used in isolation. Feel free to add any of these functions yourself, and use them throughout the tutorial.`}
            />

            <Text
                heading="2. Project Structure"
                content={`We will not build this as a single script, because that would get messy very quickly.

We want a modular structure that we can easily update, test, and reuse.

Instead, we separate responsibilities:
`}
                code={`project/
├── analytics/
│   ├── calculations.py
│   ├── transforms.py
│   └── summaries.py
├── data/
│   └── sample_returns.csv
├── reporting/
│   └── charts.py
└── main.py`}
            />

            <Text
                content={`Responsibilities:`}
                bullets={[
                    "calculations.py: Core metric logic. Converts raw return data into measurable quantities",
                    "transforms.py: Loads and validates input data, and builds aligned series used in performance analysis",
                    "summaries.py: Aggregates results into structured performance comparisons",
                    "charts.py: Visual output of the analysis",
                    "main.py: Orchestrates the full workflow",
                ]}
            />

            <Text
                content={`Each module has a single responsibility. This makes the system easier to test, easier to debug, and easier to extend as we add features later.`}
            />

            <Text
                lead={`Before moving ahead, set up your project workspace with the above folders and blank files.`}
            />

            <Text
                heading="3. Define the Data Contract"
                content={`As always, data selection is critical. We are building a reporting tool,

so typically this is done using periodic returns, in this case, monthly.

Our minimal dataset should look like:
`}
                code={`date,fund,benchmark
2020-01-31,0.02,0.015
2020-02-29,-0.03,-0.025`}
            />

            <Text
                content={`The benchmark represents a reference portfolio used to evaluate performance.

In practice, this might be:
`}
                bullets={[
                    "A market index (e.g. S&P 500, NZX 50)",
                    "A blended benchmark (e.g. 60% equities / 40% bonds)",
                    "A mandate specific benchmark defined by the fund",
                ]}
            />

            <Text
                content={`Rather than analysing returns in isolation, we compare the fund to its benchmark to understand whether value is being added through active management.`}
            />

            <Text
                lead={`Key assumptions about our data:`}
                bullets={[
                    "Returns are periodic (monthly)",
                    "Dates are aligned to period end",
                    "Fund and benchmark share the same frequency",
                    "No missing or duplicated dates",
                ]}
            />

            <Text
                content={
                    <>
                        I will provide some sample data for you to work with later, but if you want to use your own data, be sure it is well cleaned to meet these requirements. If you need a refresher, see{" "}
                        <Link href="https://theportfoliolab.nz/tutorials/clean-financial-data-in-pandas">
                            Clean Financial Data in Pandas
                        </Link>.
                    </>
                }
            />

            <Text
                heading="4. Load and Validate Data"
                content={`Our first step is to bring our data into Python.

We will keep our project structure in mind when doing so.

For this tutorial, we will work with a small sample dataset. This keeps things simple while we build and verify the analysis pipeline.

Find your file called sample_returns.csv in your project directory (or replace it with your own dataset if you prefer).

A reminder of the directory structure:
`}
                code={`project/
├── analytics/
├── data/
│   └── sample_returns.csv
├── reporting/
└── main.py`}
            />

            <Text
                content={`Paste the following data into sample_returns.csv:`}
                code={`date,fund,benchmark
2020-01-31,0.020,0.015
2020-02-29,-0.030,-0.025
2020-03-31,-0.065,-0.080
2020-04-30,0.045,0.035
2020-05-31,0.018,0.012
2020-06-30,0.010,0.008
2020-07-31,0.022,0.017
2020-08-31,0.014,0.011
2020-09-30,-0.012,-0.015
2020-10-31,0.009,0.007
2020-11-30,0.031,0.025
2020-12-31,0.016,0.013`}
            />

            <Text
                content={`This dataset is deliberately small.

The goal here is not realism of scale, but to give us clean, predictable data so we can verify the logic of our analysis before working with larger or messier real world datasets.`}
            />

            <Text
                content={
                    <>
                        Loading the data is straightforward. If you want to implement this yourself, see{" "}
                        <Link href="https://theportfoliolab.nz/tutorials/python-csv-and-pandas-dataframes">
                            Python CSV and pandas DataFrames
                        </Link>. Just make sure your script returns a Dataframe, and you'll be good to go.
                    </>
                }
            />

            <Text
                content={`We will put our loading logic into transforms.py, so that main.py can stay focused on running the workflow.
`}
            />

            <Text
                lead="Function addition (analytics/transforms.py):"
                code={`import pandas as pd

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

    return df`}
            />

            <Text
                content={`This function does two things:
`}
                bullets={[
                    "Loads the dataset into a DataFrame",
                    "Validates that the data meets our assumptions",
                ]}
            />

            <Text
                content={`This validation step is not optional.

Bad input data will silently break every downstream calculation, so it is better to fail early with clear errors than to produce incorrect results later.`}
            />

            <Text
                content={`Open main.py and replace the import block and main() with the following. This is the first full main.py checkpoint, so keep the boilerplate here:`}
            />

            <Text
                lead="Main workflow update (main.py):"
                code={`from analytics.transforms import load_returns

def main():
    df = load_returns("data/sample_returns.csv")
    print(df.head())


if __name__ == "__main__":
    main()`}
            />

            <Text
                content={`If your script is working correctly, you should see output similar to:`}
                code={`        date   fund  benchmark
0 2020-01-31  0.020      0.015
1 2020-02-29 -0.030     -0.025
2 2020-03-31 -0.065     -0.080
3 2020-04-30  0.045      0.035
4 2020-05-31  0.018      0.012`}
            />

            <Text
                content={`This confirms that the file loaded correctly, the date column was parsed, and the basic validation step passed.`}
            />

            <Text
                lead="This forms our base script."
                content={`From this point forward, we will build on the same main.py file.

Only the relevant additions will be shown in each step, rather than repeating the full script every time.`}
            />

            <Text
                heading="5. Building our Performance Metrics"
            />
            <Text
                lead={"5.1: Cumulative growth"}
                content={`Monthly returns tell us what happened in a single period.

But investors do not experience returns in isolation. Each month builds on the last, so we need to track how an investment grows over time.`}
            />

            <Text
                content={`We do this by starting with an initial value and applying each return sequentially.

Start with 1.0 (representing $1 invested):`}
                bullets={[
                    "1.0 with +10% becomes 1.0 × 1.10 = 1.10",
                    "1.10 with +10% becomes 1.10 × 1.10 = 1.21",
                    "1.21 with +10% becomes 1.21 × 1.10 = 1.331",
                ]}
            />

            <Text
                content={`We calculate cumulative growth by multiplying each period’s return factor:`}
            />

            <BlockMath formula={"V_t = V_0 \\times (1 + r_1) \\times (1 + r_2) \\times \\cdots \\times (1 + r_t)"} />

            <Text
                content={`Where:`}
                bullets={[
                    "V₀ is the starting value (usually 1.0 for relative performance, or an actual investment amount)",
                    "rₜ is the return in each period",
                    "Vₜ is the value after t periods",
                ]}
            />

            <Text
                content={`Cumulative return is not the sum of returns, but the product of growth factors.`}
            />

            <Text
                content={`We will now implement this transformation as a reusable function.`}
            />

            <Text
                content={`We could do this manually, but that quickly becomes repetitive and error prone.

Thankfully, NumPy (via pandas) provides a built in way to compute this efficiently with the cumulative product method: cumprod()`}
            />

            <Text
                lead={"Function addition (analytics/calculations.py):"}
                code={`import numpy as np
import pandas as pd

def cumulative_growth(returns: pd.Series) -> pd.Series:
    return (1 + returns).cumprod()`}
            />

            <Text
                content={`This works as follows:`}
                bullets={[
                    "1 + returns converts returns into growth factors (e.g. +0.10% becomes 1.10)",
                    "cumprod() multiplies these factors sequentially",
                    "The result is a time series showing how an investment grows over time",
                ]}
            />

            <Text
                content={`The output is often called a growth index or equity curve.

This is one of the most important transformations in the entire pipeline, because most reporting outputs depend on it:`}
                bullets={[
                    "Cumulative return charts",
                    "Drawdown calculations",
                    "Rolling return analysis",
                ]}
            />

            <Text
                content={`Open main.py and update the imports at the top, then replace the body of main() with the following. This is a partial update, so you do not need to repeat the boilerplate:`}
            />

            <Text
                lead="Main workflow update (main.py):"
                code={`from analytics.calculations import cumulative_growth
from analytics.transforms import load_returns

def main():
    df = load_returns("data/sample_returns.csv")

    fund_cum = cumulative_growth(df["fund"])
    benchmark_cum = cumulative_growth(df["benchmark"])

    print(fund_cum.tail())
    print(benchmark_cum.tail())`}
            />

            <Text
                content={`Run the script. You should now see output similar to:`}
                code={`7     1.030049
8     1.017688
9     1.026847
10    1.058680
11    1.075619
Name: fund, dtype: float64
7     0.988353
8     0.973527
9     0.980342
10    1.004851
11    1.017914
Name: benchmark, dtype: float64`}
            />

            <Text
                content={`You should now see the growth series for both the fund and benchmark, which gives you a direct way to verify that compounding is working correctly.

Both series should start near 1.0 and evolve smoothly over time. If the values jump unexpectedly or reset, this usually indicates an issue with the input data or the compounding logic.`}
            />

            <Text
                lead="5.2 Drawdown (Understanding Risk)"
                content={`Cumulative returns tell us how an investment grows,

but they do not tell us how painful that journey was.

Two funds can end at the same final value, but one may have experienced much larger losses along the way. This is where drawdown becomes important:`}
            />

            <Text
                lead={`Drawdown measures how far an investment falls from its previous peak.

Instead of looking at growth, we are now asking:

How far did this investment drop from its highest value?`}
            />

            <Text
                content={`Consider a simple example:`}
                bullets={[
                    "Start at 1.00",
                    "Grow to 1.20 (new peak)",
                    "Fall to 1.10",
                    "Recover to 1.25 (new peak)",
                ]}
            />

            <Text
                content={`At the point where the value falls from 1.20 to 1.10, we measure the drawdown relative to the peak:`}
            />

            <BlockMath formula={"\\mathrm{Drawdown} = \\frac{\\mathrm{Current\\ Value} - \\mathrm{Peak\\ Value}}{\\mathrm{Peak\\ Value}}"} />

            <Text
                content={`Using our example:`}
                bullets={[
                    "Peak value is 1.20",
                    "Current value is 1.10",
                    "Drawdown becomes (1.10 - 1.20) / 1.20 = -8.33%",
                ]}
            />

            <Text
                content={`This tells us the investment is down 8.33% from its highest point.

When the investment reaches a new high (such as 1.25), there is no longer any loss relative to the peak. At that moment, the current value equals the highest value seen so far, so the drawdown becomes 0.

In practical terms, this means the previous losses have been fully recovered, and the investment is back at a new high watermark.`}
            />

            <Text
                content={`In our code, we calculate this across the entire time series.

First, we track the running maximum (the highest value reached so far), then compare the current value to that peak.`}
            />

            <Text
                content={`We will now implement this as a reusable function, using the cumulative growth series from the previous section.`}
            />

            <Text
                lead={"Function addition (analytics/calculations.py):"}
                code={`def drawdown(cumulative: pd.Series) -> pd.Series:
    peak = cumulative.cummax()
    return (cumulative - peak) / peak`}
            />

            <Text
                content={`This works as follows:`}
                bullets={[
                    "cummax() is a pandas method that returns the cumulative maximum of a series",
                    "At each point in time, it stores the highest value observed so far",
                    "We compare the current value to that running peak",
                    "The result is a time series showing drawdown over time",
                ]}
            />

            <Text
                content={`Drawdown is one of the most important risk measures in investment analysis.

It directly reflects investor experience:`}
                bullets={[
                    "How large were the losses?",
                    "How long did recovery take?",
                    "How frequently did drawdowns occur?",
                ]}
            />

            <Text
                content={`This is why drawdown charts are almost always included in performance reports.

They show risk in a way that volatility alone cannot.`}
            />

            <Text
                content={`Still in main.py, update the imports if needed, then replace the body of main() with the following:`}
            />

            <Text
                lead="Main workflow update (main.py):"
                code={`from analytics.calculations import cumulative_growth, drawdown
from analytics.transforms import load_returns

def main():
    df = load_returns("data/sample_returns.csv")

    fund_cum = cumulative_growth(df["fund"])
    fund_dd = drawdown(fund_cum)

    print(fund_dd)`}
            />

            <Text
                content={`Run the script again. You should now see output similar to:`}
                code={`0     0.000000
1    -0.030000
2    -0.093050
3    -0.052237
4    -0.035178
5    -0.025529
6    -0.004091
7     0.000000
8    -0.012000
9    -0.003108
10    0.000000
11    0.000000
Name: fund, dtype: float64`}
            />

            <Text
                content={`You should now see a drawdown series with values at or below 0, which confirms that the peak tracking logic is working.

All values should be zero or negative. If you see positive values, the drawdown calculation is incorrect.`}
            />

            <Text
                lead="5.3 Benchmark Relative Analysis"
                content={`Absolute performance is not enough.

We might think that a fund producing a 15% annual return is a high performer, but what if the market produced a 20% return in the same period?

To evaluate the manager properly, we need to compare performance against a benchmark.`}
            />

            <Text
                content={`The benchmark represents the return that could have been achieved by following a passive or reference strategy. This could be a market index, interest rate, or another fund.

By comparing the fund to its benchmark, we can isolate the manager's contribution.`}
            />

            <Text
                content={`We do this by calculating excess return:`}
            />

            <Text
                lead={"Function addition (analytics/calculations.py):"}
                code={`def excess_return(fund: pd.Series, benchmark: pd.Series) -> pd.Series:
    return fund - benchmark`}
            />

            <Text
                content={`This works as follows:`}
                bullets={[
                    "Positive values indicate the fund outperformed the benchmark",
                    "Negative values indicate underperformance",
                    "Zero means the fund matched the benchmark",
                ]}
            />

            <Text
                content={`This gives us a consistent way to measure performance relative to the market, rather than in isolation.`}
            />

            <Text
                content={`We will use this later when we look at ranking and monitoring fund managers.`}
            />

            <Text
                content={`Still in main.py, update the imports if needed, then replace the body of main() with the following:`}
            />

            <Text
                lead="Main workflow update (main.py):"
                code={`from analytics.calculations import cumulative_growth, drawdown, excess_return
from analytics.transforms import load_returns

def main():
    df = load_returns("data/sample_returns.csv")

    excess = excess_return(df["fund"], df["benchmark"])
    print(excess)`}
            />

            <Text
                content={`Run the script again. You should now see output similar to:`}
                code={`0     0.005
1    -0.005
2     0.015
3     0.010
4     0.006
5     0.002
6     0.005
7     0.003
8     0.003
9     0.002
10    0.006
11    0.003`}
            />

            <Text
                content={`You should now see positive and negative values showing when the fund outperformed or underperformed the benchmark in each month.

Positive values indicate outperformance, negative values indicate underperformance.`}
            />

            <Text
                heading="6. Build Summary Tables"
                content={`Before we move to charts, we should also build a compact tabular summary.

This is the job of analytics/summaries.py.

Charts are useful for pattern recognition, but reporting usually also needs a small table of headline figures that can be reviewed quickly or included in a report.`}
            />

            <Text
                content={`For this tutorial, we will keep the summary simple and only use values we have already calculated:`}
                bullets={[
                    "Final fund value",
                    "Final benchmark value",
                    "Maximum drawdown",
                    "Average excess return",
                ]}
            />

            <Text
                lead="Function addition (analytics/summaries.py):"
                code={`import pandas as pd

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

    return summary`}
            />

            <Text
                content={`This function does not calculate anything new. It organises our existing outputs into a format that is easier to inspect and report.`}
            />

            <Text
                content={`The resulting table is deliberately simple, but it gives us a clean bridge between raw calculations and finished reporting outputs.`}
            />

            <Text
                content={`Still in main.py, add the new summary import at the top if it is not already present, remove any imports that are now unused, and replace the body of main() with the following:`}
            />

            <Text
                lead="Main workflow update (main.py):"
                code={`from analytics.calculations import cumulative_growth, drawdown, excess_return
from analytics.summaries import build_summary_table
from analytics.transforms import load_returns

def main():
    df = load_returns("data/sample_returns.csv")

    fund_cum = cumulative_growth(df["fund"])
    benchmark_cum = cumulative_growth(df["benchmark"])
    fund_dd = drawdown(fund_cum)
    excess = excess_return(df["fund"], df["benchmark"])

    summary = build_summary_table(
        fund_cumulative=fund_cum,
        benchmark_cumulative=benchmark_cum,
        fund_drawdown=fund_dd,
        excess_returns=excess,
    )

    print(summary)`}
            />

            <Text
                content={`Run the script again. You should now see a table similar to:`}
                code={`                  Metric     Value
0       Final Fund Value  1.075619
1  Final Benchmark Value  1.017914
2       Maximum Drawdown -0.093050
3  Average Excess Return  0.004583`}
            />

            <Text
                content={`This gives you a compact summary table containing the key headline figures built from the calculations you already implemented.`}
            />

            <Text
                heading="9. Create Reporting Charts"
                content={`We now have the core performance transformations in place, so the next step is to present them clearly.

For this tutorial, we will use a small set of chart types that fit naturally with performance analysis:`}
                bullets={[
                    "Line charts for cumulative performance",
                    "Line charts for drawdown",
                    "Line charts for excess return relative to the benchmark",
                ]}
            />

            <Text
                content={
                    <>
                        If you want a deeper explanation of the chart structure used here, see{" "}
                        <Link href="https://theportfoliolab.nz/tutorials/matplotlib-axis-control-and-chart-templates">
                            Matplotlib Axis Control and Chart Templates
                        </Link>.
                    </>
                }
            />

            <Text
                content={`The code in this chapter is a cut down version of that charting system.

The goal here is not to build a full plotting framework. We just need something that produces clean charts, keeps the code organised, and gives us the features we actually need for this performance analysis tool.`}
            />

            <Text
                content={`We will place this code in reporting/charts.py.

A reminder of our project structure:`}
                code={`project/
├── analytics/
│   ├── calculations.py
│   ├── transforms.py
│   └── summaries.py
├── reporting/
│   └── charts.py
├── sample_returns.csv
└── main.py`}
            />

            <Text
                content={`Start by adding the imports and colour definitions to reporting/charts.py:`}
            />

            <Text
                lead="Function additions (reporting/charts.py):"
                code={`import matplotlib.pyplot as plt
from cycler import cycler

COLORS = {
    "bg": "#FDFBF7",
    "fg": "#0E0C21",
    "accent": "#3FC083",
    "benchmark": "#0A95FF",
    "border": "#464F54",
}`}
            />

            <Text
                content={`This is a reduced colour palette based on my broader charting system.

We only keep the colours that are actually needed here:`}
                bullets={[
                    "bg for the chart background",
                    "fg for labels and text",
                    "accent for the fund series",
                    "benchmark for the benchmark series",
                    "border for axes and grid styling",
                ]}
            />

            <Text
                content={`Next, add a helper to apply the base matplotlib style for this project:`}
            />

            <Text
                lead="Function addition (reporting/charts.py):"
                code={`def setup_matplotlib_style():
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

    plt.rcParams["axes.prop_cycle"] = cycler(
        color=[COLORS["accent"], COLORS["benchmark"]]
    )

    plt.rcParams["axes.grid"] = False
    plt.rcParams["axes.axisbelow"] = True
    plt.rcParams["grid.color"] = COLORS["border"]
    plt.rcParams["grid.alpha"] = 0.25
    plt.rcParams["grid.linestyle"] = "--"
    plt.rcParams["grid.linewidth"] = 0.8`}
            />

            <Text
                content={`This helper sets the default appearance of our charts.

The main idea is to define the project wide chart style once, then keep the chart functions themselves focused on the data they need to plot.`}
            />

            <Text
                content={`After that, add a second helper for chart level formatting:`}
            />

            <Text
                lead="Function addition (reporting/charts.py):"
                code={`def style_axes(fig, ax, grid=True, zero_line=False):
    fig.patch.set_facecolor(COLORS["bg"])
    ax.set_facecolor(COLORS["bg"])

    for spine in ax.spines.values():
        spine.set_color(COLORS["border"])

    ax.tick_params(colors=COLORS["fg"])

    if grid:
        ax.grid(
            True,
            axis="y",
            linestyle="--",
            linewidth=0.8,
            alpha=0.25,
            color=COLORS["border"],
            zorder=1,
        )

    if zero_line:
        ax.axhline(
            0,
            color=COLORS["fg"],
            linewidth=1.2,
            alpha=0.9,
            zorder=2,
        )`}
            />

            <Text
                content={`The setup_matplotlib_style() helper controls global defaults, while style_axes() handles formatting that belongs to each individual chart.

This separation keeps the code easier to reuse and adjust later.`}
            />

            <Text
                content={`Now we can add the reporting charts themselves.

Start with cumulative performance:`}
            />

            <Text
                lead="Function addition (reporting/charts.py):"
                code={`def plot_cumulative_performance(dates, fund_cumulative, benchmark_cumulative):
    fig, ax = plt.subplots()
    style_axes(fig, ax, grid=True, zero_line=False)

    ax.plot(dates, fund_cumulative, color=COLORS["accent"], linewidth=2.4, zorder=3, label="Fund")
    ax.plot(dates, benchmark_cumulative, color=COLORS["benchmark"], linewidth=2.2, zorder=3, label="Benchmark")

    ax.set_title("Cumulative Performance")
    ax.set_xlabel("Date")
    ax.set_ylabel("Growth Index")
    ax.legend(frameon=False)

    plt.tight_layout()
    plt.show()`}
            />

            <Text
                content={`This chart shows the full growth path of the fund and benchmark on the same scale.

Because both series are expressed as growth indices, we can compare them directly over time.`}
            />

            <Text
                content={`Next, add a chart for drawdown:`}
            />

            <Text
                lead="Function addition (reporting/charts.py):"
                code={`def plot_drawdown(dates, fund_drawdown):
    fig, ax = plt.subplots()
    style_axes(fig, ax, grid=True, zero_line=True)

    ax.plot(dates, fund_drawdown, color=COLORS["accent"], linewidth=2.4, zorder=3)

    ax.set_title("Drawdown")
    ax.set_xlabel("Date")
    ax.set_ylabel("Drawdown")

    plt.tight_layout()
    plt.show()`}
            />

            <Text
                content={`This is a simple line chart with a zero line.

That zero line matters because drawdown is measured relative to the previous peak. Values below zero indicate the fund is still below its high watermark.`}
            />

            <Text
                content={`Finally, add a chart for excess return relative to the benchmark:`}
            />

            <Text
                lead="Function addition (reporting/charts.py):"
                code={`def plot_excess_return(dates, excess_returns):
    fig, ax = plt.subplots()
    style_axes(fig, ax, grid=True, zero_line=True)

    ax.plot(dates, excess_returns, color=COLORS["accent"], linewidth=2.4, zorder=3)

    ax.set_title("Excess Return vs Benchmark")
    ax.set_xlabel("Date")
    ax.set_ylabel("Excess Return")

    plt.tight_layout()
    plt.show()`}
            />

            <Text
                content={`This chart is also centred around zero.

Positive values indicate outperformance, negative values indicate underperformance, and the zero line gives us a clear visual reference point.`}
            />

            <Text
                content={`At this point, reporting/charts.py should contain:`}
            />

            <Text
                lead="Module checkpoint (reporting/charts.py):"
                code={`import matplotlib.pyplot as plt
from cycler import cycler

COLORS = {
    "bg": "#FDFBF7",
    "fg": "#0E0C21",
    "accent": "#3FC083",
    "benchmark": "#0A95FF",
    "border": "#464F54",
}

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

    plt.rcParams["axes.prop_cycle"] = cycler(
        color=[COLORS["accent"], COLORS["benchmark"]]
    )

    plt.rcParams["axes.grid"] = False
    plt.rcParams["axes.axisbelow"] = True
    plt.rcParams["grid.color"] = COLORS["border"]
    plt.rcParams["grid.alpha"] = 0.25
    plt.rcParams["grid.linestyle"] = "--"
    plt.rcParams["grid.linewidth"] = 0.8


def style_axes(fig, ax, grid=True, zero_line=False):
    fig.patch.set_facecolor(COLORS["bg"])
    ax.set_facecolor(COLORS["bg"])

    for spine in ax.spines.values():
        spine.set_color(COLORS["border"])

    ax.tick_params(colors=COLORS["fg"])

    if grid:
        ax.grid(
            True,
            axis="y",
            linestyle="--",
            linewidth=0.8,
            alpha=0.25,
            color=COLORS["border"],
            zorder=1,
        )

    if zero_line:
        ax.axhline(
            0,
            color=COLORS["fg"],
            linewidth=1.2,
            alpha=0.9,
            zorder=2,
        )


def plot_cumulative_performance(dates, fund_cumulative, benchmark_cumulative):
    fig, ax = plt.subplots()
    style_axes(fig, ax, grid=True, zero_line=False)

    ax.plot(dates, fund_cumulative, color=COLORS["accent"], linewidth=2.4, zorder=3, label="Fund")
    ax.plot(dates, benchmark_cumulative, color=COLORS["benchmark"], linewidth=2.2, zorder=3, label="Benchmark")

    ax.set_title("Cumulative Performance")
    ax.set_xlabel("Date")
    ax.set_ylabel("Growth Index")
    ax.legend(frameon=False)

    plt.tight_layout()
    plt.show()


def plot_drawdown(dates, fund_drawdown):
    fig, ax = plt.subplots()
    style_axes(fig, ax, grid=True, zero_line=True)

    ax.plot(dates, fund_drawdown, color=COLORS["accent"], linewidth=2.4, zorder=3)

    ax.set_title("Drawdown")
    ax.set_xlabel("Date")
    ax.set_ylabel("Drawdown")

    plt.tight_layout()
    plt.show()


def plot_excess_return(dates, excess_returns):
    fig, ax = plt.subplots()
    style_axes(fig, ax, grid=True, zero_line=True)

    ax.plot(dates, excess_returns, color=COLORS["accent"], linewidth=2.4, zorder=3)

    ax.set_title("Excess Return vs Benchmark")
    ax.set_xlabel("Date")
    ax.set_ylabel("Excess Return")

    plt.tight_layout()
    plt.show()`}
            />

            <Text
                content={`Open main.py and tidy the import block so it includes the chart helpers and only the calculation imports you still use. Then replace the body of main() with the following:`}
            />

            <Text
                lead="Main workflow update (main.py):"
                code={`from analytics.calculations import cumulative_growth, drawdown, excess_return
from analytics.summaries import build_summary_table
from analytics.transforms import load_returns
from reporting.charts import (
    setup_matplotlib_style,
    plot_cumulative_performance,
    plot_drawdown,
    plot_excess_return,
)

def main():
    setup_matplotlib_style()

    df = load_returns("data/sample_returns.csv")

    fund_cum = cumulative_growth(df["fund"])
    benchmark_cum = cumulative_growth(df["benchmark"])
    fund_dd = drawdown(fund_cum)
    excess = excess_return(df["fund"], df["benchmark"])

    plot_cumulative_performance(df["date"], fund_cum, benchmark_cum)
    plot_drawdown(df["date"], fund_dd)
    plot_excess_return(df["date"], excess)`}
            />

            <Text
                content={`Run the script again. You should now see three charts that correspond directly to the core outputs we built in the earlier chapters.`}
            />

            <Text
                heading="10. Assemble the Analysis Pipeline"
                content={`We now have all of the core components we need for a single fund analysis workflow:
`}
                bullets={[
                    "Data loading and validation",
                    "Performance transformations",
                    "Drawdown calculation",
                    "Benchmark relative analysis",
                    "Summary tables",
                    "Reporting charts",
                ]}
            />

            <Text
                content={`The final step is to bring everything together into a single workflow.

This is handled in main.py, which acts as the entry point for our analysis.`}
            />

            <Text
                content={`Check that your imports in main.py include the functions we have built:`}
            />

            <Text
                lead="Imports in main.py:"
                code={`from analytics.calculations import cumulative_growth, drawdown, excess_return
from analytics.summaries import build_summary_table
from analytics.transforms import load_returns
from reporting.charts import (
    setup_matplotlib_style,
    plot_cumulative_performance,
    plot_drawdown,
    plot_excess_return,
)`}
            />

            <Text
                content={`Now extend the body of main() so it runs the full analysis pipeline, performing the calculations, generating the summary table, and producing the charts for that fund. This next snippet is a full main.py checkpoint, so the boilerplate should be included:`}
            />

            <Text
                lead="Main workflow update (main.py):"
                code={`def main():
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
    main()`}
            />

            <Text
                content={`At this point, you have a working performance analysis tool for a single fund.

It takes raw return data and produces structured outputs suitable for reporting and review.`}
            />

            <Text
                heading="What We Built"
                content={`We now have the core of a performance analysis pipeline.

This system is designed to analyse a single fund against its benchmark.
`}
                bullets={[
                    "Validated input data",
                    "Constructed cumulative performance series",
                    "Calculated drawdown and excess return",
                    "Built a summary table",
                    "Generated reporting charts",
                ]}
            />

            <Text
                content={`This is the single fund foundation that Part 2 builds on.

By structuring the logic into reusable components, we are ready to extend the system into a multi fund comparison workflow with grouped analysis, ranking, monitoring, and structured outputs for reporting.`}
            />

            <Text
                content={`At this point, you could call your individual fund analysis project done, or you could go back to Chapter 1 and add more of the performance metric outputs you want, such as downside deviation or tracking error. Implement them in calculations.py, and then do not forget to import them into main.py.`}
            />

            <Text
                heading="Next Steps:"
                content={`Right now, we can only analyse a single fund in isolation. In practice, analysts need to compare managers against each other. So in the next tutorial we will:`}
                bullets={[
                    "Add support for multiple funds in the dataset",
                    "Restructure the pipeline to handle grouped analysis",
                    "Compare funds against each other and against the benchmark",
                    "Introduce ranking and peer comparison",
                    "Begin building monitoring and evaluation workflows",
                ]}
            />

            <Text
                content={`This is where the system becomes a true multi fund reporting pipeline, rather than a single fund analysis script.`}
            />
        </Body>
    )
}
