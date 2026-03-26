// src/content/articles/a1_goldencrossovers.tsx
import { Text } from "@/components/content/text"
import ImageBlock from "@/components/content/imageblock"
import type { PostMeta } from "@/components/content/types"

import average_bh from "@/content/articles/a1_goldencrossovers/average_bh.png"
import all_results from "@/content/articles/a1_goldencrossovers/all_results.png"
import crossover_parameters from "@/content/articles/a1_goldencrossovers/crossover_parameters.png"
import out_of_sample from "@/content/articles/a1_goldencrossovers/out_of_sample.png"

export const meta: PostMeta = {
    title: "Can the Golden Cross Strategy Beat Buy and Hold?",
    description:
        "A 10-year comparison of the Golden Cross trading strategy versus buy and hold across BHP, Apple, and Bitcoin.",
    date: "2025-02-10",
    tags: ["algorithms", "python", "portfolio management", "technical analysis"],
    type: "article",
    slug: "golden-cross-vs-buy-and-hold",
    nextInSeriesSlug: "python-csv-and-pandas-dataframes",
}

export default function Article() {
    return (
        <>
            <Text
                lead="The golden cross is one of the most popular trading signals. It looks convincing—but when you test it properly, the results are far less impressive."
                content="In this article, I compare a range of golden crossover strategies to a simple buy and hold approach across multiple assets. More importantly, I test whether the ‘best’ parameters actually hold up when applied to new data."
            />
            <Text
                heading="TL;DR"
                bullets={[
                    "Golden cross signals are lagging indicators",
                    "They generally underperform buy and hold over long horizons",
                    "Optimising parameters can make results look better than they really are",
                    "The ‘best’ parameters often fail when tested on new data (overfitting)",
                ]}
            />
            <Text
                lead="Proponents of technical analysis of security pricing would have you believe that through superior trading methods, abnormal returns can be achieved. Investopedia defines the golden cross as:"
                quote="“a pattern that occurs on a chart when a short term moving average crosses over a longer-term moving average to the upside.”"
                content="They quote 50 days and 200 days in their example, and I’m sure different analysts will have different time period combinations which they believe produce the best results."
            />

            <Text
                heading="So, in the age old battle between active and passive investment, can technical analysis outperform the simple buy and hold?"
                lead="Let’s see how the “golden cross” performs compared to a simple buy and hold strategy for the same investment horizon to see who comes out on top."
                content="I came across a post by user @sjosephburns on Instagram, where @sjosephburns outlines a series of moving average time period combinations which he suggests the reader test. His page is full of magic secrets showing how you too can be a successful trader if you just buy his product and follow his guides! My opinion is that these trading gurus prey on naive and overly optimistic general public, promising endless wealth through cheap tricks. But, I can’t refute their claims until I test them. So, I will explore these parameters specifically, to see if they hold any water."
            />

            <Text
                heading="Steps Taken"
                bullets={[
                    "I selected three securities of different classes for a broader view on the topic: BHP Group Ltd (BHP), Apple Inc. (AAPL), and Bitcoin (BITCOINUSD).",
                    "I used Iress to get the daily price data for the last 10 years, then began writing a python script to perform the tests.",
                    "I used rolling windows with a length of 1 year (around 252 trading days) and moved forward in steps of 20 trading days. This way the effects of any weekly, monthly, or annual price phenomena can be diminished.",
                    "For each window I measured the return and the standard deviation. Typically, traders of the golden cross wouldn’t advise sticking to a fixed investment horizon, and don’t normally consider volatility in their strategies. However, I think these attributes are a useful and simple way of comparing the performance of the strategies.",
                    "I set up the golden cross strategy using the parameters from @sjosephburns as above, and also the 50/200 mentioned by Investopedia.",
                ]}
            />

            <Text
                heading="The Results"
                lead="First, let’s see if the different golden crossover parameters produce different results..."
            />

            <ImageBlock
                src={crossover_parameters}
                alt="Returns of various golden cross parameters"
                className="w-full"
            />

            <Text
                lead="Although the results from each stock appear to form individual clusters, it appears that different parameters had less effect on returns & volatility for BHP and CBA compared to AAPL."
                content="There could be a thousand reasons why, but I think the takeaway from this is that the golden crossover strategy does at least produce some results, and in this case does usually a positive return (Ignoring trading fees)."
            />

            <Text heading="Now, let’s look at the Buy and Holds..." />

            <ImageBlock
                src={average_bh}
                alt="Returns of various buy and hold portfolios"
                className="w-full"
            />

            <Text
                lead="Here we see a much wider range of returns and volatilities (although there are more data points in total)."
                content=" Although it seems a little messy, I think what this chart shows is that your returns can differ greatly for the same investment horizon depending on when you happen to buy. This could suggest higher overall volatility for the buy and hold strategy. "
            />

            <Text heading="Let's next compare the two strategies to confirm..." />

            <ImageBlock
                src={all_results}
                alt="Returns of buy and bold vs golden cross portfolios"
                className="w-full"
            />

            <Text
                content="Here, we can make a better comparison between the two strategies. For all stocks, the Buy and Hold produced higher average return, but also at a higher volatility than the golden crossover. And it’s by no small margin—around 5-10% greater returns from the average Buy and Hold."
            />

            <Text
                heading="Can we optimise the Golden Cross?"
                lead="At this point, you might argue that the issue isn’t the strategy itself, but the parameters. Perhaps there is a ‘best’ combination of moving averages that performs well."
                content="To test this, I selected the parameter set that produced the highest return for each asset over the historical sample, then applied those same parameters to a different portion of the data."
            />

            <ImageBlock
                src={out_of_sample}
                alt="Out of sample performance of optimised golden cross parameters"
                className="w-full"
            />

            <Text
                content="If the strategy is genuinely robust, we would expect similar performance when applied to new data. However, the results change significantly. The parameter combinations that appeared optimal in one sample often fail to replicate their performance out of sample."
            />

            <Text
                lead="This is a classic example of overfitting."
                content="By selecting parameters that perform best on historical data, we are not discovering a reliable strategy, we are simply finding patterns that happened to work in that specific sample. When applied to new data, those patterns often disappear."
            />

            <Text
                content="In other words, we’re not finding a strategy: we’re optimising our losses."
            />

            <Text
                heading="The Takeaway"
                lead="The analysis shows that over the past 10 years, the Golden Cross strategy produced positive returns across all tested stocks, but consistently underperformed a simple Buy and Hold approach in terms of average return. Buy and Hold generated higher returns, albeit with higher volatility, while Golden Cross offered a slightly more conservative risk return profile."
                content="This suggests that, at least for the stocks and parameters tested, technical analysis via Golden Cross does not consistently outperform passive investing, aligning with the view of skeptics who argue that beating the market is an unattainable goal. Perhaps the lower volatility of the golden crossover strategy could lend better to shorter investment horizons, where there is less time for returns to average out. Further investigation is required.... Personally, I struggle to see the point of a lower volatility strategy in long term investment, since the buy and hold outperformed without requiring any extra effort or cost. To me, it feels like wasted effort to pursue the Golden Crossover for lower returns, when simple passive index investment seems to do the job more effectively. That said, I don’t want to overstate my perspective."
            />

            <Text
                lead="Markets are complex, and different strategies may suit different investors’ goals. Rules can always be bent, and some exotic approaches have their place. But I remain unconvinced that the Golden Crossover is one of them. As for the trading gurus, the situation is simple. These people wouldn’t need to sell books, online courses, exclusive forums, or private consultation sessions, if their strategies were as profitable as they claim. Automated online trading is not the money printer they would have you believe. Accumulation of wealth takes time, and there’s no shortcuts."
            />
        </>
    )
}
