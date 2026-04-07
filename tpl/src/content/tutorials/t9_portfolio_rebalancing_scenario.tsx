import Body from "@/components/content/body"
import Disclaimer from "@/components/content/disclaimer"
import ImageBlock from "@/components/content/imageblock.tsx";
import Link from "@/components/content/link"
import { Text } from "@/components/content/text"
import type { PostMeta } from "@/components/content/types"
import inheritedPortfolioPerformanceOverview from "@/content/tutorials/t9_portfolio_rebalancing_scenario/inherited_portfolio_performance_overview.png"
import inheritedPortfolioDrawdownOverview from "@/content/tutorials/t9_portfolio_rebalancing_scenario/inherited_portfolio_drawdown_overview.png"
import inheritedPortfolioRiskReturnOverview from "@/content/tutorials/t9_portfolio_rebalancing_scenario/inherited_portfolio_risk_return_overview.png"
import rebalancedPortfolioEvaluationComparison from "@/content/tutorials/t9_portfolio_rebalancing_scenario/rebalanced_portfolio_evaluation_comparison.png"

export const meta: PostMeta = {
    title: "Building a Fund Performance Analysis Workflow in Python Part 4: Portfolio Rebalancing and Evaluation",
    description:
        "Using the improved real data workflow to evaluate an imaginary portfolio mandate and test a rebalance scenario.",
    date: "2026-04-07",
    tags: ["python", "finance", "portfolio analysis", "pandas", "yfinance"],
    type: "tutorial",
    slug: "fund-manager-performance-analysis-tool-python-part-4",
}

