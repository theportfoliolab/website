import Body from "@/components/content/body"
import ImageBlock from "@/components/content/imageblock"
import { Text } from "@/components/content/text"
import type { PostMeta } from "@/components/content/types"

import signal_frequency from "@/content/articles/a101_200wma_mythbusters/outputs/signal_frequency.png"
import wma200_vs_spy from "@/content/articles/a101_200wma_mythbusters/outputs/200wma_vs_spy.png"
import capital_deployment from "@/content/articles/a101_200wma_mythbusters/outputs/capital_deployment.png"
import brkb_vs_strategy from "@/content/articles/a101_200wma_mythbusters/outputs/brkb_vs_strategy.png"
import Link from "@/components/content/link.tsx";


export const meta: PostMeta = {
    title: "InvestmythBusters 1: Charlie Munger and the 200 Week Moving Average",
    description:
        "Does Munger's infamous strategy hold up?",
    date: "2026-09-18",
    tags: ["finance", "python", "backtesting", "analysis"],
    type: "article",
    slug: "mythbusters-1-200wma",
}


export default function Article() {
    return (
        <Body>
            <Text
                lead="There is a quote attributed to Charlie Munger which has been circulating around investment circles for a while:"
                quote="If all you ever did was buy high-quality stocks on the 200-week moving average, you would beat the S&P 500 by a large margin over time."
            />

            <Text
                content="If the idea works as described, we should be able to construct a reasonable interpretation of it and see some evidence of that advantage in historical data."
            />

            <Text
                content="The quote appears widely online, although tracing investment quotes back to their source can be surprisingly messy. Munger Monitor describes it as a “widely cited” Charlie Munger idea and builds an entire investment framework around it, while making clear that the site itself is independent from Munger and Berkshire Hathaway. There is at least a more concrete origin available than simple internet repetition. AJ Bell attributes the comment to a private conversation between Munger and former Lehman Brothers trader Lawrence McDonald, which McDonald later recounted in his 2024 book How to Listen When Markets Speak."
            />

            <Text
                content="The version I am testing comes from Munger Monitor, which turns the quote into a more complete process:"
                quote="Build a watchlist of liquid, high-quality companies
                Look for prices near the 200-week moving average
                Review the fundamentals when a signal appears
                Then enter in stages with predefined risk limits."
            />

            <Text
                title="The Myth"
                lead="Seems relatively simple right? Just follow the steps!"
                content="Unfortunately, almost every important part of the strategy introduces another judgement call. What is a high-quality company? How liquid does it need to be? How close does the price need to be to the moving average? What fundamentals should be reviewed, and what result should actually cause us to buy?"
            />

            <Text
                content="I could spend the entire article trying to reconstruct exactly what Charlie Munger might have meant by each of these terms, but that would defeat the point of the experiment. Instead, I am going to approach this in the spirit of MythBusters: choose a reasonable interpretation, define it clearly enough that somebody else could reproduce it, then see whether the claimed effect actually appears."
            />

            <Text
                heading="Building the Test"
                lead="The Watchlist:"
                content="For this experiment I used a fixed universe of 36 large, established and widely recognised companies. This is not intended as a universal definition of quality, but it gives us a reasonable approximation of the kind of businesses the original idea appears to be describing."
                bullets={[
                    "MSFT, AAPL, GOOGL, AMZN, NVDA, META",
                    "BRK-B, UNH, LLY, JPM, V, MA",
                    "PG, COST, HD, AVGO, ADBE, PEP",
                    "KO, XOM, JNJ, MRK, ABBV, MCD",
                    "NKE, WMT, TGT, RTX, CAT, DE",
                    "NEE, DUK, ORCL, CRM, CSCO, INTC",
                ]}
            />

            <Text
                content="Using companies of this scale also lets me treat liquidity pragmatically. This is a retail sized experiment using relatively small purchases, so the important requirement is simply that the securities trade frequently and with enough depth that our own orders are not meaningfully changing the price."
            />

            <Text
                lead="The Signal"
                content="Rather than introducing another arbitrary parameter for what counts as being 'near' the moving average, I used a simple confirmation rule: a signal occurs when the weekly price crosses above its 200-week moving average."
            />

            <Text
                content="This is not the only possible interpretation, but it has one major advantage for testing: the event is objective. The stock either crossed the line or it did not, which means I cannot move the threshold around afterwards to improve the result."
            />

            <Text
                content="However in practice that's exactly what you should do: Perform historical analysis to determine what threshold parameter appears to work best for your situation. In this test, fixing the threshold just removes an independent variable from the equiation."
            />

            <Text
                lead="Fundamental Review"
                content="The strategy prescribes reviewing the fundamentals of a company as part of the purchase decision critera."
            />

            <Text
                content="To do this properly I would need to define exactly which fundamentals were reviewed, what information was available at the time, which thresholds were considered acceptable, and how conflicting signals were resolved."
            />

            <Text
                content="Without those rules being defined in advance, 'review fundamentals' gives me far too much freedom to explain why I would have bought historical winners and avoided historical losers. Instead, the fixed quality-stock universe acts as the fundamental filter, while the moving average determines when purchases can occur."
            />

            <Text
                lead="Entering in Stages"
                content="I interpret this ascept of the strategy as an operational improvement for institutional investors: When the purchasing decision is made, there's no need to rush in and pay massive liquidity costs. Instead, act on the signal in a methodical way to accumulate the stock without pressuring the market."
            />

            <Text

                content="As my test is based around a retail investors finances, I desgined a small scenario. The investor adds $100 per week to their available cash. Then, when a confirmed signal occurs, the strategy deploys 40% of the cash currently available. This gives us a simple interpretation of entering in stages: capital accumulates over time and is progressively deployed as opportunities appear rather than being committed to the first signal immediately."
            />

            <ImageBlock
                src={capital_deployment}
                alt="Available cash and deployed capital for the investment period"
                className="w-full"
            />

            <Text
                lead="Why 40%?"
                content="Before looking at final returns, I first measured how frequently these signals actually occur:"
            />


            <ImageBlock
                src={signal_frequency}
                alt="Distribution of confirmed 200-week moving-average signals by month"
                className="w-full"
            />

            <Text
                bullets={[
                    "Average signals per month: 1.38",
                    "Median signals per month: 1",
                    "Maximum signals in one month: 9",
                    "Months with no signals: 49 out of 141",
                    "Zero-signal rate: 34.8%",
                ]}
            />

            <Text
                content="Most months produce zero, one or two signals, but occasionally several arrive together. This is exactly why I do not want the first available stock consuming all accumulated cash: 40% allocation was selected as a balance between meaningful purchase quanities and capital preservation, so that opportunity cost of a purchase can be reduced."
            />

            <Text
                heading="Running the Experiment"
                lead="With the rules fixed, the actual backtest is relatively simple."
                content="The experiment examines price data from 2015 to the present, with additional historical data loaded beforehand so that every company has enough weekly observations to establish its 200-week moving average. The strategy receives $100 each month, waits for qualifying signals, and buys according to the staged allocation rule."
            />

            <Text
                content="I benchmarked the strategy against SPY, and made cost matched pruchases at the same time as signalled purchases by the strategy: This way, the effects of purchase timing are reduced for a more relevant comparison. This choice specifically aims to find a performance difference between selecting quality stocks and simply targeting a broad market."
            />


            <Text
                content="Transaction costs and slippage are set to zero. That is favourable to the strategy, although with small retail-sized purchases in securities of this size and liquidity, I would not expect them to explain a large difference in the final result."
            />

            <Text
                heading="The Results"
                lead="There might be some truth here."
                bullets={[
                    "Total contributed: $14,100.00",
                    "Strategy value: $41,606.92",
                    "SPY benchmark value: $36,290.66",
                    "Difference: +$5,316.26",
                    "Relative result: +14.65%",
                ]}
            />

            <ImageBlock
                src={wma200_vs_spy}
                alt="200-week moving-average strategy compared with matched SPY purchases"
                className="w-full"
            />

            <Text
                content="After contributing $14,100, the 200-week moving-average strategy finished at $41,606.92, compared with $36,290.66 for the SPY benchmark. That leaves the strategy ahead by $5,316.26, or 14.65% relative to the benchmark."
            />

            <Text
                lead="This result can't be ignored:"
                content="I did not need to search across hundreds of moving-average periods or continually rebuild the strategy until something profitable appeared. Even my simple interpretation of the strategy resulted in benchmark-beating results. The mechanism remained recognisable as the original idea: accumulate established companies when their prices return to a very long-term reference level."
            />

            <Text
                heading="So, what's the verdict?"
                lead="Should I drop everything and start tracking the 200WMA?"
                content="Not quite. Before calling this Confirmed, Plausible or Busted, we need to be clear about what I actually tested. This experiment did not reproduce Charlie Munger's exact investment process, because we do not have a sufficiently precise description of that process. I tested one operational interpretation of the idea."
            />

            <Text
                heading="What This Test Didn't Capture"
                lead="The original strategy contains several judgement calls which I had to simplify or remove entirely."
                content="That does not make the experiment useless, but it changes what the result is capable of proving."
            />

            <Text
                heading="Liquidity"
                lead="It sounds like a simple screening requirement until we try to define it."
            />

            <Text
                content={
                    <>
                        From{" "}
                        <Link href="https://www.imf.org/en/publications/wp/issues/2016/12/30/measuring-liquidity-in-financial-markets-16211">
                            Measuring Liquidity in Financial Markets
                        </Link>{" "}
                        (Lybek & Sarr, 2002):
                    </>
                }
                quote="A number of measures must be considered because there is no single theoretically correct and universally accepted measure to determine a market's degree of liquidity and because market-specific factors and peculiarities must be considered."
            />

            <Text
                content="For this experiment I avoided most of that problem by using large listed companies and small purchases. Depending on what we are trying to protect against, however, liquidity might mean trading volume, bid-ask spread, market depth, immediacy, price impact or resiliency."
            />

            <Text
                content="That is my interpretation of the requirement, not something contained in the original claim. A much larger investor faces a completely different problem. The liquidity needed to invest $100 is not the same as the liquidity needed to deploy $100 million, which means 'liquid enough' cannot really be defined without knowing who is using the strategy and how much capital they are trying to move."
            />

            <Text
                heading="Quality"
                lead="'High quality' is even harder to pin down."
                content="Does quality mean high return on equity, strong margins, low leverage, stable earnings, durable competitive advantage, capable management, or simply a company which has survived long enough to become familiar?"
            />

            <Text
                content="My own watchlist contains companies which are recognisable as major businesses today, and that introduces hindsight risk. We already know which companies survived and became successful. A stronger test would define quality mechanically using only information available at each point in history, allowing companies to enter and leave the investable universe over time."
            />

            <Text
                heading="Fundamental Analysis"
                lead="'Review fundamentals' creates the largest ambiguity of all."
                content="It describes an activity, but it does not describe a decision rule. Which numbers should I inspect? What counts as good? What happens when one metric looks attractive and another looks terrible? Most importantly, what exact result tells me to buy?"
            />

            <Text
                content="If those conditions are not defined beforehand, historical fundamental analysis gives us enormous room to rationalise known outcomes. We can look at a company which later succeeded and find reasons why we would have bought it, while finding entirely different reasons to reject a company which later failed."
            />

            <Text
                lead="When making a decision today, we do not have that luxury."
                content="The rule has to exist before we know what happens next."
            />

            <Text
                heading="The Moving Target Problem"
                lead="Every undefined condition creates another way for the strategy to escape a failed test."
                content="If my backtest loses money, perhaps I chose the wrong definition of quality. If I change the stock universe and it still loses money, perhaps my proximity threshold was wrong. If I change that, perhaps I should have reviewed fundamentals differently, entered in smaller stages, or used different risk limits."
            />

            <Text
                content="At some point I stop testing the original idea and start engineering a profitable strategy around it. There is nothing wrong with strategy engineering, but it answers a different question."
            />

            <Text
                heading="A Useful Reality Check"
                lead="This is where Berkshire Hathaway becomes an interesting comparison."
                content="BRK.B is not a direct benchmark for this strategy. Berkshire Hathaway is a conglomerate with operating businesses, insurance operations, acquisitions and a much broader capital allocation process, so its share price does not represent a pure stock-picking strategy."
            />

            <Text
                content="Even so, I compared the same contribution schedule against BRK.B and found that the two wealth paths tracked surprisingly closely for much of the experiment."
            />

            <ImageBlock
                src={brkb_vs_strategy}
                alt="200-week moving-average strategy compared with BRK.B over the same time period"
                className="w-full"
            />

            <Text
                content="I would not claim that this means the strategy recreates Berkshire Hathaway's investment process. Similar outcomes do not imply similar causes. But it does suggest that this simplified strategy may act as a moderately useful proxy for some of the investment characteristics reflected in Berkshire Hathaway's performance over this period."
            />

            <Text
                lead="That makes the omissions above more interesting, not less."
                content="The undefined liquidity, quality and fundamental-analysis rules may still matter considerably, but this test suggests that the basic 200-week moving-average idea can produce a broadly similar pattern of capital growth without explicitly reproducing them."
            />

            <Text
                heading="Verdict: Plausible"
                lead="Definitely not Busted."
                content="A fairly straightforward interpretation of the idea produced the kind of result the myth says should be possible. It beat the matched SPY benchmark, deployed almost all contributed capital, and did so without requiring extensive parameter optimisation or a discretionary fundamental-analysis process."
            />

            <Text
                content="I still do not think it can be called Confirmed. There are too many undefined parts of the original method, the quality universe contains hindsight risk, the experiment covers one realised market history, and one of the most important stated components, fundamental analysis, had to be excluded because I could not reproduce it objectively."
            />

            <Text
                lead="There appears to be something worth investigating in the underlying idea."
                content="Waiting for significant long-term price weakness before accumulating companies you already have reason to want to own is not an absurd process, and this particular implementation produced a genuinely strong result against the benchmark."
            />

            <Text
                content="But 'Plausible' is doing important work here. This experiment supports the proposition that a reasonable interpretation of the 200-week moving-average idea can outperform a broad-market benchmark over this period. It does not establish that buying any vaguely defined high-quality stock around any vaguely defined proximity to a 200-week moving average will reliably beat the S&P 500."
            />

        </Body>
    )
}