Monte Carlo Simulation in Finance
Looking Beyond the Average Outcome

Monte Carlo simulation has built something of a reputation in recent years.

Mention it in financial circles and people often picture quantitative hedge funds, Wall Street trading desks, or investment firms employing teams of mathematicians and programmers to model markets using sophisticated algorithms. It has become one of those techniques that carries an air of mystery, partly because it is so frequently associated with quantitative finance and the rise of data-driven investing.

Yet the central idea behind Monte Carlo simulation is remarkably simple.

At its heart, Monte Carlo simulation is nothing more than repeating the same experiment thousands of times using randomly generated inputs. Rather than producing a single prediction, it allows us to explore the range of outcomes that could plausibly occur.

That simple idea has made Monte Carlo one of the most widely used modelling techniques in finance. Investment managers, actuaries, financial planners and risk analysts all use it to explore the same fundamental question:

What could happen, and how likely is each outcome?

Despite its sophisticated reputation, you don't need advanced mathematics to understand the intuition behind it.

In fact, one of the easiest ways to understand Monte Carlo simulation doesn't involve financial markets at all.

It starts with something much simpler:

a coin toss.

Starting with Something Familiar

Imagine repeatedly tossing a fair coin.

We know that each toss has a 50% chance of landing heads.

But if we toss it only twice, we might observe:

100% heads
50% heads
0% heads

With such a small sample, the results are dominated by randomness.

As we continue tossing the coin, however, something interesting happens. The running average gradually settles closer and closer to the true probability of 50%.

(Figure 1: Coin Toss Results Converge Towards 50%)

This idea lies at the heart of Monte Carlo simulation.

Rather than trying to predict a single outcome, we repeatedly sample from possibilities that we already understand. Individual trials remain unpredictable, but after thousands of simulations, useful patterns begin to emerge.

Instead of simulating coin tosses, we can simulate investment returns.

From Coin Tosses to Investments

Suppose we invest $10,000 into a growth portfolio.

For this example we'll assume:

Expected annual return: 8%
Annual volatility: 16%

If we were only interested in the average outcome, we wouldn't need a simulation at all.

We could simply calculate that an investment earning exactly 8% over one year would be expected to grow to approximately $10,800.

Likewise, volatility gives us an indication of how much returns typically vary around that average.

So why would we go to the effort of running thousands of random simulations?

The answer is that markets don't deliver smooth, predictable returns. Investors don't experience one neat annual return each year—they experience a sequence of good months, bad months, recoveries and setbacks.

Those journeys matter.

Rather than asking:

What is the expected outcome?

Monte Carlo allows us to ask a different question:

What happens across thousands of possible futures?

The Simulation Process

The underlying simulation is surprisingly straightforward.

Rather than modelling the portfolio once per year, we'll simulate it one month at a time.

Using our annual assumptions, we convert them into monthly values:

Expected monthly return: 0.6434%
Expected monthly volatility: 4.6188%

Each month, the simulation generates a random return consistent with these assumptions.

That return is then applied to the portfolio, producing a new portfolio value.

The process repeats month after month until we reach our chosen investment horizon.

One simulation therefore produces one possible investment journey.

Computers are extremely good at repetitive calculations, so once we've generated one path, we simply repeat the process thousands of times.

Conceptually, the algorithm is little more than:

Repeat 5,000 times

    Generate a random monthly return

    Update the portfolio value

    Repeat for every month

Store the completed portfolio path

Notice that the simulation itself isn't particularly complicated.

We're simply repeating the same straightforward calculation many thousands of times.

The power comes not from any individual simulation, but from looking at all of them together.

Exploring Possible Futures

Once we've generated thousands of possible investment paths, we can begin asking much more interesting questions.

(Figure 2: Possible Investment Paths and Final Values)

The chart on the left shows twenty individual simulated investment paths over a ten-year period.

Each path represents one possible future.

Some portfolios enjoy several strong years immediately.

Others suffer an early decline before recovering.

Some steadily outperform throughout the decade, while others never quite catch up.

The histogram on the right summarises where all 5,000 simulations finished.

Instead of looking at individual journeys, it shows the distribution of possible outcomes.

Notice that although every path follows a different route, most eventually finish within a relatively concentrated range, while a small number produce exceptionally strong or exceptionally weak outcomes.

This is already useful.

Rather than saying:

"We expect approximately 8% per year."

we can begin talking about uncertainty.

We can discuss not only what we expect to happen, but also how much variation exists around that expectation.

