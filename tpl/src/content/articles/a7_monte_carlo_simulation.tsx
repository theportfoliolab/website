import Body from "@/components/content/body"
import ImageBlock from "@/components/content/imageblock"
import { Text } from "@/components/content/text"
import type { PostMeta } from "@/components/content/types"

import coin_toss_convergence from "@/content/articles/a7_monte_carlo/outputs/01_coin_toss_convergence.png"
import simulated_investment_paths from "@/content/articles/a7_monte_carlo/outputs/02_simulated_investment_paths.png"
import loss_probability_by_horizon from "@/content/articles/a7_monte_carlo/outputs/03_loss_probability_by_horizon.png"
import withdrawal_paths_balanced from "@/content/articles/a7_monte_carlo/outputs/05_withdrawal_paths_balanced.png"
import adaptive_withdrawal_paths from "@/content/articles/a7_monte_carlo/outputs/06_adaptive_withdrawal_paths.png"

export const meta: PostMeta = {
    title: "Monte Carlo Simulation in Finance",
    description:
        "A practical introduction to Monte Carlo simulation, from coin tosses to investment paths and retirement planning decisions.",
    date: "2026-07-13",
    tags: ["finance", "python", "modelling", "analysis"],
    type: "article",
    slug: "monte-carlo-simulation-in-finance",
}

