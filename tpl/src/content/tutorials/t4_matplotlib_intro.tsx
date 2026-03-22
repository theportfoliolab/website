import Body from "@/components/content/body"
import ImageBlock from "@/components/content/imageblock"
import Link from "@/components/content/link"
import { Text } from "@/components/content/text"
import type { PostMeta } from "@/components/content/types"

import basicLineChart from "@/content/tutorials/t4_matplotlib_intro/basic-line-chart.png"
import titledAndFormattedLineChart from "@/content/tutorials/t4_matplotlib_intro/titled-and-formatted-line-chart.png"
import styledLineChart from "@/content/tutorials/t4_matplotlib_intro/styled-line-chart.png"
import axisLimitsLineChart from "@/content/tutorials/t4_matplotlib_intro/axis-limits-line-chart.png"
import stockReturnsBarChart from "@/content/tutorials/t4_matplotlib_intro/stock-returns-bar-chart.png"
import gridlineLineChart from "@/content/tutorials/t4_matplotlib_intro/gridline-line-chart.png"
import movingAverageComparisonChart from "@/content/tutorials/t4_matplotlib_intro/moving-average-comparison-chart.png"
import riskReturnScatterPlot from "@/content/tutorials/t4_matplotlib_intro/risk-return-scatter-plot.png"
import priceAndVolumeSameAxisChart from "@/content/tutorials/t4_matplotlib_intro/price-and-volume-same-axis-chart.png"
import ggplotStyleChartExample from "@/content/tutorials/t4_matplotlib_intro/ggplot-style-chart-example.png"

export const meta: PostMeta = {
    title: "Introduction to Matplotlib (Python Tutorial)",
    description: "A practical guide to creating clean 2D charts from scratch.",
    date: "2026-03-23",
    tags: ["python", "matplotlib", "numpy", "data visualisation"],
    type: "tutorial",
    slug: "introduction-to-matplotlib-python-tutorial",
    nextInSeriesSlug: "symbolic-encoding-financial-time-series",
}