The histogram is particularly useful because it summarises the entire simulation in a single view. Rather than focusing on one investment path, it reveals the overall shape of possible outcomes, allowing us to see how frequently different final portfolio values occurred.

One interesting detail is that the peak of the distribution sits slightly below the deterministic value implied by compounding 8% every year.

This isn't an error in the simulation.

It's a consequence of volatility. A small number of exceptionally strong outcomes pull the arithmetic average upwards, while the typical compounded investment path grows slightly more slowly. Even in this relatively simple example, Monte Carlo begins revealing behaviour that isn't immediately obvious from a single expected return.

How Investment Horizon Changes Risk

So far we've simply observed how one investment might behave over a fixed ten-year period.

Let's ask a more practical question.

Imagine a client is considering investing in the same growth portfolio, but isn't sure how long they should remain invested.

They understand that longer investment horizons generally improve expected returns, but they're primarily concerned with preserving their capital. Their goal is simple:

What investment horizon gives me the best chance of finishing with at least as much money as I started with?

Notice that the underlying simulation hasn't changed at all.

We're still generating exactly the same random monthly returns as before.

The only thing we've changed is the question we're asking of those simulations.

By running the model across a range of investment horizons, we can calculate the probability of finishing below the starting value.

(Figure 3: Chance of Finishing Below the Starting Value)

The result isn't particularly surprising, but it is useful.

As the investment horizon increases, the probability of loss steadily declines.

Rather than simply saying that "longer is better", we can now quantify the trade-off between investment horizon and risk.

A financial adviser could present this information to a client and discuss what level of risk they are comfortable accepting.

The simulation hasn't produced a recommendation.

Instead, it has transformed a general statement into evidence that can support a more informed decision.

The Range of Possible Outcomes

Reducing the probability of loss doesn't mean reducing uncertainty.

In fact, the opposite happens.

(Figure 4: Final Value Range by Investment Horizon)

As the investment horizon becomes longer, the median portfolio value continues to increase.

At the same time, however, the spread between strong and weak outcomes becomes much wider.

Longer investment horizons generally increase expected wealth, but they also create a much broader range of possible futures.

So far, Monte Carlo has behaved much less like a mysterious Wall Street algorithm than our introduction might have suggested.

In reality, we've simply repeated a relatively simple investment model thousands of times and asked progressively more interesting or specific questions.

That naturally leads to an obvious question: has Monte Carlo actually told us anything we couldn't have estimated using more traditional financial mathematics?

For this simple investment example...

Not really - but I'm not going to finish here!

So Why Use Monte Carlo?

Up to this point, Monte Carlo has largely confirmed what we already expected.

Using our assumptions of an 8% annual return and 16% annual volatility, the simulation showed that longer investment horizons reduce the probability of loss, while simultaneously increasing the range of possible outcomes.

These are useful insights, but none of them are particularly surprising.

Many of these results could be estimated using traditional financial mathematics without ever running a simulation.

So why has Monte Carlo become one of the defining tools of modern financial modelling?

The answer is that real financial planning problems are rarely this simple.

Real investors don't simply buy a portfolio and leave it untouched for decades.

They retire.

They draw an income.

They change their spending.

They have objectives that extend beyond simply maximising returns.

As soon as we begin modelling these real-world decisions, the mathematics becomes significantly more complicated.

This is where Monte Carlo begins to demonstrate its real value.

A Financial Planning Problem

Imagine you're a financial adviser meeting with a new client.

The client has recently retired with a $100,000 investment portfolio.

After discussing their budget, you've determined that they would like to withdraw $8,000 per year to supplement their income.

They also have one important objective.

They don't want the portfolio to fall below $40,000 during the next fifteen years unless absolutely necessary. That reserve provides both financial security and flexibility if unexpected expenses arise later in retirement.

At first glance, this sounds like a straightforward planning exercise.

But there is one obvious complication.

Neither you nor your client knows what investment returns will look like over the next fifteen years.

Instead of assuming one average outcome, we once again turn to Monte Carlo simulation.

Introducing Sequence Risk

The underlying simulation hasn't changed.

We're still generating monthly investment returns using exactly the same assumptions as before.

We're still repeating the process thousands of times.

The only difference is that the portfolio now makes regular monthly withdrawals.

Something important immediately changes.

Previously, only the final portfolio value really mattered.

Now the order of investment returns becomes critically important.

Imagine two portfolios that both achieve exactly the same average annual return.