export default function Article() {
    return (
        <Body>
            <Text
                lead="Monte Carlo simulation has built something of a reputation in recent years."
                content="People often picture quantitative hedge funds, Wall Street trading desks, or investment firms employing teams of mathematicians and programmers to model markets using sophisticated algorithms. It has become one of those techniques that carries an air of mystery, partly because it is so frequently associated with high end quantitative finance and the rise of data-driven investing."
            />

            <Text
                content="Yet, the central idea behind Monte Carlo simulation is remarkably simple. Monte Carlo simulation is nothing more than repeating the same experiment thousands of times using randomly generated inputs. Rather than producing a single prediction, it allows us to explore the range of outcomes that could plausibly occur."
            />

            <Text
                lead="That simple idea has made Monte Carlo one of the most widely used modelling techniques in finance."
                content="Investment managers, actuaries, financial planners and risk analysts all use it to explore the same fundamental question:"
                quote="What could happen, and how likely is each outcome?"
            />

            <Text
                content="Despite its sophisticated reputation, you do not need advanced mathematics to understand the intuition behind it. In fact, one of the easiest ways to understand Monte Carlo simulation does not involve financial markets at all. It starts with something much simpler: a coin toss."
            />

            <Text
                heading="Something Familiar to Get Started"
                lead="Imagine repeatedly tossing a fair coin."
                content="We know that each toss has a 50% chance of landing heads. But if we toss it only twice, the results can be dominated by randomness."
                bullets={[
                    "100% heads",
                    "50% heads",
                    "0% heads",
                ]}
            />

            <Text
                content="As we continue tossing the coin, however, something interesting happens. The running average gradually settles closer and closer to the true probability of 50%."
            />

            <ImageBlock
                src={coin_toss_convergence}
                alt="Coin toss results converging towards 50%"
                className="w-full"
            />

            <Text
                content="This idea lies at the heart of Monte Carlo simulation. Rather than trying to predict a single outcome, we repeatedly sample from possibilities that we already understand. Individual trials remain unpredictable, but after thousands of simulations, useful patterns begin to emerge. Instead of simulating coin tosses, we can simulate investment returns."
            />

            <Text
                heading="From Coin Tosses to Investments"
                lead="Suppose we invest $10,000 into a growth portfolio."
                content="For this example, we will assume an expected annual return of 8% and annual volatility of 16%."
            />

            <Text
                content="If we were only interested in the average outcome, we would not need a simulation at all. We could simply calculate that an investment earning exactly 8% over one year would be expected to grow to approximately $10,800. Likewise, volatility gives us an indication of how much returns typically vary around that average."
            />

            <Text
                lead="So why would we go to the effort of running thousands of random simulations?"
                content="The answer is that markets do not deliver smooth, predictable returns. Investors do not experience one neat annual return each year. They experience a sequence of good months, bad months, recoveries and setbacks. Those journeys matter."
            />

            <Text
                content="Rather than asking what the expected outcome is, Monte Carlo allows us to ask a different question:"
                quote="What happens across thousands of possible futures?"
            />

            <Text
                heading="The Basic Simulation Process"
                lead="The underlying simulation is surprisingly straightforward."
                content="Rather than modelling the portfolio once per year, we will simulate it one month at a time."
                bullets={[
                    "Expected monthly return: 0.6434%",
                    "Expected monthly volatility: 4.6188%",
                ]}
            />

            <Text
                content="Each month, the simulation generates a random return consistent with these assumptions. That return is then applied to the portfolio, producing a new portfolio value. The process repeats month after month until we reach our chosen investment horizon. One simulation therefore produces one possible investment journey."
            />

            <Text
                content="Computers are extremely good at repetitive calculations, so once we have generated one path, we simply repeat the process thousands of times. Conceptually, the algorithm is little more than:"
                code={`Repeat 5,000 times
    Generate a random monthly return
    Update the portfolio value
    Repeat for every month

Store the completed portfolio path`}
            />


            <Text
                heading="Exploring Possible Futures"
                lead="Once we have generated thousands of possible investment paths, we can begin asking much more interesting questions."
            />

            <ImageBlock
                src={simulated_investment_paths}
                alt="Possible investment paths and final values from 5,000 simulations"
                className="w-full"
            />

            <Text
                content="The chart on the left shows twenty individual simulated investment paths over a ten-year period. Each path represents one possible future. Some portfolios enjoy several strong years immediately. Others suffer an early decline before recovering. Some steadily outperform throughout the decade, while others never quite catch up."
            />

            <Text
                lead="The histogram tells the same story from another perspective."
                content="Rather than following individual investment journeys, it summarises where all 5,000 simulations finished. Most outcomes cluster within a relatively narrow range, while a smaller number of exceptionally strong or weak results form the tails of the distribution."
            />

            <Text
                lead="This is already more useful."
                content="Even in this simple example, Monte Carlo is already providing more than a single expected return. It allows us to visualise the spread of possible outcomes and begin discussing uncertainty in quantitative terms."
            />

            <Text

                content="Rather than saying that we expect approximately 8% per year, we can begin talking about uncertainty. We can discuss not only what we expect to happen, but also how much variation exists around that expectation."
            />

            <Text
                content="The histogram is particularly useful because it summarises the entire simulation in a single view. Rather than focusing on one investment path, it reveals the overall shape of possible outcomes, allowing us to see how frequently different final portfolio values occurred."
            />

            <Text
                content="One interesting detail is that the peak of the distribution sits slightly below the deterministic value implied by compounding 8% every year. This is not an error in the simulation. It is a consequence of volatility. A small number of exceptionally strong outcomes pull the arithmetic average upwards, while the typical compounded investment path grows slightly more slowly."
            />

            <Text
                heading="How Investment Horizon Changes Risk"
                lead="So far we have simply observed how one investment might behave over a fixed ten-year period."
                content="Now imagine a client is considering investing in the same growth portfolio, but is not sure how long they should remain invested. They understand that longer investment horizons generally improve expected returns, but they are primarily concerned with preserving their capital."
            />

            <Text
                content="Their goal is simple:"
                quote="What investment horizon gives me the best chance of finishing with at least as much money as I started with?"
            />

            <Text
                content="Notice that the underlying simulation has not changed at all. We are still generating exactly the same random monthly returns as before. The only thing we have changed is the question we are asking of those simulations. By running the model across a range of investment horizons, we can calculate the probability of finishing below the starting value."
            />

            <ImageBlock
                src={loss_probability_by_horizon}
                alt="Chance of finishing below the starting value by investment horizon"
                className="w-full"
            />

            <Text
                content="The result is not particularly surprising, but it is useful. As the investment horizon increases, the probability of loss steadily declines. Rather than simply saying that longer is better, we can now quantify the trade-off between investment horizon and risk."
            />

            <Text
                content="A financial adviser could present this information to a client and discuss what level of risk they are comfortable accepting. The  Monte Carlo simulation has not produced a recommendation. Instead, it has transformed a general statement into evidence that can support a more informed decision."
            />

            <Text
                heading="So Why Use Monte Carlo?"
                lead="Up to this point, Monte Carlo has largely confirmed what we already expected."
                content="Using our assumptions of an 8% annual return and 16% annual volatility, the simulation showed that longer investment horizons reduce the probability of loss, while simultaneously increasing the range of possible outcomes. These are useful insights, but none of them are particularly surprising."
            />

            <Text
                content="Many of these results could be estimated using traditional financial mathematics without ever running a simulation. So why has Monte Carlo become one of the defining tools of modern financial modelling? The answer is that real financial planning problems are rarely this simple."
            />

            <Text
                content="Real investors do not simply buy a portfolio and leave it untouched for decades: They retire, draw an income, change their spending. They have objectives that extend beyond simply maximising returns. As soon as we begin modelling these real world decisions, the mathematics becomes significantly more complicated. This is where Monte Carlo begins to demonstrate its real value."
            />

            <Text
                heading="A Financial Planning Problem"
                lead="Imagine you are a financial adviser meeting with a new client."
                content="The client has recently retired with a $100,000 investment portfolio. After discussing their budget, you have determined that they would like to withdraw $8,000 per year to supplement their income."
            />

            <Text
                content="They also have one important objective. They do not want the portfolio to fall below $40,000 during the next fifteen years unless absolutely necessary. That reserve provides both financial security and flexibility if unexpected expenses arise later in retirement."
            />

            <Text
                content="At first glance, this sounds like a straightforward planning exercise. But there is one obvious complication: neither you nor your client knows what investment returns will look like over the next fifteen years. Instead of assuming one average outcome, we once again turn to Monte Carlo simulation."
            />

            <Text
                heading="Introducing Sequence Risk"
                lead="Timing of events is where Monte Carlo shines"
                content="Tasked with assisting in creating the financial plan, we still generate monthly investment returns using exactly the same assumptions as before. We still repeating the process thousands of times. The only difference is that the portfolio now makes regular monthly withdrawals."
            />

            <Text
                content="Something important immediately changes. Previously, only the final portfolio value really mattered. Now the order of investment returns becomes critically important."
            />

            <Text
                content="Imagine two portfolios that both achieve exactly the same average annual return: If one portfolio suffers poor returns during the first two years while withdrawals continue, those withdrawals are taken from a rapidly shrinking asset base. Even if markets recover later, much of the capital that would have benefited from that recovery has already been withdrawn."
            />

            <Text
                content="A second portfolio might experience those same poor returns ten years later, after many years of growth have already built a much larger reserve. Although both portfolios achieve the same average return, they can produce dramatically different retirement outcomes. This phenomenon is known as sequence risk, and it is one of the biggest challenges in retirement planning."
            />

            <Text
                heading="When the Journey Matters More Than the Destination"
                lead="We now simulate our client's retirement plan over the next fifteen years."
                content="After running 5,000 possible market scenarios, we group the simulations according to how the portfolio performed during its first two years."
            />

            <ImageBlock
                src={withdrawal_paths_balanced}
                alt="Early returns matter when withdrawals continue"
                className="w-full"
            />

            <Text
                content="The pattern is immediately obvious. Portfolios that experienced strong early returns generally remained comfortably above the client's reserve target. Those that experienced weak early returns often continued drifting towards it, even though every simulation shared exactly the same long term investment assumptions."
            />

            <Text
                content="Nothing about the portfolio changed, the only thing that changed was when those returns occurred."
            />

            <Text
                content="This is the first point in this article where Monte Carlo begins telling us something that is not immediately obvious from average returns alone. More importantly, it has highlighted something useful. Rather than treating all future market conditions equally, we have identified a specific class of scenarios that appears much more likely to threaten the client's objective."
            />

            <Text
                heading="Testing a Contingency Plan"
                lead="Suppose we review these results with our client."
                content="The simulation suggests that the greatest threat to the retirement plan is experiencing poor market performance during the first few years of retirement. Rather than changing the investment portfolio itself, we discuss a simple contingency plan."
            />

            <Text
                content="If the portfolio experiences a particularly weak start, the client agrees to temporarily reduce discretionary spending until the portfolio has an opportunity to recover. Can such a small change materially improve the likelihood of meeting their objective? Instead of relying on intuition, we can test it."
            />

            <Text
                lead="Using exactly the same weak start simulations identified in the previous analysis, we compare two retirement plans."
                bullets={[
                    "Plan A continues withdrawing the original monthly amount throughout the full fifteen years.",
                    "Plan B follows exactly the same withdrawal schedule for the first two years, but temporarily reduces withdrawals once the weak early performance has been identified.",
                ]}
            />

            <Text
                content="Everything else remains identical. The investment portfolio is unchanged. The simulated market returns are unchanged. The same market paths are used for both plans. Only the client's spending rule changes."
            />

            <ImageBlock
                src={adaptive_withdrawal_paths}
                alt="Testing a spending adjustment after a weak start"
                className="w-full"
            />

            <Text
                content="The result is immediately visible. Many of the adaptive paths stabilise above the reserve floor, while their static counterparts continue to decline. The accompanying histograms tell the same story from another perspective. Using exactly the same market conditions, the adaptive spending plan shifts the distribution of surviving portfolio values upwards and reduces the number of depleted portfolios."
            />

            <Text
                content="Monte Carlo has not told us which retirement plan is correct. Nor has it predicted what markets will do over the next fifteen years. Instead, it has allowed both adviser and client to test a realistic contingency plan before committing to it."
            />

            <Text
                heading="Final Thoughts"
                lead="Monte Carlo simulation is often introduced as a technique for generating thousands of random scenarios."
                content="While that is technically true, the examples in this article show that randomness is only one part of the story. The real value of Monte Carlo lies in using those simulated futures to support better decisions under uncertainty."
            />

            <Text
                content="For relatively simple investment problems, Monte Carlo often confirms what traditional financial mathematics already tells us. It provides a richer understanding of uncertainty, but not necessarily dramatically different answers. As more realistic constraints are introduced—withdrawals, reserve targets and changing client behaviour—the simulation becomes increasingly valuable because it allows those decisions to be explored before they are made."
            />

            <Text
                content="Our simulation never predicted what the market would do. Instead, it helped identify where a financial plan was vulnerable, and provided a practical way to compare alternative strategies under exactly the same market conditions. Monte Carlo did not replace judgement; it supported it."
            />

            <Text
                lead="Monte Carlo simulation does not predict the future."
                content="It provides a structured framework for exploring uncertainty, evaluating decisions and understanding the consequences of our assumptions before they become reality."
            />

            <Text
                heading="Where to Next?"
                lead="Throughout this article we've treated Monte Carlo simulation as a tool, not as a programming exercise."
                content="Understanding why Monte Carlo is useful is far more important than understanding how to write the code. Once the concepts are clear, however, building the simulation becomes surprisingly straightforward."
            />

            <Text
                content="In the next tutorial, we'll step behind the scenes and build the simulation engine used throughout this article. Rather than creating a one-off retirement model, we'll develop a modular Monte Carlo framework that can be adapted to a wide range of financial applications, from simple investment projections to retirement planning, asset allocation and other path-dependent problems."
            />

            <Text
                content="Along the way we'll look at how to structure the simulation, separate assumptions from implementation, and build reusable components that make it easy to extend the model without rewriting the entire program."
            />
        </Body>
    )
}