export default function Tutorial() {
    return (
        <Body>
            <Disclaimer
                linkHref="/tutorials/fund-manager-performance-analysis-tool-python-part-3"
                linkLabel="Open Part 3"
            >
                This tutorial builds directly on Part 3, and assumes you already have the completed real data reporting workflow in place.
            </Disclaimer>

            <Text
                content={`In Part 3, we took the earlier MVP and refined it into a useful analysis tool for real market data.

We can now load live returns, analyse both holdings and a weighted portfolio, and produce reporting outputs that are strong enough to support practical monitoring, which means we are finally ready to use the tool for what it was meant to do: support portfolio decisions.`}
            />

            <Text
                heading="From Monitoring to Rebalancing"
                content={`This part is not about rebuilding the system, because the system is already good enough for the task in front of us.

Now the job changes. We will use the completed Part 3 tool to analyse an imaginary inherited portfolio, form a view on what the outputs are telling us, define a revised set of weights, and then test whether those changes moved the portfolio closer to its stated mandate.`}
            />

            <Text
                content={`This is still a simplified exercise, and it is not a full institutional test.

But it does reflect an important real world habit: first analyse the portfolio using only the information available at the time, and only then judge the decision after a later period has passed.`}
            />

            <Text
                content={`In this part, we will:`}
                bullets={[
                    "Define an imaginary portfolio mandate",
                    "Run the Part 3 analysis workflow on the inherited weights",
                    "Interpret the results rather than immediately changing the portfolio",
                    "Propose a revised allocation",
                    "Test the original and revised portfolios on a later period",
                    "Compare the outcome against the mandate",
                ]}
            />

            <Text
                heading="1. The Portfolio Mandate"
                content={`Imagine that you inherit a portfolio which is already invested.

You are not starting from scratch, and you are not trying to discover the mathematically optimal allocation.

Your job is narrower, and more realistic:

determine whether the current portfolio looks aligned with its mandate, and if not, make a defensible rebalance proposal.`}
            />

            <Text
                content={`The holdings are:`}
                bullets={[
                    "VOO: broad US equities",
                    "QQQ: growth and technology heavy US equities",
                    "IEFA: developed markets outside the US",
                    "EEM: emerging markets",
                    "VNQ: listed real estate",
                    "AGG: aggregate bonds",
                ]}
            />

            <Text
                content={`The inherited weights are:`}
                code={`security,weight
VOO,0.20
QQQ,0.20
IEFA,0.20
EEM,0.10
VNQ,0.25
AGG,0.05`}
            />

            <Text
                content={`We will measure the portfolio against a single benchmark:`}
                bullets={["VT: global equity market proxy"]}
            />

            <Text
                content={`The mandate is deliberately simple:`}
                bullets={[
                    "Achieve steady long term growth",
                    "Avoid drawdowns that become noticeably worse than the benchmark",
                    "Retain meaningful diversification rather than relying too heavily on one growth sleeve",
                ]}
            />

            <Text
                content={`That wording matters.

If the mandate were purely "maximise return", the analysis might point in one direction.

If the mandate emphasises steadier growth and diversification, the same output may justify a different set of trade offs.`}
            />

            <Text
                heading="2. The Testing Schema"
                content={`A common mistake in portfolio analysis is to mix up the information used to make the decision with the information used to judge it.

We will avoid that by splitting the workflow into two periods:`}
                bullets={[
                    "Analysis period: the period we are allowed to inspect before making a rebalance decision",
                    "Evaluation period: the later period we use to judge whether the rebalance actually helped",
                ]}
            />

            <Text
                content={`The testing sequence for this tutorial is:`}
                bullets={[
                    "Run the tool on the inherited portfolio during the analysis period",
                    "Inspect the charts and tables carefully",
                    "Form a view on the portfolio's strengths and weaknesses",
                    "Define a revised set of weights",
                    "Run both the original and revised portfolios on the evaluation period",
                    "Compare the results against the mandate",
                ]}
            />

            <Text
                content={`Notice that this leaves room for judgement.

The tool does not tell us what to buy or sell. It gives us evidence, and we still need to think about what that evidence means in the context of the mandate.`}
            />

            <Text
                heading="3. Preparing the Scenario in main.py"
                content={`Start from your completed Part 3 project.

The goal here is to reuse as much of the Part 3 structure as possible, so do not rewrite the project from scratch.

Instead, open main.py and make a small number of focused changes so the Part 3 workflow can run across two different time windows.`}
            />

            <Text
                content={`First, stay at the top of main.py where your existing module level constants already live. Extend that section so it includes both the evaluation window and the revised weights:`}
                code={`HOLDINGS = ["VOO", "QQQ", "IEFA", "EEM", "VNQ", "AGG"]
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

TICKERS = [*HOLDINGS, BENCHMARK]`}
            />

            <Text
                content={`Next, stay in main.py and replace the earlier one period helper get_analysis_return_table() with a more general helper. Put this in the same place as the old helper, so the layout of the file still reads cleanly from configuration to helpers to main():`}
                code={`def get_return_table(start_date, end_date):
    return load_market_return_table(
        tickers=TICKERS,
        price_start=PRICE_START,
        price_end=PRICE_END,
        analysis_start=start_date,
        analysis_end=end_date,
    )`}
            />

            <Text
                content={`A little further down main.py, replace the old build_current_portfolio_frame() helper with a more general portfolio builder. This should sit with the other small data preparation helpers, directly below get_return_table():`}
                code={`def build_portfolio_frame(returns, weights, name):
    portfolio_returns = portfolio_returns_from_weights(
        returns=returns,
        weights=weights,
    )
    return build_portfolio_analysis_frame(
        portfolio_returns=portfolio_returns,
        benchmark_returns=returns[BENCHMARK],
        portfolio_name=name,
    )`}
            />

            <Text
                content={`Still in main.py, make sure the import block matches the helpers we are now using. Keep the Part 3 imports you still need, remove old ones that have become unused, and make sure the block includes:`}
                code={`import pandas as pd

from analytics.transforms import (
    build_portfolio_analysis_frame,
    load_market_analysis_frame,
    load_market_return_table,
    portfolio_returns_from_weights,
)
from analytics.summaries import (
    apply_monitoring_flags,
    rank_funds,
    run_analysis,
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
)`}
            />

            <Text
                content={`At this point, main.py should still feel very similar to Part 3. The only real change so far is that the helper layer is now flexible enough to run the same process across two periods and two sets of weights.`}
            />

            <Text
                heading="4. Running the Analysis on the Inherited Portfolio"
                content={`Now run the analysis period workflow first, using the inherited weights only.

This should feel very close to Part 3. The difference is that we are now treating the output as the starting point for a portfolio decision.`}
            />

            <Text
                content={`Stay in main.py. Keep the Part 3 helpers that still make sense, and replace the helper section above main() so it now looks like this. This is an import tidy up point as well, so remove anything from the top of the file that these helpers no longer use:`}
                code={`def analyse_frame(df):
    summary = run_analysis(df)
    ranked = rank_funds(summary)
    monitored = apply_monitoring_flags(df, ranked)
    return format_summary(monitored)


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
                content={`Do not touch the charts or analytics modules for this step. Still in main.py, add one more helper below plot_reporting_views() that wraps the entire Part 3 style analysis period workflow:`}
                code={`def run_analysis_period():
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

    plot_reporting_views(holdings_df, portfolio_df)`}
            />

            <Text
                content={`At this point, your main.py should already be shorter than before, because you are moving the old Part 3 analysis block into a named helper instead of leaving it inline inside main().

You can run the script after temporarily calling run_analysis_period() from main(), but the more important step is to stop and think before continuing.

The important question is not simply which line goes up the most. The important question is whether the portfolio seems to be earning its return in a way that is consistent with the mandate.`}
            />

            <Text
                content={`Some prompts to guide your reading:`}
                bullets={[
                    "Is the portfolio keeping up with the benchmark closely enough?",
                    "Which holdings appear to be driving most of the upside?",
                    "Are those same holdings also the main source of portfolio risk?",
                    "Does the current mix actually look diversified in behaviour, or only diversified by label?",
                    "Which positions look weak on both return and mandate fit?",
                ]}
            />

            <Text
                heading="5. Turning Analysis into a Rebalance Thesis"
                content={`This is where finance judgement enters the process.

A rebalance is not just a list of winners and losers. It is an argument about portfolio construction.`}
            />

            <Text
                content={`For example, a holding can have weak recent return but still deserve a place because it improves diversification or dampens portfolio drawdown.

Likewise, a strong performer can still be a candidate for reduction if its risk contribution is large and the portfolio is becoming too concentrated around one theme.`}
            />

            <Text
                content={`That is why this tutorial should not hand you the conclusion too early. Look at the inherited portfolio outputs first, and try to write down your own tentative rebalance thesis before adding the next code.`}
            />

            <Text
                content={`One reasonable reading of the analysis is that the portfolio is not badly diversified by label, but it is still too exposed to sleeves that are either failing to earn their place, or adding more downside pressure than the mandate really needs.`}
            />

            <Text
                lead="5.1 Performance Chart"
                content={`Start with the performance view. This gives us the clearest first impression of which sleeves are helping, which ones are lagging, and whether the inherited portfolio is actually keeping up with the benchmark over the analysis period.`}
            />

            <ImageBlock
                src={inheritedPortfolioPerformanceOverview}
                alt={"Inherited portfolio performance overview showing holdings, benchmark, and portfolio"}
            />

            <Text
                content={`A few things stand out here. QQQ and VOO are doing most of the heavy lifting on the upside, while VNQ is plainly weak and never really recovers into a convincing role. The portfolio line also spends too much of the period below the benchmark, which is a problem for a mandate that still wants steady growth rather than just diversification for its own sake.`}
            />

            <Text
                content={`That opens one possible line of reasoning: reduce exposure to the sleeve that is clearly dragging on performance, then reallocate some of that weight toward parts of the portfolio that are not already doing the same job as VOO and QQQ.`}
            />

            <Text
                lead="5.2 Drawdown Chart"
                content={`The drawdown view adds the risk side of the story. This is where we can see whether the weak performers are at least helping to control downside, or whether they are giving us the worst of both worlds.`}
            />

            <ImageBlock
                src={inheritedPortfolioDrawdownOverview}
                alt={"Inherited portfolio drawdown overview showing holdings and portfolio"}
            />

            <Text
                content={`This chart makes the case against VNQ much stronger. It is not just weak on return, it also suffers the deepest drawdown in the group. By contrast, EEM has weaker return than we might like, but its drawdown is extremely shallow over this window, which means it can still be defended as a diversifying sleeve if the mandate values steadier behaviour.`}
            />

            <Text
                content={`That leads to a second plausible thesis. If one holding is weak on both return and drawdown, while another is weaker on return but much less damaging on downside, shifting some weight away from the first and into a steadier diversifier can be justified even before we get to the evaluation period.`}
            />

            <Text
                lead="5.3 Risk and Return Table"
                content={`The combined reporting table helps us gather the same story into one place. It does not replace the charts, but it does make it easier to compare the sleeves, the benchmark, and the inherited portfolio side by side:`}
                code={`Name               Final Value   Benchmark   Max DD   Avg Excess   Review
---------------------------------------------------------------------------
QQQ                   17.33%       10.46%    -4.37%      1.06%      Yes
VOO                   15.27%       10.46%    -4.01%      0.73%      No
Benchmark             10.46%       10.46%    -3.58%      0.00%      Yes
Current_Portfolio      7.21%       10.46%    -4.46%     -0.50%      Yes
EEM                    6.65%       10.46%    -0.22%     -0.59%      Yes
IEFA                   5.08%       10.46%    -3.26%     -0.84%      Yes
AGG                   -0.71%       10.46%    -3.05%     -1.82%      Yes
VNQ                   -3.21%       10.46%    -7.94%     -2.15%      No`}
            />

            <Text
                content={`The table sharpens the same message. The inherited portfolio itself finished below the benchmark, with weaker excess return and a deeper drawdown than we would really like. VNQ is the clearest problem position, while IEFA and AGG are also failing to justify their weights on this window. EEM is more mixed, because its return is not strong, but its drawdown profile is far better than the rest of the risk assets.`}
            />

            <Text
                lead="5.4 Risk and Return Scatter"
                content={`The scatter plot is useful because it compresses the trade off into one view. It helps us see whether a sleeve is earning its volatility, or whether it is simply taking risk without enough reward.`}
            />

            <ImageBlock
                src={inheritedPortfolioRiskReturnOverview}
                alt={"Inherited portfolio risk and return overview showing holdings, benchmark, and portfolio"}
            />

            <Text
                content={`In this view, QQQ and VOO look easier to defend. VNQ looks especially difficult to defend, because it sits in the wrong part of the chart on both dimensions. The current portfolio also does not sit in a very appealing position relative to the benchmark, which supports the idea that the inherited mix needs some adjustment rather than just passive acceptance.`}
            />

            <Text
                content={`Taken together, these outputs do not force one exact answer, but they do support a sensible family of answers. A reasonable rebalance would trim the holding that is weak on both return and downside, reduce some weight from the middling sleeves, and give more room to sleeves that either support steadier behaviour or diversify the sources of return more effectively.`}
            />

            <Text
                content={`For this tutorial, the main points we want to address are:`}
                bullets={[
                    "The inherited portfolio underperformed the benchmark over the analysis window, which is not what we want from a growth mandate",
                    "VNQ was weak on both return and drawdown, so it is the clearest source of avoidable drag",
                    "The portfolio was leaning heavily on VOO and QQQ for upside, which means diversification by label was stronger than diversification in behaviour",
                    "EEM looked mixed on return, but its downside behaviour was much calmer, which makes it easier to defend as a diversifying sleeve",
                    "AGG was not strong on return, but increasing its role can still make sense if the goal is to stabilise the overall portfolio rather than maximise raw upside",
                ]}
            />

            <Text
                content={`That is enough evidence to justify a practical rebalance proposal. This is one possible suggestion, but feel free to use your own weights if your own reading of the analysis leads you somewhere else. Encode your revised allocation in main.py:`}
                code={`REVISED_WEIGHTS = {
    "VOO": 0.20,
    "QQQ": 0.20,
    "IEFA": 0.05,
    "EEM": 0.15,
    "VNQ": 0.20,
    "AGG": 0.20,
}`}
            />

            <Text
                content={`Whether you agree with those changes is part of the exercise.

The point is not that this is the only valid answer. The point is that the answer should be explainable from the outputs.`}
            />

            <Text
                heading="6. Testing the Original and Revised Portfolios"
                content={`The rebalance thesis is still only a thesis, so now we need to test it on the later evaluation period.

This should be simpler than the analysis period workflow.

All we need to do is:`}
                bullets={[
                    "build an original portfolio frame on the evaluation period",
                    "build a rebalanced portfolio frame on the same period",
                    "export one reporting table for each",
                    "compare those two tables directly",
                    "plot both portfolios against the benchmark in one chart",
                ]}
            />

            <Text
                content={`For this step, leave main.py for a moment and open reporting/outputs.py.

If your Part 3 version does not already have a generic table exporter, add this below export_summary():`}
                code={`def export_table(df: pd.DataFrame, path: str) -> None:
    output_path = Path(path)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    df.to_csv(output_path, index=False)`}
            />

            <Text
                content={`Then, still in reporting/outputs.py, add a helper directly below export_table() that compares the two one row reporting tables and calculates the change in key metrics:`}
                code={`def compare_portfolio_summaries(original_formatted, rebalanced_formatted):
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

    return comparison`}
            />

            <Text
                content={`Still in reporting/outputs.py, add one more helper directly below it to turn the comparison table into a couple of plain English facts:`}
                code={`def print_comparison_facts(comparison_df):
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

    print(f"\\nReturn changed by {final_value_change:.2f} percentage points.")
    print(
        f"Maximum drawdown moved from {drawdown_original:.2f}% "
        f"to {drawdown_rebalanced:.2f}%."
    )`}
            />

            <Text
                content={`Now go back to main.py. Add a second orchestration helper below run_analysis_period() that handles the evaluation period test:`}
                code={`def run_evaluation_period():
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
    print("\\nEvaluation comparison:")
    print(comparison_table)
    print_comparison_facts(comparison_table)

    plot_cumulative_performance(
        original_eval_df,
        portfolio=rebalanced_eval_df,
        save_path="output/evaluation_portfolio_comparison.png",
    )`}
            />

            <Text
                content={`Notice what is happening here:`}
                bullets={[
                    "The original portfolio is passed in as the regular df argument, so it is plotted like any other series",
                    "The rebalanced portfolio is passed as portfolio=..., so it gets the special portfolio styling and benchmark shading",
                    "The comparison logic lives in reporting/outputs.py because it is part of presentation and reporting, not portfolio construction",
                ]}
            />

            <Text
                content={`Finally, stay in main.py and replace the body of main() with the simplest version yet. Nothing else in the file needs to move:`}
                code={`def main():
    setup_matplotlib_style()
    run_analysis_period()
    run_evaluation_period()`}
            />

            <Text
                content={`This is a deliberately simple evaluation design.

We are not claiming statistical certainty from one short period. We are simply asking a practical question: did the rebalance move the portfolio in the intended direction when the next period arrived?`}
            />

            <Text
                content={`Using the current sample output, the answer is yes.

The comparison table shows that final value improved from 5.01% to 5.16%, an increase of 0.15 percentage points. Maximum drawdown also improved from -3.34% to -2.80%.

That is enough to make the conclusion interesting: the rebalance did not beat the benchmark, but it did improve the portfolio relative to the inherited version on both return and drawdown over this evaluation window.`}
            />

            <Text
                heading="7. Interpreting the Result"
                content={`This last step is where the theory matters most.

Performance analysis is not only about whether return went up. A mandate aware judgement can include:`}
                bullets={[
                    "absolute return",
                    "return relative to benchmark",
                    "drawdown depth",
                    "concentration risk",
                    "consistency with the role each sleeve is meant to play",
                ]}
            />

            <Text
                content={`In the evaluation window, the revised portfolio did improve on the figures that matter most for this mandate.

Its final value increased from 5.01% to 5.16%, while the benchmark finished at 5.46%. That means the revised mix still lagged the benchmark, but it did close the gap slightly.

The drawdown result is more important here. Maximum drawdown improved from -3.34% to -2.80%, which is a material reduction in downside for such a short window. Average excess return also improved from -0.07% to -0.05%, which again does not beat the benchmark, but it does move the portfolio in the right direction.`}
            />

            <Text
                content={`That means the rebalance can still be useful even if it does not dominate on every single metric.

For example, a portfolio that gives up a small amount of upside but materially improves drawdown behaviour may still be more aligned with the mandate than a higher return but more unstable alternative.`}
            />

            <Text
                lead="7.1 Old vs New vs Benchmark"
                content={`The most useful visual check is still the direct comparison chart. This puts the original portfolio, the revised portfolio, and the benchmark into one frame, which makes it much easier to see whether the change actually improved the shape of the result rather than only the final number.`}
            />

            <ImageBlock
                src={rebalancedPortfolioEvaluationComparison}
                alt={"Evaluation comparison chart showing original portfolio, rebalanced portfolio, and benchmark"}
            />

            <Text
                content={`The revised portfolio finishes  above the original portfolio (barely, but a win is a win), and it does so with a cleaner path through the evaluation window.`}
            />

            <Text
                lead="7.2 Key Evaluation Figures"
                content={`The comparison table gives us the cleanest summary of what improved:`}
                code={`Metric                    Original    Rebalanced   Change
---------------------------------------------------------------
Final Value (%)             5.01         5.16       +0.15
Benchmark Value (%)         5.46         5.46        0.00
Maximum Drawdown (%)       -3.34        -2.80       +0.54
Average Excess Return (%)  -0.07        -0.05       +0.02`}
            />

            <Text
                content={`Those figures matter because they capture both sides of the mandate. Return improved by 0.15 percentage points, and the portfolio also gave up less on the downside. In other words, the revised mix did not simply take more risk to scrape out a little more upside. It improved on both dimensions that were most clearly under pressure in the inherited version.`}
            />

            <Text
                content={`Against the benchmark, the revised portfolio still fell short, which is worth stating plainly. But it did so with a smaller excess return deficit, moving from -0.07% to -0.05%, and with a noticeably shallower maximum drawdown than the original portfolio. For a mandate that asked for steady growth without letting drawdowns drift too far, that is a meaningful improvement even without benchmark outperformance.`}
            />

            <Text
                content={`So the key performance improvements from the rebalance are:`}
                bullets={[
                    "final portfolio value improved from 5.01% to 5.16%",
                    "maximum drawdown improved from -3.34% to -2.80%",
                    "average excess return improved from -0.07% to -0.05%",
                    "the revised portfolio still lagged the benchmark, but the gap narrowed slightly",
                ]}
            />

            <Text
                content={`At the same time, the evaluation period is where bad ideas are exposed.

If the revised portfolio does not improve return, does not improve benchmark relative behaviour, and does not improve drawdown, then the rebalance thesis was probably weak and should be reconsidered.`}
            />

            <Text
                content={`

The tool is no longer only producing charts and tables, because it is now supporting a full loop: analysis, interpretation, decision, and evaluation.`}
            />

            <Text
                content={`One final note: this scenario is still a curated teaching example.

The weights and time windows were very carefully chosen to produce a readable portfolio monitoring story and a clear rebalance test. In real work, you would test the same idea across multiple windows rather than trusting a single favourable example. Don't expect to look at a few charts and start beating the market, just keep this tool as part of your constant gradual improvement.`}
            />

            <Text
                heading="8. Finishing the Series"
                content={`By this point, the series has built something much more useful than a set of disconnected code snippets.

You can now take return data, organise it into a consistent analysis workflow, compare holdings to a benchmark, view a portfolio as a weighted combination of those holdings, identify where the weak points are, and then test whether a rebalance idea actually improved the result over a later period.`}
            />

            <Text
                content={`That matters because this is the real job the tool now supports. It is not just a calculator, and it is not just a chart generator. It gives you a structured way to move from raw data to an investment view, and then from that view to a decision that can actually be tested.`}
            />

            <Text
                content={`If you want to keep pushing the project further, some good next challenges are:`}
                bullets={[
                    "Try adding a new security to the imaginary portfolio and see whether it reduces drawdown without hurting return too much",
                    "Set yourself a different mandate, such as improving benchmark relative return while keeping drawdown roughly unchanged, and see whether you can find a different rebalance that fits it",
                    "Test the same rebalance idea across several different windows and compare how stable the result really is",
                    "Add one or two extra metrics, such as tracking error or downside deviation, and decide whether they change the way you interpret the portfolio",
                ]}
            />

            <Text
                content={`That is a substantial step up from portfolio monitoring alone, and it is enough to form the basis of your own small portfolio research workflow.`}
            />

            <Text
                content={
                    <>
                        Thanks for following the series through to the end. If you have questions, want to show me what you built, or just want to get in touch, you can find me on{" "}
                        <Link href="https://www.linkedin.com/in/asher-mckee-9b0182392/">
                            LinkedIn
                        </Link>.
                    </>
                }
            />
        </Body>
    )
}