If one portfolio suffers poor returns during the first two years while withdrawals continue, those withdrawals are taken from a rapidly shrinking asset base.

Even if markets recover later, much of the capital that would have benefited from that recovery has already been withdrawn.

A second portfolio might experience those same poor returns ten years later, after many years of growth have already built a much larger reserve.

Although both portfolios achieve the same average return, they can produce dramatically different retirement outcomes.

This phenomenon is known as sequence risk, and it is one of the biggest challenges in retirement planning.

When the Journey Matters More Than the Destination

We now simulate our client's retirement plan over the next fifteen years.

After running 5,000 possible market scenarios, we group the simulations according to how the portfolio performed during its first two years.

(Figure 5: Early Returns Matter When Withdrawals Continue)

The pattern is immediately obvious.

Portfolios that experienced strong early returns generally remained comfortably above the client's reserve target.

Those that experienced weak early returns often continued drifting towards it, even though every simulation shared exactly the same long-term investment assumptions.

Nothing about the portfolio changed.

Nothing about the expected return changed.

The only thing that changed was when those returns occurred.

This is the first point in the article where Monte Carlo begins telling us something that isn't immediately obvious from average returns alone.

More importantly, it has highlighted something useful.

Rather than treating all future market conditions equally, we've identified a specific class of scenarios that appears much more likely to threaten the client's objective.

As a financial adviser, that naturally leads to another question.

Testing a Contingency Plan

Suppose we review these results with our client.

The simulation suggests that the greatest threat to the retirement plan is experiencing poor market performance during the first few years of retirement.

Rather than changing the investment portfolio itself, we discuss a simple contingency plan.

If the portfolio experiences a particularly weak start, the client agrees to temporarily reduce discretionary spending until the portfolio has an opportunity to recover.

Can such a small change materially improve the likelihood of meeting their objective?

Instead of relying on intuition, we can test it.

Using exactly the same weak-start simulations identified in the previous analysis, we compare two retirement plans.

Plan A continues withdrawing the original monthly amount throughout the full fifteen years.

Plan B follows exactly the same withdrawal schedule for the first two years, but temporarily reduces withdrawals once the weak early performance has been identified.

Everything else remains identical.

The investment portfolio is unchanged.

The simulated market returns are unchanged.

The same market paths are used for both plans.

Only the client's spending rule changes.

(Figure 6: Testing a Spending Adjustment After a Weak Start)

The result is immediately visible.

Many of the adaptive paths stabilise above the reserve floor, while their static counterparts continue to decline.

The accompanying histograms tell the same story from another perspective.

Using exactly the same market conditions, the adaptive spending plan shifts the distribution of surviving portfolio values upwards and reduces the number of depleted portfolios.

Monte Carlo hasn't told us which retirement plan is "correct."

Nor has it predicted what markets will do over the next fifteen years.

Instead, it has allowed both adviser and client to test a realistic contingency plan before committing to it.

From Forecasting to Decision-Making

This is where Monte Carlo earns its reputation.

The simulation itself hasn't become significantly more sophisticated than it was when we were modelling a simple investment portfolio.

We're still generating random monthly returns.

We're still repeating the experiment thousands of times.

What has changed is the question we're asking.

At the beginning of the article we asked:

What might this portfolio be worth?

By the end of the article we're asking:

How likely is this financial plan to achieve the client's objective?

And finally:

If circumstances change, what adjustments are available to improve the outcome?

Those are fundamentally different questions.

More importantly, they're the kinds of questions financial advisers, wealth managers and institutional investors answer every day.

Monte Carlo doesn't replace professional judgement.

It provides evidence that helps inform it.

Final Thoughts

Monte Carlo simulation is often introduced as a technique for generating thousands of random scenarios.

While that's technically true, it misses the bigger picture.

The real value of Monte Carlo isn't randomness.

It's providing a structured framework for making decisions under uncertainty.

For relatively simple investment problems, Monte Carlo often confirms what traditional financial mathematics already tells us.

It provides a richer understanding of uncertainty, but not necessarily dramatically different answers.

As soon as we introduce withdrawals, reserve targets, client objectives and contingency plans, however, the simulation becomes much more than a visualisation tool.

It becomes a planning tool.

Rather than relying on a single forecast, we can explore thousands of plausible futures, identify where a financial plan is most vulnerable, and test alternative strategies before real money is involved.

Monte Carlo simulation doesn't predict the future.

Instead, it helps us prepare for it.

And that is why it has become one of the most valuable tools in modern financial planning and investment analysis.