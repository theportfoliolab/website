import Body from "@/components/content/body"
import Disclaimer from "@/components/content/disclaimer"
import Link from "@/components/content/link"
import { Text } from "@/components/content/text"
import type { PostMeta } from "@/components/content/types"
import ImageBlock from "@/components/content/imageblock.tsx";
import initialChart from "@/content/tutorials/t8_proving_analysis_framework/initial_chart.png"
import realDataPerformanceOverview from "@/content/tutorials/t8_proving_analysis_framework/real_data_performance_overview.png"
import realDataDrawdownOverview from "@/content/tutorials/t8_proving_analysis_framework/real_data_drawdown_overview.png"
import realDataRiskReturnOverview from "@/content/tutorials/t8_proving_analysis_framework/real_data_risk_return_overview.png"
export const meta: PostMeta = {
    title: "Building a Fund Performance Analysis Workflow in Python Part 3: Bringing the Tool into the Real World",
    description:
        "Bringing a multi fund performance analysis system into the real world with yfinance, weighted portfolio views, and improved reporting.",
    date: "2026-04-03",
    tags: ["finance", "python", "analysis", "pandas"],
    type: "tutorial",
    slug: "fund-manager-performance-analysis-tool-python-part-3",
    nextInSeriesSlug: "fund-manager-performance-analysis-tool-python-part-4",
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
                linkHref="/tutorials/fund-manager-performance-analysis-tool-python-part-2"
                linkLabel="Open Part 2"
            >
                This tutorial builds directly on Parts 1 and 2. Ensure you already have the full analysis pipeline before continuing.
            </Disclaimer>

            <Text
                content={`In Part 1, we built a performance analysis pipeline for a single fund. In Part 2, we extended that system into a multi fund comparison workflow with ranking, monitoring, and structured reporting outputs.`}
            />

            <Text
                heading="From MVP to Useful Tool"
                content={`The Part 2 version was an MVP, and it did what an MVP needs to do. It could load data, run the core analysis, rank funds, and export a summary, which was enough to prove that the framework itself made sense.

What it could not yet do was survive contact with a more realistic workflow: It still depended on synthetic datasets, neatly prepared inputs, and a reporting layer that was designed more for clarity than for practical portfolio review.

Part 3 is where we refine that MVP into something genuinely useful.`}
            />

            <Text
                content={`Let's bring the system closer to real analyst workflow. We will introduce live market data, build a weighted portfolio view on top of the Part 2 framework, and improve the reporting so the outputs are more useful in practice.`}
            />

            <Text
                content={`We will:`}
                bullets={[
                    "Apply the system to real market data",
                    "Analyse the individual holdings in a portfolio",
                    "Improve the reporting layer",
                    "Add weighted portfolio analysis on top of the existing framework",
                ]}
            />

            <Text
                content={`The goal of this tutorial is not to redesign the system from scratch. The goal is to take the working Part 2 MVP, expose it to real market data, identify where it falls short, and improve the tool without abandoning the structure we already built.`}
            />

            <Text
                heading="1. Loading Real Data"
                content={`So far, we have used controlled datasets. Now we are going to swap that tutorial data source for live market data while keeping the rest of the Part 2 analysis pipeline intact.`}
            />

            <Text
                content={`We will use yfinance to download price data, convert it to monthly returns, and shape the result so it still matches the DataFrame contract used throughout Part 2.`}
            />

            <Text
                content={`As soon as we do this, the system will start to behave differently. The charts become noisier, differences become less obvious, and outputs feel much less clean, which is exactly what we want:  real data is what exposes the strengths and weaknesses of a system.`}
            />

            <Text
                content={`We will now load price data and convert it into monthly returns in the same shape used by the earlier CSV based workflow. There is a fair bit of plumbing here, but the important idea is simple: load_market_analysis_frame() should become our new loader, and everything downstream should still work.`}
            />

            <Text
                content={`If you are starting from a clean Part 2 project and do not already have the dependencies installed, make sure pandas, matplotlib, cycler, and yfinance are available in your environment before continuing.`}
            />

            <Text
                lead="1.1 Downloading Real Data"

            />
            <Text content={`If you don't have the Yahoo Finance package installed, run:`} />
            <Text code={`pip install yfinance`} />

            <Text
                content={`Then add the following import and helper to analytics/transforms.py:`}
            />

            <Text
                code={`import yfinance as yf`}
            />

            <Text
                code={`def download_price_history(tickers, start, end):
    cache_dir = Path(".cache") / "yfinance"
    cache_dir.mkdir(parents=True, exist_ok=True)
    yf.set_tz_cache_location(str(cache_dir.resolve()))

    prices = yf.download(
        tickers=tickers,
        start=start,
        end=end,
        auto_adjust=True,
        progress=False,
    )

    if prices.empty:
        raise ValueError("No price data was returned for the requested tickers and date range")

    if isinstance(prices.columns, pd.MultiIndex):
        if "Close" not in prices.columns.get_level_values(0):
            raise ValueError("Downloaded price data did not include a Close column")
        prices = prices["Close"]

    if isinstance(prices, pd.Series):
        prices = prices.to_frame()

    prices = prices.dropna(how="all")
    if prices.empty:
        raise ValueError("Price history was empty after dropping all-null rows")

    return prices`}
            />

            <Text
                lead={`1.2 Converting Raw Prices into Monthly Returns`}
                content={`Now we need to convert the raw price data from yfinance to the monthly return series which the rest of our system expects. Add this helper to analytics/transforms.py:`}
            />

            <Text
                code={`def prices_to_monthly_returns(prices):
    monthly_prices = prices.resample("ME").last()
    monthly_returns = monthly_prices.pct_change().dropna(how="all")
    if monthly_returns.empty:
        raise ValueError("Monthly return series was empty after resampling")
    return monthly_returns`}
            />

            <Text
                lead={`1.3 Wrapping Price Loading Into A Useful Interface`}
                content={`Next, we will wrap these in a loader style helper that gives us the same analysis ready DataFrame shape used in Part 2. This lets the rest of the system keep working without caring whether the data came from CSV files or a market data download.`}
            />

            <Text
                code={`def load_market_analysis_frame(
    holdings: list[str],
    benchmark_ticker: str,
    price_start: str,
    price_end: str,
    analysis_start: str,
    analysis_end: str,
) -> pd.DataFrame:
    tickers = [*holdings, benchmark_ticker]

    prices = download_price_history(
        tickers=tickers,
        start=price_start,
        end=price_end,
    )

    monthly_returns = prices_to_monthly_returns(prices)
    analysis_returns = monthly_returns[
        (monthly_returns.index >= analysis_start) &
        (monthly_returns.index <= analysis_end)
    ]

    if analysis_returns.empty:
        raise ValueError("The analysis period did not contain any monthly returns")

    if benchmark_ticker not in analysis_returns.columns:
        raise ValueError(f"Benchmark ticker {benchmark_ticker} was not found in returns data")

    frames = []

    for ticker in analysis_returns.columns:
        if ticker == benchmark_ticker:
            continue

        frames.append(
            pd.DataFrame(
                {
                    "date": analysis_returns.index,
                    "fund_name": ticker,
                    "fund": analysis_returns[ticker].values,
                    "benchmark": analysis_returns[benchmark_ticker].values,
                }
            )
        )

    if not frames:
        raise ValueError("No holdings were available after excluding the benchmark ticker")

    return pd.concat(frames, ignore_index=True)`}
            />

            <Text
                content={`You do not need to follow every line here in detail yet. The key point is that load_market_analysis_frame() now gives us the same analysis ready input shape that Part 2 expected from CSV files, which means the rest of the workflow can stay almost unchanged.`}
            />

            <Text
                lead="1.4 Preparing main.py for the New Loader"
                content={`Before we run the full analysis again, tidy up main.py so it can call the new loader directly. Start by moving the real data configuration to module level constants near the top of main.py, above your helper functions and main():`}
                code={`HOLDINGS = ["VOO", "QQQ", "IEFA", "EEM", "VNQ", "AGG"]
BENCHMARK = "VT"
PRICE_START = "2023-12-01"
PRICE_END = "2025-01-01"
ANALYSIS_START = "2024-01-31"
ANALYSIS_END = "2024-06-30"`}
            />

            <Text
                content={`Then add a small helper in main.py that hides the loader arguments behind a clearer name. This keeps the loader call out of main(), and it also gives us something easy to reuse later on:`}
                code={`def get_holdings_analysis_frame():
    return load_market_analysis_frame(
        holdings=HOLDINGS,
        benchmark_ticker=BENCHMARK,
        price_start=PRICE_START,
        price_end=PRICE_END,
        analysis_start=ANALYSIS_START,
        analysis_end=ANALYSIS_END,
    )`}
            />

            <Text
                content={`If it is not already present, add this import at the top of main.py:`}
                code={`from analytics.transforms import load_market_analysis_frame`}
            />

            <Text
                content={`Before moving on, do a quick verification in main.py so you can confirm that the yfinance path is working. Still in main.py, temporarily reduce the body of main() to just this:`}
                code={`def main():
    df = get_holdings_analysis_frame()

    print(df.head())
    print("\\nFunds loaded:", sorted(df["fund_name"].unique()))`}
            />

            <Text
                content={`Run the script. If everything is working, you should see the first few rows of an analysis ready DataFrame and a list of fund names. Once that succeeds, we can put the real Part 2 analysis flow back on top of this new loader.`}
            />

            <Text
                heading="2. Running the Existing Analysis on Real Data"
                content={`Now that the loader works, the next step is deliberately conservative: keep the Part 2 analysis pipeline the same, and only swap out the data source.`}
            />

            <Text
                content={`Update main.py so that it:`}
                bullets={[
                    "Loads real market data for the holdings and the benchmark",
                    "Converts that data into the same Part 2 analysis DataFrame shape",
                    "Runs the same summary and charting pipeline used in the Part 2 main method",
                ]}
            />

            <Text
                content={`At the top of main.py, keep any imports you still use and add the following ones only if they are not already present:`}
            />

            <Text
                code={`from analytics.transforms import (
    load_market_analysis_frame,
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
)`}
            />

            <Text
                content={`Because main.py is no longer loading CSV files from the command line, you could also remove the old argparse and load_returns related code if you no longer plan on using data from disk. This is also a good point to clean up the import block, so only the helpers still used by main.py remain.`}
            />

            <Text
                content={`Still in main.py, add one helper below get_holdings_analysis_frame() that runs the same Part 2 summary pipeline for any analysis ready DataFrame:`}
                code={`def analyse_frame(df):
    summary = run_analysis(df)
    ranked = rank_funds(summary)
    monitored = apply_monitoring_flags(df, ranked)
    return format_summary(monitored)`}
            />

            <Text
                content={`Then, still in main.py, replace the body of main() so it only orchestrates the steps:`}
                code={`def main():
    setup_matplotlib_style()

    df = get_holdings_analysis_frame()
    formatted = analyse_frame(df)

    export_summary(formatted)
    print_flags(formatted)
    print("\\nFormatted summary:")
    print(formatted)

    plot_cumulative_performance(
        df,
        save_path="output/holdings_comparison.png",
    )`}
            />


            <Text
                content={`Run the script.

This gives us the same outputs we already understand from Part 2, but now they are being driven by live market data. That is the first proof step, and it matters because we want to know that the original workflow still functions before we start improving it.

The next question is whether the current reporting layer is good enough for this more realistic setting.`}
            />
            <Text
                heading="3. Finding the Shortcomings"
                content={`At the end of Chapter 2, we ran our existing analysis suite on real data for the first time. This is the first time the system has been exposed to realistic holdings data with enough scope to simulate an actual portfolio review, so this is exactly where earlier design shortcuts begin to show themselves.

You have probably already noticed some shortcomings in the output layer: That is expected. The earlier versions were built around simple datasets and structural clarity, not polished portfolio reporting.`}
            />

            <Text
                content={`This is a normal part of system design. You start with something simple, prove that the core idea works, and then, as the workflow grows in complexity or scope, you revisit the earlier modules to make sure they still meet the new standard. That is what we are going to do next:`}
            />

            <Text
                content={`Let's first look at the charts. At the moment, the holdings comparison chart is still the strongest visual output in the system:`}
            />

            <ImageBlock src={initialChart} alt={"The chart when analysing real data for the first time"}/>

            <Text
                content={`This chart is useful for comparing funds, but it does not yet give us a complete picture:`}
                bullets={[
                    "There is no clear visual emphasis on underperformance versus the benchmark",
                    "Our report contains a lot of volatility information which is not captured in this chart",
                    "Individual fund performance does not reflect a portfolio and its current weightings",
                ]}
            />

            <Text
                lead={"Although we have all the information, we just need to present it better."}/>




            <Text
                lead="3.1 Improving the Reporting Layer"
                content={``}
            />
            <Text
                content={`Our system so far produces the right data, but it does not yet present it in a way that supports practical portfolio review. The next improvement is to add the weighted portfolio itself to the analysis mix, so we can compare the portfolio directly against its holdings and benchmark. To do that, we will add the following features:`}
                bullets={[
                    "Add new helper methods to perform calculations on our weighted portfolio",
                    "Modify our line chart to show portfolio alongside the funds and visually highlight when it is above or below the benchmark",
                    "Add a new chart to show the drawdown of our portfolio and each fund in it",
                    "Add a new scatter graph for returns vs standard deviation of returns for our portfolio, its funds, and the benchmark",
                ]}
            />

            <Text
                content={`We will build these improvements into the project in that same order, so the reporting layer grows in a deliberate and readable way.`}
            />

            <Text
                content={`Start by adding the portfolio helpers to analytics/transforms.py:`}
                code={`def portfolio_returns_from_weights(
    returns: pd.DataFrame,
    weights: dict[str, float],
) -> pd.Series:
    missing = [ticker for ticker in weights if ticker not in returns.columns]
    if missing:
        raise ValueError(f"Missing return series for tickers: {missing}")

    weighted = pd.DataFrame(
        {ticker: returns[ticker] * weight for ticker, weight in weights.items()}
    )

    return weighted.sum(axis=1)


def build_portfolio_analysis_frame(
    portfolio_returns: pd.Series,
    benchmark_returns: pd.Series,
    portfolio_name: str = "Example_Portfolio",
) -> pd.DataFrame:
    df = pd.DataFrame(
        {
            "date": portfolio_returns.index,
            "fund_name": portfolio_name,
            "fund": portfolio_returns.values,
            "benchmark": benchmark_returns.reindex(portfolio_returns.index).values,
        }
    )

    if df["benchmark"].isnull().any():
        raise ValueError("Benchmark series could not be aligned to portfolio returns")

    return df.reset_index(drop=True)
`}
            />

            <Text
                content={`These helpers let us calculate the weighted portfolio return series and then package it into the same analysis shape used elsewhere in the project. That means the existing analysis and charting functions can be extended rather than replaced, which is exactly the kind of reuse we want at this stage.`}
            />

            <Text
                content={`Because the portfolio weighting step needs access to the underlying monthly return table, add one more loader helper to analytics/transforms.py:`}
                code={`def load_market_return_table(
    tickers: list[str],
    price_start: str,
    price_end: str,
    analysis_start: str,
    analysis_end: str,
) -> pd.DataFrame:
    prices = download_price_history(
        tickers=tickers,
        start=price_start,
        end=price_end,
    )

    monthly_returns = prices_to_monthly_returns(prices)
    analysis_returns = monthly_returns[
        (monthly_returns.index >= analysis_start) &
        (monthly_returns.index <= analysis_end)
    ]

    if analysis_returns.empty:
        raise ValueError("The analysis period did not contain any monthly returns")

    return analysis_returns`}
            />

            <Text
                content={`Keep applying the same structure in main.py, with shared configuration at the top and then small helper functions for each responsibility. Add the portfolio configuration constants now, directly below the earlier holdings and date constants:`}
                code={`WEIGHTS = {
    "VOO": 0.30,
    "QQQ": 0.25,
    "IEFA": 0.15,
    "EEM": 0.10,
    "VNQ": 0.10,
    "AGG": 0.10,
}

TICKERS = [*HOLDINGS, BENCHMARK]`}
            />

            <Text
                content={`Then add helpers that expose the new tasks with clearer names:`}
                code={`def get_analysis_return_table():
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
    print(f"\\n{heading}:")
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
    )`}
            />

            <Text
                content={`Next, open reporting/charts.py. We are going to keep the existing chart module, but extend the current chart patterns so they can optionally include the portfolio with its own hard coded styling, similar to how the benchmark is already highlighted.`}
            />

            <Text
                content={`Start by updating the imports:`}
                code={`from pathlib import Path

import matplotlib.pyplot as plt
import pandas as pd
from cycler import cycler

from analytics.calculations import cumulative_growth, drawdown`}
            />

            <Text
                lead="3.1.1 Performance Chart"
                content={`First, extend our existing performance chart. The goal is not to redesign it, only to allow an optional portfolio series to be plotted with a stronger visual style than the individual holdings, and to make the gap between portfolio and benchmark easier to read.`}
            />

            <Text
                content={`Update plot_cumulative_performance() so it can accept an optional portfolio DataFrame. When the portfolio is present, shade the space between portfolio and benchmark in a very light green when the portfolio is ahead and a very light red when it is behind:`}
                code={`def plot_cumulative_performance(
    df: pd.DataFrame,
    portfolio: pd.DataFrame | None = None,
    save_path: str | None = None,
) -> None:
    fig, ax = plt.subplots(figsize=(12, 7))
    style_axes(fig, ax, grid=True, zero_line=False)

    for fund_name, group in df.groupby("fund_name"):
        group = group.sort_values("date")
        fund_cum = cumulative_growth(group["fund"])

        ax.plot(
            group["date"],
            fund_cum,
            linewidth=2.0,
            alpha=0.85,
            zorder=3,
            label=fund_name,
        )

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

    if portfolio is not None:
        portfolio_series = portfolio.sort_values("date").reset_index(drop=True)
        portfolio_cum = cumulative_growth(portfolio_series["fund"])
        portfolio_name = portfolio_series["fund_name"].iloc[0]

        benchmark_for_portfolio = benchmark_series.set_index("date")["benchmark"].reindex(
            portfolio_series["date"]
        )
        benchmark_portfolio_cum = cumulative_growth(
            benchmark_for_portfolio.reset_index(drop=True)
        )
        portfolio_values = portfolio_cum.to_numpy()
        benchmark_values = benchmark_portfolio_cum.to_numpy()

        ax.fill_between(
            portfolio_series["date"],
            portfolio_values,
            benchmark_values,
            where=portfolio_values >= benchmark_values,
            interpolate=True,
            color="#3FC083",
            alpha=0.10,
            zorder=4,
        )
        ax.fill_between(
            portfolio_series["date"],
            portfolio_values,
            benchmark_values,
            where=portfolio_values < benchmark_values,
            interpolate=True,
            color="#B13A2F",
            alpha=0.10,
            hatch="////",
            edgecolor="#B13A2F",
            linewidth=0.0,
            zorder=4,
        )

        ax.plot(
            portfolio_series["date"],
            portfolio_cum,
            color=COLORS["fg"],
            linewidth=3.2,
            linestyle="-",
            zorder=6,
            label=portfolio_name,
        )

    ax.set_title("Holdings and Portfolio Performance")
    ax.set_xlabel("Date")
    ax.set_ylabel("Growth Index")
    ax.legend(frameon=False, ncol=2)

    plt.tight_layout()

    if save_path:
        output_path = Path(save_path)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        plt.savefig(output_path, dpi=150)
        print(f"\\nChart saved to: {output_path}")

    plt.show()`}
            />

            <Text
                content={`The design pattern here is simple. Keep the holdings behaviour as the default, then optionally overlay the portfolio in a clearly distinct style.`}
            />

            <Text
                lead="3.1.2 Drawdown Chart"
                content={`Apply that same idea to drawdown. Rather than creating a separate chart style, extend the existing drawdown chart so it can show all holdings and optionally the portfolio on top.`}
            />

            <Text
                content={`Replace the earlier drawdown chart with this version:`}
                code={`def plot_drawdown(
    df: pd.DataFrame,
    portfolio: pd.DataFrame | None = None,
    save_path: str | None = None,
) -> None:
    fig, ax = plt.subplots(figsize=(12, 7))
    style_axes(fig, ax, grid=True, zero_line=True)

    for fund_name, group in df.groupby("fund_name"):
        group = group.sort_values("date")
        fund_dd = drawdown(cumulative_growth(group["fund"]))

        ax.plot(
            group["date"],
            fund_dd,
            linewidth=1.8,
            alpha=0.75,
            zorder=3,
            label=fund_name,
        )

    if portfolio is not None:
        portfolio_series = portfolio.sort_values("date").reset_index(drop=True)
        portfolio_dd = drawdown(cumulative_growth(portfolio_series["fund"]))
        portfolio_name = portfolio_series["fund_name"].iloc[0]

        ax.plot(
            portfolio_series["date"],
            portfolio_dd,
            color=COLORS["fg"],
            linewidth=3.0,
            linestyle="-",
            zorder=5,
            label=portfolio_name,
        )

    ax.set_title("Holdings and Portfolio Drawdown")
    ax.set_xlabel("Date")
    ax.set_ylabel("Drawdown")
    ax.legend(frameon=False, ncol=2)

    plt.tight_layout()

    if save_path:
        output_path = Path(save_path)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        plt.savefig(output_path, dpi=150)
        print(f"\\nChart saved to: {output_path}")

    plt.show()`}
            />

            <Text
                content={`This keeps the same usage pattern as the performance chart. The function still works for holdings alone, but it can now show the portfolio as well when we pass one in.`}
            />

            <Text
                lead="3.1.3 Risk and Return Scatter"
                content={`Finally, add a risk versus return scatter plot. This follows the same pattern again: plot each holding from the analysis DataFrame, include the benchmark, and optionally add the portfolio as a distinct point.`}
            />

            <Text
                content={`Add this new chart function:`}
                code={`def plot_risk_return_scatter(
    df: pd.DataFrame,
    portfolio: pd.DataFrame | None = None,
    save_path: str | None = None,
) -> None:
    fig, ax = plt.subplots(figsize=(12, 7))
    style_axes(fig, ax, grid=True, zero_line=True)

    for fund_name, group in df.groupby("fund_name"):
        ax.scatter(
            group["fund"].std(ddof=0),
            group["fund"].mean(),
            s=90,
            alpha=0.85,
            zorder=3,
            label=fund_name,
        )

    benchmark_series = df.sort_values("date").drop_duplicates("date")["benchmark"]
    ax.scatter(
        benchmark_series.std(ddof=0),
        benchmark_series.mean(),
        color=COLORS["benchmark"],
        s=140,
        marker="X",
        zorder=4,
        label="Benchmark",
    )

    if portfolio is not None:
        ax.scatter(
            portfolio["fund"].std(ddof=0),
            portfolio["fund"].mean(),
            color=COLORS["fg"],
            s=150,
            marker="D",
            zorder=5,
            label=portfolio["fund_name"].iloc[0],
        )

    ax.set_title("Risk vs Return Overview")
    ax.set_xlabel("Monthly Volatility")
    ax.set_ylabel("Average Monthly Return")
    ax.legend(frameon=False, ncol=2)

    plt.tight_layout()

    if save_path:
        output_path = Path(save_path)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        plt.savefig(output_path, dpi=150)
        print(f"\\nChart saved to: {output_path}")

    plt.show()`}
            />

            <Text
                content={`With those chart updates in place, we can build the portfolio from the analysis window and pass it into each chart as an optional extra series.`}
            />

            <Text
                lead="3.1.4 Reporting Table"
                content={`The charts are now showing holdings, benchmark, and portfolio together, so the reporting table should do the same. To achieve that, we can build a benchmark row and a portfolio row in the same analysis contract, then export a combined summary table alongside the holdings only and portfolio only views.`}
            />

            <Text
                content={`We can reuse build_portfolio_analysis_frame() for the benchmark as well. In that case, the benchmark is simply compared against itself, which gives us a reference row with zero excess return.`}
            />

            <Text
                content={`At this point, only a few new imports need to be added to main.py. Open main.py, tidy the existing import block, remove anything that has become unused, and add the following only if they are not already present:`}
                code={`import pandas as pd

from analytics.transforms import (
    build_portfolio_analysis_frame,
    load_market_return_table,
    portfolio_returns_from_weights,
)
from reporting.charts import (
    plot_drawdown,
    plot_risk_return_scatter,
)`}
            />

            <Text
                content={`With those helpers in place, stay in main.py and replace the body of main() with the following. The helper layer above it should stay exactly as introduced earlier:`}
                code={`def main():
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
`}
            />


            <Text
                content={`Run main.py and you will see that the analysis is much more useful. We can see the holdings, the current portfolio, the downside profile, and the broad return versus volatility trade off in one reporting layer.`}
            />

            <Text
                heading="4. What We Built"
                content={`At this stage, the Part 2 system has been brought into a much more realistic setting.`}
                bullets={[
                    "We can download live market data with yfinance",
                    "We can convert that data into the same analysis contract used in Part 2",
                    "We can analyse both individual holdings and a weighted portfolio",
                    "We can compare holdings, benchmark, and portfolio in both charts and summary tables",
                    "We have a reporting layer that is much closer to something usable in practice",
                ]}
            />

            <Text
                content={`The difference from the MVP is not that the core calculations changed: The improvement is that the tool now presents the same analysis in a way that is much easier to interpret, which is often what matters most once a workflow stops being purely academic.`}
            />

            <Text
                lead="4.1 Performance Overview"
                content={`The first chart is still the main comparison view, but it is now much more informative. We can see the individual holdings, the benchmark, and the weighted portfolio in one place, and the shading between the portfolio and benchmark makes relative outperformance and underperformance much easier to read without changing the underlying calculation.`}
            />

            <ImageBlock
                src={realDataPerformanceOverview}
                alt={"Performance overview chart showing holdings, benchmark, and current portfolio"}
            />

            <Text
                content={`This is a better decision support chart than the earlier MVP version because it answers two questions at once:`}
                bullets={[
                    "Which holdings are driving the strongest and weakest return paths",
                    "Whether the portfolio as a whole is actually keeping up with the benchmark",
                ]}
            />

            <Text
                lead="4.2 Drawdown Overview"
                content={`The second chart focuses on downside rather than growth. This matters because a portfolio can produce acceptable returns while still taking an uncomfortable path to get there.`}
            />

            <ImageBlock
                src={realDataDrawdownOverview}
                alt={"Drawdown overview chart showing holdings and current portfolio"}
            />

            <Text
                content={`By showing the holdings and the portfolio together, the drawdown view makes it much easier to identify which positions are contributing most to downside behaviour, and whether the portfolio is smoothing that risk or concentrating it.`}
            />

            <Text
                lead="4.3 Risk and Return Overview"
                content={`The third chart compresses the same analysis into a simple risk versus return view. This gives us a quick way to compare the broad trade off each holding is making, while also placing the benchmark and portfolio into the same frame.`}
            />

            <ImageBlock
                src={realDataRiskReturnOverview}
                alt={"Risk and return overview scatter plot showing holdings, benchmark, and current portfolio"}
            />

            <Text
                content={`The risk and return view is not a replacement for the time series charts, but it is a useful complement. It quickly shows whether stronger returns are being earned efficiently, or whether they are simply being bought with higher volatility.`}
            />

            <Text
                lead="4.4 Reporting Table"
                content={`The reporting table improves in the same way as the charts. Instead of showing only the holdings, it now includes the benchmark and the current portfolio in the same summary view:`}
                code={`Name               Final Value   Benchmark   Max DD   Avg Excess   Review
---------------------------------------------------------------------------
QQQ                   17.33%       10.46%    -4.37%      1.06%      Yes
Benchmark             10.46%       10.46%    -3.58%      0.00%      No
VOO                   15.28%       10.46%    -4.01%      0.73%      Yes
EEM                    6.65%       10.46%    -0.22%     -0.59%      Yes
Current_Portfolio      9.83%       10.46%    -3.85%     -0.10%      Yes
IEFA                   5.08%       10.46%    -3.26%     -0.84%      Yes
AGG                   -0.71%       10.46%    -3.05%     -1.82%      Yes
VNQ                   -3.21%       10.46%    -7.94%     -2.15%      No`}
            />

            <Text
                content={`This is more readable than the earlier holdings only summary because it lets us compare three levels of analysis at once: the individual positions, the portfolio they combine into, and the benchmark they are meant to beat.`}
            />

            <Text
                content={`This is the point of Part 3. The system is no longer merely capable of running, because it now produces outputs that are much easier to inspect, compare, and discuss before any portfolio decisions are made.`}
            />

            <Text
                content={`That is enough for one tutorial part.

We have not changed the portfolio yet, and we have not tested any rebalance ideas. This part was only about proving that the original multi fund framework can survive contact with real data and still produce useful outputs.`}
            />

            <Text
                heading="5. Next Steps"
                content={`In the next part, we will use this improved real data workflow for a different task:`}
                bullets={[
                    "Interpret the outputs as an analyst would",
                    "Define a revised portfolio based on those observations",
                    "Run the original and revised portfolios on a later evaluation window",
                    "Compare whether the rebalance actually moved the portfolio closer to its mandate",
                ]}
            />

            <Text
                content={`The next part of the workflow is different in scope. Once the system is working on real data and producing useful reports, we can move on to using those outputs to justify and test a rebalance scenario.`}
            />

            <Text
                content={
                    <>
                        If you need to revisit the existing chart framework before expanding it further, see{" "}
                        <Link href="https://theportfoliolab.nz/tutorials/matplotlib-axis-control-and-chart-templates">
                            Matplotlib Axis Control and Chart Templates
                        </Link>.
                    </>
                }
            />
        </Body>
    )
}
