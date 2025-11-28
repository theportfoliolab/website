import Body from "@/components/content/body.tsx"
import Section from "@/components/content/section.tsx"
import type { PostMeta } from "@/components/content/types.tsx"

import average_bh from "@/content/articles/a1_goldencrossovers/average_bh.png"
import all_results from "@/content/articles/a1_goldencrossovers/all_results.png"
import crossover_parameters from "@/content/articles/a1_goldencrossovers/crossover_parameters.png"
import Imageblock from "@/components/content/imageblock.tsx"


export const meta: PostMeta = {
    title: "Can the Golden Cross Beat Passive Investment?",
    description:
        "A comparison of the Golden Cross technical trading strategy against simple Buy & Hold over a 10-year horizon.",
    date: "2025-02-10",
    tags: ["algorithms", "python", "portfolio management", "technical analysis"],
    type: "article",
    slug: "a1_goldencrossovers"
}

export default function Article() {
    return (
        <Body>
            <Section title="Can the Golden Cross Beat Passive Investment?">
                <p>
                    Proponents of technical analysis of security pricing would have you believe that through superior trading methods, abnormal returns can be achieved. Those who oppose technical analysis would tell you cannot consistently beat market indexes, and attempting to do so is a waste of resources.
                </p>
                <p>
                    So, in the age old battle between active and passive investment, can technical analysis outperform the simple buy and hold? Let’s see how the “golden cross” performs compared to a simple buy and hold strategy for the same investment horizon to see who comes out on top.
                </p>
                <p>
                    Investopedia defines the golden cross as “a pattern that occurs on a chart when a short term moving average crosses over a longer-term moving average to the upside.” They quote 50 days and 200 days in their example, and I’m sure different analysts will have different time period combinations which they believe produce the best results.
                </p>
                <p>
                    I came across a post by user @sjosephburns on Instagram, where @sjosephburns outlines a series of moving average time period combinations which he suggests the reader test. His page is full of magic secrets showing how you too can be a successful trader if you just buy his product and follow his guides! My opinion is that these trading gurus prey on naive and overly optimistic general public, promising endless wealth through cheap tricks. But, I can’t refute their claims until I test them. So, I will explore these parameters specifically, to see if they hold any water.
                </p>
            </Section>

            <Section title="The Setup">
                <p>
                    I selected three securities of different classes for a broader view on the topic: BHP Group Ltd (BHP), Apple Inc. (AAPL), and Bitcoin (BITCOINUSD). I used Iress to get the daily price data for the last 10 years, then began writing a python script to perform the tests.
                </p>
                <p>
                    I used rolling windows with a length of 1 year (around 252 trading days) and moved forward in steps of 20 trading days. This way the effects of any weekly, monthly, or annual price phenomena can be diminished.
                </p>
                <p>
                    For each window I measured the return and the standard deviation. I will note here that typically, traders of the golden cross wouldn’t advise sticking to a fixed investment horizon, and don’t normally consider volatility in their strategies. However, I think these attributes are a useful and simple way of comparing the performance of the strategies.
                </p>
                <p>
                    I set up the golden cross strategy using the parameters from @sjosephburns as above, and also the 50/200 mentioned by Investopedia.
                </p>
            </Section>

            <Section title="The Results">
                <p>
                    First, let’s see if the different golden crossover parameters produce different results:
                </p>
                <Imageblock
                    src={crossover_parameters}
                    alt="Returns of various golden cross parameters"
                    className="my-6 max-w-3xl mx-auto"
                />
                <p>
                    Although the results from each stock appear to form individual clusters, it appears that different parameters had less effect on returns & volatility for BHP and CBA compared to AAPL .There could be a thousand reasons why, but I think the takeaway from this is that the golden crossover strategy does at least produce some results, and in this case does usually a positive return (Ignoring trading fees).
                </p>
                <p>
                    Now, let’s look at the Buy and Holds:
                </p>
                <Imageblock
                    src={average_bh}
                    alt="Returns of various buy and hold portfolios"
                    className="my-6 max-w-3xl mx-auto"
                />
                <p>
                    Here we see a much wider range of returns and volatilities (although there are more data points in total). Although it seems a little messy, I think what this chart shows is that your returns can differ greatly for the same investment horizon depending on when you happen to buy.
                </p>
                <p>
                    This could suggest higher overall volatility for the buy and hold strategy, so lets next compare the two strategies to confirm:
                </p>
                <Imageblock
                    src={all_results}
                    alt="Returns of buy and bold vs golden cross portfolios"
                    className="my-6 max-w-3xl mx-auto"
                />
                <p>
                    Here, we can make a better comparison between the two strategies. For all stocks, the Buy and Hold produced higher average return, but also at a higher volatility than the golden crossover. And it’s by no small margin – around 5-10% greater returns from the average Buy and Hold.
                </p>
            </Section>

            <Section title="The Takeaway">
                <p>
                    The analysis shows that over the past 10 years, the Golden Cross strategy produced positive returns across all tested stocks, but consistently underperformed a simple Buy and Hold approach in terms of average return. Buy and Hold generated higher returns, albeit with higher volatility, while Golden Cross offered a slightly more conservative risk return profile. This suggests that, at least for the stocks and param
                </p>
                <p>
                    This suggests that, at least for the stocks and parameters tested, technical analysis via Golden Cross does not consistently outperform passive investing, aligning with the view of skeptics who argue that beating the market is an unattainable goal.
                </p>
                <p>
                    Perhaps the lower volatility of the golden crossover strategy could lend better to shorter investment horizons, where there is less time for returns to average out. Further investigation is required....
                </p>
            </Section>

            <Section title="My Thoughts">
                <p>
                    Personally, I struggle to see the point of a lower volatility strategy in long term investment, since the buy and hold outperformed without requiring any extra effort or cost. To me, it feels like wasted effort to pursue the Golden Crossover for lower returns, when simple passive index investment seems to do the job more effectively.
                </p>
                <p>
                    That said, I don’t want to overstate my perspective. Markets are complex, and different strategies may suit different investors’ goals. Rules can always be bent, and some exotic approaches have their place. But I remain unconvinced that the Golden Crossover is one of them.
                </p>
                <p>
                    As for the trading gurus, the situation is simple. These people wouldn’t need to sell books, online courses, exclusive forums, or private consultation sessions, if their strategies were as profitable as they claim. Automated online trading is not the money printer they would have you believe. Accumulation of wealth takes time, and there’s no shortcuts.
                </p>
            </Section>
        </Body>
    )
}