export default function Tutorial() {
    return (
        <Body>
            <Text title="Introduction to Matplotlib (Python Tutorial)" lead="A practical guide to creating clean 2D charts from scratch" />

            <Text
                heading="1. Introduction"
                lead="What this tutorial covers:"
                content={"Here you'll learn the basic of charting data in python using matplotlib ,and some simple formatting for readability and presentation."}
            />

            <Text
                lead="Why it matters:"
                content={[
                    "Data visualisation is essential for data analysis, finance, and reporting. Calculating the data alone is usually not enough, you need to able to clearly and effectively communicate your findings, even if that means just seeing the data yourself.",
                ]}
            />

            <Text
                lead="What the reader will build:"
                content={"We will spend most of our time creating and formatting line charts, but we'll also have a look at scatter plots and bar graphs."}
            />

            <Text
                heading="2. Setup"
                content={
                    <>
                        We will use <Link href="https://matplotlib.org/">matplotlib</Link> and <Link href="https://numpy.org/">numpy</Link> for this tutorial. NumPy is a library for working with numerical data efficiently, especially arrays and mathematical operations.{" "}
                        Matplotlib is a plotting library that allows you to create charts and visualisations from your data.
                    </>
                }
            />

            <Text
                content={`To install these libraries, run the commands:`}
                code={`pip install matplotlib
pip install numpy`}
            />

            <Text
                content={`Then at the top of your code, import the libraries:`}
                code={`import matplotlib.pyplot as plt
import numpy as np`}
            />

            <Text
                heading="3. Sample Data (Provided in Script)"
                content={`We need some data to plot: You can use your own data if you are comfortable with
handling it, otherwise here is some sample data. Simply put this into your main method:

Example:`}
                code={`days = np.arange(1, 11)
prices = [100, 102, 101, 105, 107, 106, 108, 110, 109, 111]`}
            />

            <Text
                content={`We will use the days series for our x axis, and prices as our line data on the y axis.`}
            />

            <Text
                lead="Code checkpoint: Libraries imported and data loaded"
                code={`import matplotlib.pyplot as plt
import numpy as np


def main():
    # Sample data
    days = np.arange(1, 11)
    prices = [100, 102, 101, 105, 107, 106, 108, 110, 109, 111]
    volume = [200, 220, 210, 300, 280, 260, 290, 310, 305, 320]


if __name__ == "__main__":
    main()`}
            />

            <Text
                heading="4. Your First Plot (Line Chart)"
                content={`The most basic structure for plotting a series is to call the plot() and show() methods
of matplotlib. You will need to pass two series (x and y axes) to the plot() method.`}
                code={`plt.plot(days, prices)
plt.show()`}
            />

            <Text
                content={`Add this to your main method after the data, then run the script.
If everything goes right, you should see a new window appear with your chart!`}
            />

            <ImageBlock src={basicLineChart} alt="checkpoint 01" className="w-full" />

            <Text
                heading="5. Titles and Labels"
                content={`Ok, so we have made a basic chart, but it's missing a lot of the useful information
that the viewer needs to understand it. Next, let's look at adding
titles and labels.`}
            />

            <Text
                content={`Here is an overview of the methods you will use to do this:`}
                bullets={[
                    "title(): The title for the chart, accepts a string",
                    "xlabel(): The label for the x axis: Accepts a string",
                    "ylabel(): The label for the y axis: Accepts a string",
                ]}
            />

            <Text
                content={`Using the sample data, add these after creating the plot object, but before showing it:`}
                code={`plt.plot(days, prices)

plt.title("Stock Price Over Time")
plt.xlabel("Day")
plt.ylabel("Price")

plt.show()`}
            />

            <Text
                content={`So we have titles and labels, but we forgot to denote the units for each axis!`}
                code={`plt.xlabel("Days (since inception)")
plt.ylabel("Price ($)")`}
            />

            <Text
                content={`Or we could use labelled axis ticks: The choice will depend on
how you want to stylise the chart, if you are following some style guide like
APA or a design style guide, then you will have to consider that in your choice.

For labelled axis ticks, you might want nice clean dollar amounts.
In this case, we will add one tick every for $5 increase in price, but you can adjust this to suit your style or data.

Add this import to the top of your code:`}
                code={`import matplotlib.ticker as mtick`}
            />

            <Text
                content={`Then in main, add this after your normal y axis label:`}
                code={`ax = plt.gca()

# Set tick spacing to $5
ax.yaxis.set_major_locator(mtick.MultipleLocator(5))

# Format ticks as dollar values
ax.yaxis.set_major_formatter(mtick.StrMethodFormatter('\${x:,.0f}'))`}
            />

            <Text
                content={
                    <>
                        The value you pass to MultipleLocator() will determine the tick spacing: 5 for every 5 units, 10 for every 10 units, and so on.

                        The StrMethodFormatter lets you control how tick labels are formatted, using{" "}
                        <Link href="https://docs.python.org/3/library/string.html#format-string-syntax">
                            Python&apos;s string formatting syntax
                        </Link>.
                    </>
                }
            />

            <Text
                code={`mtick.StrMethodFormatter('\${x:,.0f}')`}
            />

            <Text
                lead="Breakdown:"
                bullets={[
                    "x : the tick value",
                    ": : start of formatting rules",
                    ", : adds thousands separators (1,000 instead of 1000)",
                    ".0f : format as a float with 0 decimal places",
                    "$ : literal dollar sign prefix",
                ]}
            />

            <Text
                content={`So:

1000 becomes $1,000, and 
105 becomes $105`}
            />

            <Text
                content={`Why do we need both lines? MultipleLocator(5) controls where the ticks appear (every $5) and StrMethodFormatter(...) controls how the ticks look.`}
            />

            <Text
                content={`You need both to get:`}
                code={`$100   $105   $110   $115`}
            />

            <Text
                content={`This separates data structure (tick placement) from presentation (tick formatting), which gives you more control over chart styling.`}
            />

            <Text
                lead="Code checkpoint:"
                code={`import matplotlib.pyplot as plt
import matplotlib.ticker as mtick
import numpy as np

def main():

    # Sample data
    days = np.arange(1, 11)
    prices = [100, 102, 101, 105, 107, 106, 108, 110, 109, 111]
    volume = [200, 220, 210, 300, 280, 260, 290, 310, 305, 320]

    plt.plot(days, prices)

    plt.title("Stock Price Over Time")
    plt.xlabel("Day")
    plt.ylabel("Price")
    ax = plt.gca()

    # Set tick spacing to $5
    ax.yaxis.set_major_locator(mtick.MultipleLocator(5))

    # Format ticks as dollar values
    ax.yaxis.set_major_formatter(mtick.StrMethodFormatter('\${x:,.0f}'))

    plt.show()

if __name__ == "__main__":
    main()`}
            />

            <ImageBlock src={titledAndFormattedLineChart} alt="checkpoint 02" className="w-full" />

            <Text
                heading="6. Styling the Line"
                content={
                    <>
                        At this point I&apos;d recommend opening the documentation for{" "}
                        <Link href="https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.plot.html#matplotlib.pyplot.plot">matplotlib.pyplot.plot</Link>:
                    </>
                }
            />

            <Text
                content={`Here, I will only cover a few of the options and parameters to get you started, but you might find the complete coverage of parameters in the documentation to be useful when creating your plot.

Now lets pass some extra parameters to the plot method to change
the appearance of the line:`}
            />

            <Text
                lead="color: The colour that the line will be"
                code={`# Using named colours
color="green"
# Using Hex colours
color="#3FC083FF"`}
            />

            <Text
                lead="linestyle: The style of the line"
                code={`# Solid (default)
linestyle="-"
# Dotted
linestyle=":"
# Dashed
linestyle="--"`}
            />

            <Text
                lead="marker: Puts a marker on each data point"
                code={`# Circle
marker="o"
# Cross
marker="x"
# Point
marker="."`}
            />

            <Text
                content={`For example, to make a dashed line in ThePortfolioLab's primary green with a circular marker on each data point, change your plot() method call to include:`}
                code={`plt.plot(days, prices, color="#3FC083FF", linestyle="--", marker="o")`}
            />

            <ImageBlock src={styledLineChart} alt="checkpoint 03" className="w-full" />

            <Text
                heading="7. Axis Control"
                content={`Sometimes the default axis range is fine, but in other cases you may want
to control exactly what part of the data is shown. Frequently, we want the y axis to start at 0, as is consistent with many scientific
charting conventions.

This can be done by adjusting the axis limits:`}
                code={`# Only show data points 1 to 10 on the x axis
plt.xlim(1, 10)
# Ensure the y axis starts at 0
plt.ylim(0, 110)
# Or, ensure the y axis starts at 0 and let matplotlib choose a sensible upper limit
plt.ylim(bottom=0)`}
            />

            <Text
                content={`Add these lines (choose between either option for your y limit) to the script anywhere before calling show()
and you should get a chart that looks like this:`}
            />

            <ImageBlock src={axisLimitsLineChart} alt="checkpoint 04" className="w-full" />

            <Text
                content={`Adding a grid is as simple as passing a boolean (True or False) to the grid() method:`}
                code={`# Show grid
plt.grid(True)`}
            />

            <ImageBlock src={gridlineLineChart} alt="checkpoint 05" className="w-full" />

            <Text
                lead="Code checkpoint:"
                code={`import matplotlib.pyplot as plt
import matplotlib.ticker as mtick
import numpy as np


def main():
    # Sample data
    days = np.arange(1, 11)
    prices = [100, 102, 101, 105, 107, 106, 108, 110, 109, 111]

    plt.figure(figsize=(12, 7), dpi=100)
    plt.plot(days, prices, color="#3FC083", linestyle="--", marker="o")

    plt.title("Stock Price Over Time")
    plt.xlabel("Days (since inception)")
    plt.ylabel("Price ($)")

    ax = plt.gca()
    ax.yaxis.set_major_locator(mtick.MultipleLocator(5))
    ax.yaxis.set_major_formatter(mtick.StrMethodFormatter('\${x:,.0f}'))

    plt.xlim(1, 10)
    plt.ylim(bottom=0)
    plt.grid(True)

    plt.show()


if __name__ == "__main__":
    main()
`}
            />

            <Text
                heading="8. Multiple Lines (Comparison)"
                content={`A common use of line charts is to compare two related series on the same axes.

Lets use the example of a moving average to show how to plot two lines together.
Add this line to your main() method after the sample data:`}
                code={`# Calculate 3-day moving average of the prices series
moving_avg = np.convolve(prices, np.ones(3)/3, mode='valid')`}
            />

            <Text
                content={`Now to add another line to the chart, call plot() a second time.
This time we will pass moving_avg, and some different line attributes so the two series can be differentiated visually.`}
                code={`# The existing plot
plt.plot(days, prices, color="#3FC083", linestyle="--", marker="o", label="Price")
# The second plot for the moving average
plt.plot(days[2:], moving_avg, color="blue", linestyle="-", marker=None, label="3-Day MA")`}
            />

            <Text
                content={`Note how we passed in days[2:], because our 3 day moving average doesn't have data for the first two days.

Now we need a legend to show viewers which line represents which series:`}
                code={`plt.legend()
plt.show()`}
            />

            <Text
                content={`Now you've got the basics of line charts! Your finished code should look something like this:`}
            />

            <ImageBlock src={movingAverageComparisonChart} alt="checkpoint 06" className="w-full" />

            <Text content={`Next, let's look at some other chart types.`} />

            <Text
                heading="9. Scatter Plot"
                content={`Scatter plots are used to show a relationship between two variables when the data points don't belong to a series.
In this example, we'll use some sample data for a group of stocks' standard deviation and expected return.

Make a new python file and copy this boilerplate and data in:`}
                code={`import matplotlib.pyplot as plt
import numpy as np

def main():

    # Sample data: standard deviation (risk) and expected return
    tickers = ["AAPL", "MSFT", "GOOGL", "AMZN", "META", "NVDA"]

    std_dev = [0.20, 0.18, 0.22, 0.25, 0.24, 0.30]      # Risk (x-axis)
    returns = [0.12, 0.10, 0.11, 0.13, 0.09, 0.15]      # Expected return (y-axis)

if __name__ == "__main__":
    main()`}
            />

            <Text
                content={`Creating the chart is similar to creating a line chart, but we'll use scatter() instead of plot().
Add this to your main method:`}
                code={`#Scatter plot with cross markers
plt.scatter(std_dev, returns, marker="x")
plt.title("Risk/Return Scatter")
plt.xlabel("Standard Deviation")
plt.ylabel("Expected Return")
plt.show()`}
            />

            <Text
                content={`Your finished script should look like:`}
                code={`import matplotlib.pyplot as plt
import numpy as np


def main():
    # Sample data: standard deviation (risk) and expected return
    tickers = ["AAPL", "MSFT", "GOOGL", "AMZN", "META", "NVDA"]
    std_dev = [0.20, 0.18, 0.22, 0.25, 0.24, 0.30]   # Risk
    returns = [0.12, 0.10, 0.11, 0.13, 0.09, 0.15]   # Expected return

    plt.figure(figsize=(12, 7), dpi=100)
    plt.scatter(std_dev, returns, marker="x")
    plt.title("Risk/Return Scatter")
    plt.xlabel("Standard Deviation")
    plt.ylabel("Expected Return")
    plt.show()


if __name__ == "__main__":
    main()`}
            />

            <ImageBlock src={riskReturnScatterPlot} alt="checkpoint 07" className="w-full" />

            <Text
                content={`Now, let's say we want to show a bar chart showing only the returns of each stock: Let's add a bar chart to the same
file, and get 2 charts out of one script.`}
            />

            <Text
                heading="10. Bar Graph"
                content={`Bar graphs are better for showing discrete values, because we can label the bars cleanly. If we just added the labels
to the scatter plot, we'd have text all over the chart area which could obscure other data points and make the chart
unreadable.

So let's add a bar graph after the scatter plot to show the returns for each stock:
To get two charts out of one script, simply create your second chart after the first one.`}
                code={`# In main(), after plt.show() for the first chart
plt.figure(figsize=(12, 7), dpi=100)
plt.bar(tickers, returns)
plt.title("Stock Returns")
plt.xlabel("Ticker")
plt.ylabel("Expected Return")
plt.grid(True, axis="y")
plt.show()`}
            />

            <Text
                content={`Save and run the script, and when you close the first chart window, the bar graph chart will appear. All the same
formatting tricks work here too, so see if you can add axis labels and change the colour of your graph bars!`}
            />

            <ImageBlock src={stockReturnsBarChart} alt="bar graph example" className="w-full" />

            <Text
                lead="Code checkpoint"
                code={`import matplotlib.pyplot as plt


def main():
    # Sample data: standard deviation (risk) and expected return
    tickers = ["AAPL", "MSFT", "GOOGL", "AMZN", "META", "NVDA"]
    std_dev = [0.20, 0.18, 0.22, 0.25, 0.24, 0.30]
    returns = [0.12, 0.10, 0.11, 0.13, 0.09, 0.15]

    plt.figure(figsize=(12, 7), dpi=100)
    plt.scatter(std_dev, returns, marker="x")
    plt.title("Risk/Return Scatter")
    plt.xlabel("Standard Deviation")
    plt.ylabel("Expected Return")
    plt.grid(True)
    plt.show()

    plt.figure(figsize=(12, 7), dpi=100)
    plt.bar(tickers, returns)
    plt.title("Stock Returns")
    plt.xlabel("Ticker")
    plt.ylabel("Expected Return")
    plt.grid(True, axis="y")
    plt.show()


if __name__ == "__main__":
    main()`}
            />

            <Text
                heading="A More Advanced Example: Combining Multiple Datasets"
                content={`So far, we have only plotted one dataset at a time.

In practice, you will often want to display multiple related datasets on the same chart.
A common example in finance is showing price and trading activity together.

Let's reuse our first simple dataset:`}
                code={`import matplotlib.pyplot as plt
import numpy as np

def main():

    # Sample data
    days = np.arange(1, 11)
    prices = [100, 102, 101, 105, 107, 106, 108, 110, 109, 111]
    volume = [200, 220, 210, 300, 280, 260, 290, 310, 305, 320]

if __name__ == "__main__":
    main()`}
            />

            <Text
                content={`First, plot the price as a line chart:`}
                code={`plt.plot(days, prices, color="#3FC083", linestyle="--", marker="o")

plt.title("Price and Volume")
plt.xlabel("Day")
plt.ylabel("Price")`}
            />

            <Text
                content={`Now, add the volume as a bar chart on top of the same axes. Add this line just before you call show():`}
                code={`plt.bar(days, volume, alpha=0.3)`}
            />

            <Text
                content={`The alpha parameter controls transparency (0 = fully transparent, 1 = fully solid).
Setting alpha=0.3 makes the bars semi-transparent, so the line remains visible.

Finally, display the chart:`}
                code={`plt.show()`}
            />

            <Text
                lead="Code checkpoint:"
                code={`import matplotlib.pyplot as plt
import numpy as np

def main():

    # Sample data
    days = np.arange(1, 11)
    prices = [100, 102, 101, 105, 107, 106, 108, 110, 109, 111]
    volume = [200, 220, 210, 300, 280, 260, 290, 310, 305, 320]

    plt.plot(days, prices, color="#3FC083", linestyle="--", marker="o")

    plt.title("Price and Volume")
    plt.xlabel("Day")
    plt.ylabel("Price")
    plt.bar(days, volume, alpha=0.3)
    plt.show()

if __name__ == "__main__":
    main()`}
            />

            <Text
                heading="Understanding the Limitation"
                content={`You may notice that the chart doesn't look quite right:`}
            />

            <ImageBlock src={priceAndVolumeSameAxisChart} alt="checkpoint 08" className="w-full" />

            <Text
                content={`The issue is that price and volume share the same y-axis, even though they are on very different scales.
Because volume values are much larger, the price line appears compressed.

This is a common problem when combining datasets, and it highlights an important idea:

Good visualisation is not just about plotting data, it's about choosing the right structure for that data.

We'll solve this properly in Part 2 when we introduce multiple axes and more advanced layouts.`}
            />

            <Text
                heading="Styling libraries"
                content={`Sometimes you'll want to specify each part of your plot's style to match your own use case,
but Matplotlib also includes built-in styles that change the overall appearance of your charts.

These styles affect the colours, gridlines, background, font weight and spacing, etc. of your chart and allows
you to quickly make stylised charts without all the extra work.

In addition, if you stick to using one style, you'll automatically have a consistent style across your
charts, making your work look more professional and easier to read.

Let's try adding a style to see what it does. Add this line right after your data:`}
                code={`plt.style.use("ggplot")`}
            />

            <ImageBlock src={ggplotStyleChartExample} alt="styled chart example" className="w-full" />

            <Text
                lead="Some common options include:"
                bullets={[
                    '"default"',
                    '"ggplot"',
                    '"seaborn-v0_8"',
                ]}
            />

            <Text
                content={
                    <>
                        Check the documentation from <Link href="https://plotnine.org/guide/introduction.html">Plotnine</Link> for a more in depth overview of ggplot and some cool sample charts.{" "}
                    </>
                }
            />

            <Text
                content={`I'll cover some uses of ggplot in more depth in a later tutorial. You can really get creative with this, so experiment and have fun!`}
            />

            <Text
                heading="Saving Figures"
                content={`Instead of displaying a chart, you can save it to a file:`}
                code={`# Saves your chart to a file called chart.png at a size of 6 x 4 inches at 100dpi
# The resultant file will be 600 x 400 pixels
plt.figure(figsize=(6, 4), dpi=100)
plt.savefig("chart.png", dpi=100)`}
            />

            <Text
                content={`There is also a save button in the UI when you show() a chart, which is handy, but won't give you exact
control over the resolution or size.

A common workflow is:`}
                bullets={[
                    "use plt.show() during development",
                    "use plt.savefig() for final outputs",
                ]}
            />

            <Text
                heading="Common Mistakes"
                content={`When starting out, a few issues come up frequently:`}
                bullets={[
                    "Forgetting to call plt.show()",
                    "Overlapping labels or titles",
                    "Using inconsistent styles across charts",
                    "Plotting data with very different scales on the same axis",
                    "Adding too many visual elements at once",
                ]}
            />

            <Text
                content={`Keeping charts simple and readable is usually the best approach.`}
            />

            <Text
                heading="Next Steps"
                content={`In Part 2, we'll build on this foundation and cover:`}
                bullets={[
                    "Multiple axes (solving the price vs volume problem properly)",
                    "Subplots for multi-panel charts",
                    "More in depth use of ggplot",
                    "Integrating pandas directly with matplotlib",
                    "Building reusable chart templates",
                    'Creating more "production-ready" visualisations',
                ]}
            />

            <Text
                heading="Closing Thoughts"
                content={`At this stage, you should be comfortable:

creating basic charts
customising their appearance
saving them for reuse. 

The next step is learning how to structure charts for real analytical or publication
 use,
where clarity and consistency matter just as much as correctness.`}
            />
        </Body>
    )
}
