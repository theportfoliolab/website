import Body from "@/components/content/body"
import ImageBlock from "@/components/content/imageblock"
import Link from "@/components/content/link"
import { Text } from "@/components/content/text"
import type { PostMeta } from "@/components/content/types"
import axisControlUnstyled from "@/content/tutorials/t5_matplotlib_axis_control_templates/axis_control_unstyled.png"
import axisControlStyled from "@/content/tutorials/t5_matplotlib_axis_control_templates/axis_control_styled.png"
import multiPanelSimple from "@/content/tutorials/t5_matplotlib_axis_control_templates/multi_panel_simple.png"
import multiPanelIntermediate from "@/content/tutorials/t5_matplotlib_axis_control_templates/multi_panel_intermediate.png"
import multiPanelWatermarks from "@/content/tutorials/t5_matplotlib_axis_control_templates/multi_panel_watermarks.png"

export const meta: PostMeta = {
    title: "Matplotlib Axis Control and Reusable Chart Templates",
    description: "A practical follow up to matplotlib basics, covering axis control, advanced tick formatting, and reusable plotting structure.",
    date: "2026-03-27",
    tags: ["python", "matplotlib", "numpy", "data visualisation"],
    type: "tutorial",
    slug: "matplotlib-axis-control-and-chart-templates",
    nextInSeriesSlug: "introduction-to-matplotlib-python-tutorial",
}

export default function Tutorial() {
    return (
        <Body>
            <section className="flex flex-col gap-sm rounded-md border border-muted/40 bg-secondary-light-bg/40 p-md dark:bg-secondary-dark-bg/40">
                <p className="text-lead text-primary-light-fg dark:text-primary-dark-fg">
                    Here for the charts?{" "}
                    <a
                        href="#reusable-chart-templates"
                        className="font-body text-primary-light-link underline underline-offset-4 transition-opacity hover:opacity-80 dark:text-primary-dark-link"
                    >
                        Click here to skip to the reusable templates
                    </a>
                </p>
            </section>

            <Text
                heading="From Basic Charts to Professional Visuals"
                content={
                    <>
                        In the previous tutorial, we built our first charts using matplotlib. If you want a refresher on the basics, revisit{" "}
                        <Link href="https://theportfoliolab.nz/tutorials/introduction-to-matplotlib-python-tutorial">
                            Introduction to Matplotlib (Python Tutorial)
                        </Link>. We plotted data, added labels, formatted axes, and produced something that is already far more useful than raw numbers in a table.
                        <br />
                        <br />
                        These charts work, but they do not yet look like something you would include in an article, report, or serious analysis project.
                        <br />
                        <br />
                        This is the gap we are going to close.
                        <br />
                        <br />
                        In this tutorial, we will start moving away from quick plots towards deliberate, well structured charts. The goal is not just to make things look nicer, but to build a workflow that is:
                    </>
                }
                bullets={["Consistent", "Reusable", "Suitable for real analysis and publication"]}
            />

            <Text
                content="We will begin with one of the most important, and most commonly misunderstood, parts of matplotlib: axis control. This builds directly on the twin axis example from the introductory tutorial, so make sure you are comfortable with that first."
            />

            <Text
                heading={"Axis Control"}
                lead="Why Default Axes Are Not Enough:"
                content={`
So far, we have mostly let matplotlib decide how our chart should look.

By default, it automatically chooses:
`}
                bullets={["Axis limits", "Tick spacing", "Tick labels"]}
            />

            <Text
                content={`
This is convenient, but it often produces charts that feel slightly off:
`}
                bullets={[
                    "The scale may not highlight what matters",
                    "Tick spacing can look inconsistent",
                    "Important values may not be clearly visible",
                ]}
            />

            <Text
                content={`
For quick exploration, this is fine.

But for presentation, especially in finance or data analysis, you need explicit control.

Let's look at that not so great example from the previous article:
`}
            />
            <Text
                lead="Copy this code into a python file:"
                code={`import matplotlib.pyplot as plt
import numpy as np

def main():

    # Sample data
    days = np.arange(1, 11)
    prices = [100, 102, 101, 105, 107, 106, 108, 110, 109, 111]
    volume = [200, 220, 210, 300, 280, 260, 290, 310, 305, 320]

    plt.plot(days, prices)

    plt.title("Price and Volume")
    plt.xlabel("Day")
    plt.ylabel("Price")
    plt.bar(days, volume, alpha=0.3)
    plt.show()

if __name__ == "__main__":
    main()
`}
            />

            <Text
                content={`
Run that file and you'll see there's an issue with this chart that becomes obvious once you look closely.

Price and volume are being plotted on the same y axis, even though they exist on completely different scales. Volume values are much larger, so the price line gets visually compressed and becomes difficult to interpret.

This is a common problem when combining datasets, and it highlights an important idea:

Good visualisation isn't just about plotting data, it's about choosing the right structure for that data.

Let's solve this:
`}
            />

            <Text
                heading="1. Fixing Axis Structure"
                content={`In the previous tutorial, we created this chart using the global plt (our renamed matplotlib.pyplot) object. This works, but it has a structural problem: price and volume are forced onto the same y axis, even though they are on very different scales.

To fix that, we will rebuild the chart in a few small steps.

First, we need to move away from plotting everything directly with plt, and instead work with axes objects.`}
            />
            <Text
                content={`Here are the key methods we will use:`}
                bullets={[
                    "subplots(): Returns a figure and axes object",
                    "twinx(): Returns a second y axis sharing the same x axis",
                    "set_ylabel(): Labels each axis clearly",
                ]}
            />
            <Text
                content={`First, replace the original line plot:

plt.plot(days, prices)

with these two lines:`}
                code={`fig, ax1 = plt.subplots()
ax1.plot(days, prices)`}
            />

            <Text
                content={`This creates an axes object called ax1, then draws the price line on that axes instead of directly on the global pyplot object.`}
            />

            <Text
                content={`Next, add the bar chart to that same axes object by placing this line directly underneath ax1.plot(days, prices):`}
                code={`ax1.bar(days, volume, alpha=0.3)`}
            />

            <Text
                content={`Since the volume bars are now being drawn with ax1.bar(), remove the old pyplot version of that line:`}
                code={`# Remove this line:
plt.bar(days, volume, alpha=0.3)`}
            />

            <Text
                content={`If you run this script, the chart should look essentially the same as before.

That's intentional:

we have not fixed the scaling problem yet, but we have changed the structure of the code. By using axes objects, we have unlocked control of the axes and can do more than the pyplot defaults allow us to.`}
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

    fig, ax1 = plt.subplots()

    ax1.plot(days, prices)
    ax1.bar(days, volume, alpha=0.3)

    plt.title("Price and Volume")
    plt.xlabel("Day")
    plt.ylabel("Price")
    plt.show()

if __name__ == "__main__":
    main()
`}
            />

            <Text
                content={`You may notice that we are still using plt.title(), plt.xlabel(), and plt.ylabel().

This still works, and for now it keeps the code simple.

We will move these onto the axes objects in the next step, once we introduce multiple axes.`}
            />

            <Text
                lead={'Fixing the scaling issue: Adding a second axis'}
                content={`With this new structure, we can now create a second axis by calling twinx() on the first one:`}
                code={`# Add this line after fig, ax1 = plt.subplots()

ax2 = ax1.twinx()`}
            />

            <Text
                content={`The twinx() method creates a new axis that shares the same x axis, but has its own y axis on the right hand side of the chart.`}
            />

            <Text
                content={`Now move the bar chart onto the new axis.

Replace the existing bar chart on ax1 with:`}
                code={`ax2.bar(days, volume, alpha=0.3)`}
            />

            <Text
                content={`Your chart should now:`}
                bullets={[
                    "have two y axes (left and right)",
                    "show price on the left axis",
                    "show volume on the right axis",
                    "display the price line without compression",
                ]}
            />
            <Text
                content={`Since we are now working with axes objects, we should also update the title and labels so they belong to the correct axis. Replace the old labels and titles on plt with:`}
                code={`ax1.set_title("Price and Volume")
ax1.set_xlabel("Day")
ax1.set_ylabel("Price ($)")
ax2.set_ylabel("Volume")`}
            />

            <Text
                content={`Keep plt.show() at the end of the script as usual.

If you run the script now, you should see a chart with:`}
                bullets={[
                    "price on the left y axis",
                    "volume on the right y axis",
                    "a price line that is no longer compressed",
                ]}
            />

            <ImageBlock src={axisControlUnstyled} alt="Chart with 2 y axes" className="w-full" />
            <Text
                lead="Code checkpoint:"
                code={`import matplotlib.pyplot as plt
import numpy as np

def main():

    # Sample data
    days = np.arange(1, 11)
    prices = [100, 102, 101, 105, 107, 106, 108, 110, 109, 111]
    volume = [200, 220, 210, 300, 280, 260, 290, 310, 305, 320]

    fig, ax1 = plt.subplots()
    ax2 = ax1.twinx()
    ax1.plot(days, prices)
    ax2.bar(days, volume, alpha=0.3)

    ax1.set_title("Price and Volume")
    ax1.set_xlabel("Day")
    ax1.set_ylabel("Price ($)")
    ax2.set_ylabel("Volume")

    plt.show()

if __name__ == "__main__":
    main()

`}
            />

            <Text
                heading="The 'alphaphant' in the room"
                content={`At this point, the chart structure is correct, but we are still relying on alpha=0.3 as a bit of a visual hack so both datasets remain visible.

A better long term solution is to control how the axes are layered.`}
            />

            <Text
                content={`To do that, add these lines after creating the axes:`}
                code={`ax1.set_zorder(2)
ax2.set_zorder(1)
ax1.patch.set_visible(False)`}
            />

            <Text
                content={`The set_zorder() method controls which axis is drawn on top.

Higher numbers sit above lower numbers, so here:`}
                bullets={[
                    "ax1 is drawn on top",
                    "ax2 is drawn underneath",
                ]}
            />

            <Text
                content={`The line ax1.patch.set_visible(False) is also important.

Each axis has a background patch: essentially a filled rectangle behind the data. If we leave the top axis patch visible, it can cover the bars underneath it.

Setting that patch to invisible means:`}
                bullets={[
                    "the price axis still sits on top",
                    "but its background does not block the volume bars underneath",
                ]}
            />

            <Text
                lead={'Utilising layering for style control:'}
                content={`Now that the axis layering is controlled properly, we can stop relying on transparency and use solid colours instead:`}
                code={`ax2.bar(days, volume, color="#EEEFE6")
ax1.plot(days, prices, color="#3FC083", linewidth=2)`}
            />

            <Text
                content={'See what happens if you swap the axes zorder values. The line should appear below the bars, which makes for poor readability.'}
            />

            <Text
                content={`This gives us a chart that is still easy to read, but is much easier to style cleanly.

That is the real benefit of fixing the axis structure properly: once the chart is built on the right foundation, styling becomes much simpler.`}
            />
            <ImageBlock src={axisControlStyled} alt="Chart with 2 y axes" className="w-full" />
            <Text
                lead="Code checkpoint:"
                code={`import matplotlib.pyplot as plt
import numpy as np

def main():

    # Sample data
    days = np.arange(1, 11)
    prices = [100, 102, 101, 105, 107, 106, 108, 110, 109, 111]
    volume = [200, 220, 210, 300, 280, 260, 290, 310, 305, 320]

    fig, ax1 = plt.subplots()
    ax2 = ax1.twinx()

    ax1.set_zorder(2)
    ax2.set_zorder(1)
    ax1.patch.set_visible(False)

    ax2.bar(days, volume, color="#EEEFE6")
    ax1.plot(days, prices, color="#3FC083", linewidth=2)

    ax1.set_title("Price and Volume")
    ax1.set_xlabel("Day")
    ax1.set_ylabel("Price ($)")
    ax2.set_ylabel("Volume")

    plt.show()

if __name__ == "__main__":
    main()


`}
            />

            <Text
                heading="2. Subplots for Multi Panel Charts"
                content={`In the last section, we solved the scaling problem by giving price and volume separate y axes.

That works well, but it is not always the clearest option.

Sometimes, instead of layering two datasets into one chart, it is better to give each dataset its own panel.

This is what subplots are for.

They let us place multiple charts inside the same figure, which makes it easier to compare related data without forcing everything into one plotting area. Let's use this to create a stacked chart, and I'll also walk you through some extra formatting tools.`}
            />

            <Text
                content={`Start with the same boilerplate and sample data:`}
                code={`import matplotlib.pyplot as plt
import numpy as np

def main():

    # Sample data
    days = np.arange(1, 11)
    prices = [100, 102, 101, 105, 107, 106, 108, 110, 109, 111]
    volume = [200, 220, 210, 300, 280, 260, 290, 310, 305, 320]
    
    plt.show()

if __name__ == "__main__":
    main()`}
            />

            <Text
                content={`The new idea here is that plt.subplots() can create more than one axis at once, if we give it two containers to do so.

In this case, we want two stacked panels: one for price, and one for volume.`}
            />

            <Text
                content={`Add this line inside main(), after the sample data:`}
                code={`fig, (ax1, ax2) = plt.subplots(nrows=2, sharex=True)`}
            />

            <Text
                content={`Let's break that down:`}
                bullets={[
                    "fig is the full figure object",
                    "ax1 and ax2 are the subplots we want. Matplotlib returns two axes objects here, and Python unpacks them into ax1 and ax2",
                    "nrows=2 creates two rows. You could also try ncols=2 for two side by side charts",
                    "sharex=True makes both panels use the same x axis. Use this when you want to align dates or other x axis values",
                ]}
            />

            <Text
                content={`So instead of creating one chart area, we are now asking matplotlib to give us two chart panels stacked vertically.`}
            />

            <Text
                content={`Next, plot the price data on the top axis. Add this after creating the axes:`}
                code={`# Alternatively, use your own style options
ax1.plot(days, prices, color="#3FC083", linewidth=2)`}
            />

            <Text
                content={`This works just like the line plots you made in the first tutorial, except now the line belongs specifically to ax1, the top panel.
`}
            />

            <Text
                content={`Now plot the volume data on the bottom axis:`}
                code={`# Alternatively, use your own style options
ax2.bar(days, volume, color="#EEEFE6")`}
            />

            <Text
                content={`This creates a bar chart on the second panel.

So now:`}
                bullets={[
                    "ax1 shows price",
                    "ax2 shows volume",
                ]}
            />

            <Text
                content={`Both panels still line up across the same days because we used sharex=True when creating the subplots.`}
            />

            <Text
                content={`At this point, your script should look like this:`}
                code={`import matplotlib.pyplot as plt
import numpy as np

def main():

    # Sample data
    days = np.arange(1, 11)
    prices = [100, 102, 101, 105, 107, 106, 108, 110, 109, 111]
    volume = [200, 220, 210, 300, 280, 260, 290, 310, 305, 320]

    fig, (ax1, ax2) = plt.subplots(nrows=2, sharex=True)

    ax1.plot(days, prices, color="#3FC083", linewidth=2)
    ax2.bar(days, volume, color="#EEEFE6")

    plt.show()

if __name__ == "__main__":
    main()`}
            />

            <Text
                content={`If you run that code now, you should see two simple chart panels stacked on top of each other.

The chart works, but it is still missing labels, and the default styling is a little plain.`}
            />

            <ImageBlock src={multiPanelSimple} alt="Chart with separate line and bar graphs" className="w-full" />

            <Text
                content={`Remember, we now add titles and labels to the axes objects, not the global pyplot object:`}
                code={`ax1.set_title("Price and Volume")
ax1.set_ylabel("Price ($)")
ax2.set_ylabel("Volume")
ax2.set_xlabel("Day")`}
            />

            <Text
                content={`We only need the x axis label on the bottom panel, because the two plots are sharing the same horizontal axis.`}
            />

            <Text
                content={`If you want, you can give the figure and both panels a simple ThePortfolioLab style background:`}
                code={`fig.patch.set_facecolor("#FDFBF7")

ax1.set_facecolor("#FDFBF7")
ax2.set_facecolor("#FDFBF7")`}
            />

            <Text
                content={`The figure is the full canvas, while each axis has its own plotting area.

Setting both makes the whole chart feel consistent.`}
            />
            <Text
                content={`Next, make the tick labels use a darker foreground colour, then tell matplotlib to tidy the layout automatically:`}
                code={`ax1.tick_params(colors="#0E0C21")
ax2.tick_params(colors="#0E0C21")

plt.tight_layout()`}
            />

            <Text
                content={`The tick_params() method controls the appearance of the axis ticks and tick labels.

The tight_layout() function adjusts spacing so the labels and panels do not overlap.`}
            />

            <Text
                content={`Finally, you might like to add a grid to the top chart only, so set just that axis's grid to true:`}
                code={`ax1.grid(True)`}
            />

            <ImageBlock src={multiPanelIntermediate} alt="Labelled chart with separate line and bar graphs" className="w-full" />
            <Text
                lead={`Code checkpoint:`}
                code={`import matplotlib.pyplot as plt
import numpy as np

def main():

    # Sample data
    days = np.arange(1, 11)
    prices = [100, 102, 101, 105, 107, 106, 108, 110, 109, 111]
    volume = [200, 220, 210, 300, 280, 260, 290, 310, 305, 320]

    fig, (ax1, ax2) = plt.subplots(nrows=2, sharex=True)

    ax1.plot(days, prices, color="#3FC083", linewidth=2)
    ax2.bar(days, volume, color="#EEEFE6")

    ax1.set_title("Price and Volume")
    ax1.set_ylabel("Price ($)")
    ax2.set_ylabel("Volume")
    ax2.set_xlabel("Day")

    fig.patch.set_facecolor("#FDFBF7")

    ax1.set_facecolor("#FDFBF7")
    ax2.set_facecolor("#FDFBF7")

    ax1.tick_params(colors="#0E0C21")
    ax2.tick_params(colors="#0E0C21")

    ax1.grid(True)

    plt.tight_layout()

    plt.show()

if __name__ == "__main__":
    main()`}
            />
            <Text
                heading="Using a Custom Font (Merriweather)"
                content={`So far, we have improved the structure and colours of the chart.

Another small change that makes a big difference is using a consistent font.

For ThePortfolioLab, I use Merriweather. Matplotlib does not use this by default, so we need to tell it explicitly.`}
            />

            <Text
                content={`Building on the twin panel chart, first, add this import at the top of your file:`}
                code={`from matplotlib import rcParams`}
            />

            <Text
                content={`Then, inside main(), before creating your plots, add:`}
                code={`rcParams["font.family"] = "serif"
rcParams["font.serif"] = ["Merriweather"]`}
            />

            <Text
                content={`This tells matplotlib to use a serif font, and to prioritise Merriweather if it is available on your system.`}
            />

            <Text
                content={`If you have Merriweather installed, all text in your chart (titles, labels, ticks) will now use it automatically.

If not, matplotlib will fall back to a default serif font. If you don't have Merriweather installed, try Times New Roman on Windows, or New York on macOS.`}
            />

            <Text
                content={`At this point, your chart styling is starting to become consistent:`}
                bullets={[
                    "colours match your design system",
                    "layout is structured properly",
                    "typography is aligned with your site",
                ]}
            />

            <Text
                content={`This is the foundation for building reusable, production ready charts, which we will do next.`}
            />

            <Text
                heading="Adding a Watermark"
                content={`
Before we move into reusable chart templates, let's introduce one more feature that is useful for publication quality charts: a watermark.

A watermark allows you to subtly brand your charts, which is especially useful if you are sharing them online or embedding them in articles.

We will add a small, semi transparent logo to the chart using matplotlib's annotation tools.
`}
            />

            <Text
                content={`
First, we need a helper function that loads an image and places it inside the axes.

Add this function near the top of your script:
`}
                code={`from matplotlib.offsetbox import OffsetImage, AnnotationBbox
import matplotlib.image as mpimg

DEFAULT_LOGO_PATH = "logo.png"

def add_logo_watermark(ax, logo_path=DEFAULT_LOGO_PATH, zoom=0.6, alpha=0.12):
    image = mpimg.imread(logo_path)
    imagebox = OffsetImage(image, zoom=zoom, alpha=alpha)

    ab = AnnotationBbox(
        imagebox,
        (0.98, 0.02),
        xycoords="axes fraction",
        box_alignment=(1, 0),
        frameon=False,
        zorder=10
    )

    ax.add_artist(ab)`}
            />

            <Text
                content={`Let's break that down:`}
                bullets={[
                    "OffsetImage loads and scales the image",
                    "AnnotationBbox positions it relative to the axes",
                    "xycoords='axes fraction' means the position is relative to the chart area",
                    "box_alignment=(1, 0) anchors the watermark by its bottom right corner",
                    "zorder=10 draws the watermark above the chart elements",
                    "alpha controls transparency so the watermark does not distract from the data",
                ]}
            />

            <Text
                content={`You can adjust the position by changing the coordinates:`}
                bullets={[
                    "(0.5, 0.5) -> centre",
                    "(0.98, 0.02) -> bottom right",
                    "(0.1, 0.9) -> top left",
                ]}
            />

            <Text
                content={`Now that we have the tools for making really well refined charts, we can integrate it into a reusable chart styling system.`}
            />

            <Text
                content={`
Now let's actually use the helper in a chart.

Add the watermark after your axes have been created and styled. In this case, place it directly after setting the axes face colours:
`}
            />

            <Text
                code={`add_logo_watermark(ax1)
add_logo_watermark(ax2)`}
            />

            <Text
                content={`Each subplot is its own axes, so the watermark must be added to both ax1 and ax2 if you want it to appear on both panels.

Run the script again, and both panels should now display a subtle watermark in the lower right corner.`}
            />

            <ImageBlock src={multiPanelWatermarks} alt="Chart with watermarks on both panels" className="w-full" />

            <Text
                lead="Code checkpoint:"
                code={`import matplotlib.pyplot as plt
import numpy as np
from matplotlib import rcParams

from matplotlib.offsetbox import OffsetImage, AnnotationBbox
import matplotlib.image as mpimg

DEFAULT_LOGO_PATH = "logo.png"

def add_logo_watermark(ax, logo_path=DEFAULT_LOGO_PATH, zoom=0.6, alpha=0.12):
    image = mpimg.imread(logo_path)
    imagebox = OffsetImage(image, zoom=zoom, alpha=alpha)

    ab = AnnotationBbox(
        imagebox,
        (0.98, 0.02),
        xycoords="axes fraction",
        box_alignment=(1, 0),
        frameon=False,
        zorder=10
    )

    ax.add_artist(ab)

def main():

    rcParams["font.family"] = "serif"
    rcParams["font.serif"] = ["Times New Roman"]

    # Sample data
    days = np.arange(1, 11)
    prices = [100, 102, 101, 105, 107, 106, 108, 110, 109, 111]
    volume = [200, 220, 210, 300, 280, 260, 290, 310, 305, 320]

    fig, (ax1, ax2) = plt.subplots(nrows=2, sharex=True)

    ax1.plot(days, prices, color="#3FC083", linewidth=2)
    ax2.bar(days, volume, color="#EEEFE6")

    ax1.set_title("Price and Volume")
    ax1.set_ylabel("Price ($)")
    ax2.set_ylabel("Volume")
    ax2.set_xlabel("Day")

    fig.patch.set_facecolor("#FDFBF7")

    ax1.set_facecolor("#FDFBF7")
    ax2.set_facecolor("#FDFBF7")

    add_logo_watermark(ax1)
    add_logo_watermark(ax2)

    ax1.tick_params(colors="#0E0C21")
    ax2.tick_params(colors="#0E0C21")

    ax1.grid(True)

    plt.tight_layout()

    plt.show()

if __name__ == "__main__":
    main()`}
            />

            <div id="reusable-chart-templates" />
            <Text
                heading="3. Building Reusable Chart Templates"
                content={`So far, we have learned how to build charts step by step.

That is important when you are learning matplotlib, but once you understand the basics, you usually do not want to rebuild every chart from scratch.

A better approach is to define a reusable style first, then keep a few chart templates that you can copy and modify.

The same reusability principles apply here:`}
                bullets={[
                    "Define your visual style once, so it is easier to debug and maintain",
                    "Reuse it across different chart types",
                    "Swap in new data as needed",
                ]}
            />

            <Text
                content={`I'll give you some code snippets that you can easily adapt and reuse.`}
            />

            <Text
                heading="Define a Reusable Style"
                content={`Start by defining your chart colours in one place.

This makes the rest of your chart code easier to read and easier to maintain.

Instead of scattering colour codes throughout your script, you can give each one a meaningful name and reuse it everywhere.

This example uses ThePortfolioLab colours, but you can change these values to match your own project style.`}
            />

            <Text
                content={`After that, we define a reusable matplotlib style function.

This sets the default appearance of your charts, so later chart functions do not need to repeat basic styling setup.`}
            />

            <Text
                lead="Copy this function and boilerplate into a new script:"
                code={`import matplotlib.pyplot as plt
import numpy as np
import matplotlib.image as mpimg
from cycler import cycler
from matplotlib.offsetbox import OffsetImage, AnnotationBbox

COLORS = {
    "bg": "#FDFBF7",
    "fg": "#0E0C21",
    "accent": "#3FC083",
    "secondary_bg": "#EEEFE6",
    "muted_fg": "#464F54",
    "link": "#0A95FF",
    "border": "#464F54",
}

# Default logo path (can be overridden per chart if needed)
DEFAULT_LOGO_PATH = "logo.png"

def add_logo_watermark(ax, logo_path=DEFAULT_LOGO_PATH, zoom=0.6, alpha=0.12):
    # logo_path remains configurable so you can swap different watermarks if required
    image = mpimg.imread(logo_path)
    imagebox = OffsetImage(image, zoom=zoom, alpha=alpha)

    ab = AnnotationBbox(
        imagebox,
        (0.98, 0.02),
        xycoords="axes fraction",
        box_alignment=(1, 0),
        frameon=False,
        zorder=10
    )

    ax.add_artist(ab)

def setup_matplotlib_style():
    plt.rcParams["figure.figsize"] = (12, 7)
    plt.rcParams["figure.dpi"] = 100
    plt.rcParams["savefig.dpi"] = 100
    plt.rcParams["savefig.bbox"] = "tight"

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

    plt.rcParams["axes.prop_cycle"] = cycler(color=[
        COLORS["accent"],
        COLORS["link"],
        COLORS["muted_fg"],
        COLORS["secondary_bg"],
    ])

    # Grid disabled globally - handled explicitly per axis
    plt.rcParams["axes.grid"] = False
    plt.rcParams["axes.axisbelow"] = True
    plt.rcParams["grid.color"] = COLORS["border"]
    plt.rcParams["grid.alpha"] = 0.25
    plt.rcParams["grid.linestyle"] = "--"
    plt.rcParams["grid.linewidth"] = 0.8

def style_axes(fig, ax, grid=True, zero_line=False, watermark=True, watermark_path=DEFAULT_LOGO_PATH):
    fig.patch.set_facecolor(COLORS["bg"])
    ax.set_facecolor(COLORS["bg"])

    for spine in ax.spines.values():
        spine.set_color(COLORS["border"])

    ax.tick_params(colors=COLORS["fg"])

    # Horizontal grid only (default)
    ax.grid(grid, axis="y", linestyle="--", linewidth=0.8, alpha=0.25, color=COLORS["border"])

    if zero_line:
        ax.axhline(0, color=COLORS["fg"], linewidth=1.2, alpha=0.9, zorder=2)

    if watermark:
        add_logo_watermark(ax, logo_path=watermark_path)`}
            />

            <Text
                heading="Reusable Chart Functions"
                content={`Now that we have defined a reusable global style, we can build chart functions on top of it.

The goal is to avoid rewriting both plotting code and formatting code every time you want a new chart.

To do that, we will separate the chart system into three layers:`}
                bullets={[
                    "A global style function for matplotlib defaults",
                    "A reusable axes styling helper for chart level formatting",
                    "Simple chart functions that only need data, labels, and a few options",
                ]}
            />

            <Text
                content={`This makes the code much easier to reuse.

Instead of modifying the function body every time, you can usually just call the function with new data and labels.

If a chart type needs slightly different behaviour, such as a zero line or different grid settings, we can expose that through the method signature instead of rewriting the whole function.`}
            />

            <Text
                heading="Centralising Axes Formatting"
                content={`Global rcParams are useful, but they do not cover everything.

Some formatting is better applied directly to each axes object, because it depends on the chart being created.

For example:`}
                bullets={[
                    "whether gridlines are shown",
                    "whether to draw a zero line",
                    "whether to add a watermark",
                ]}
            />

            <Text
                content={`We already added a reusable style_axes() helper above.

This centralises the axes formatting that we want most charts to share.

That means the chart functions themselves can stay focused on:`}
                bullets={[
                    "what data is being plotted",
                    "which chart type is used",
                    "what title and labels should be shown",
                ]}
            />

            <Text
                heading="Reusable Chart Functions"
                content={`The chart functions below use a method signature so that you can paste them into a script and call them directly.

Each function accepts simple, common datatypes such as lists, NumPy arrays, and pandas Series.`}
            />

            <Text
                lead="Reusable chart functions:"
                code={`def line_chart(
    x,
    y,
    title,
    xlabel,
    ylabel,
    grid=True,
    watermark=True,
    watermark_path=DEFAULT_LOGO_PATH
):
    fig, ax = plt.subplots()
    style_axes(
        fig,
        ax,
        grid=grid,
        zero_line=False,
        watermark=watermark,
        watermark_path=watermark_path
    )

    ax.plot(x, y, color=COLORS["accent"], linewidth=2.4, zorder=3)

    ax.set_title(title)
    ax.set_xlabel(xlabel)
    ax.set_ylabel(ylabel)

    plt.tight_layout()
    plt.show()


def bar_chart(
    categories,
    values,
    title,
    xlabel,
    ylabel,
    grid=True,
    zero_line=True,
    watermark=True,
    watermark_path=DEFAULT_LOGO_PATH
):
    fig, ax = plt.subplots()
    style_axes(
        fig,
        ax,
        grid=grid,
        zero_line=zero_line,
        watermark=watermark,
        watermark_path=watermark_path
    )

    ax.bar(categories, values, color=COLORS["accent"], alpha=0.9, zorder=3)

    ax.set_title(title)
    ax.set_xlabel(xlabel)
    ax.set_ylabel(ylabel)

    plt.tight_layout()
    plt.show()


def scatter_chart(
    x,
    y,
    title,
    xlabel,
    ylabel,
    grid=True,
    zero_line=True,
    watermark=True,
    watermark_path=DEFAULT_LOGO_PATH
):
    fig, ax = plt.subplots()
    style_axes(
        fig,
        ax,
        grid=grid,
        zero_line=zero_line,
        watermark=watermark,
        watermark_path=watermark_path
    )

    ax.scatter(x, y, s=90, alpha=0.85, color=COLORS["accent"], zorder=3)

    ax.set_title(title)
    ax.set_xlabel(xlabel)
    ax.set_ylabel(ylabel)

    plt.tight_layout()
    plt.show()`}
            />

            <Text
                content={`These functions are designed to work with common data types:`}
                bullets={[
                    "Python lists",
                    "NumPy arrays",
                    "pandas Series in most cases",
                ]}
            />

            <Text
                content={`There are some common cases where they will not work without modification:`}
                bullets={[
                    "A full DataFrame instead of individual columns or series",
                    "x and y values with different lengths",
                    "Non numeric data passed into line or scatter charts",
                ]}
            />

            <Text
                content={`If you are working with pandas, you will usually pass columns like:`}
                code={`df["date"], df["close"], df["volume"]`}
            />

            <Text
                lead={`Here is an example main() function that calls all three chart templates:`}
                code={`import numpy as np

def main():
    setup_matplotlib_style()

    # Sample data
    days = np.arange(1, 11)
    prices = [100, 102, 101, 105, 107, 106, 108, 110, 109, 111]
    volume = [200, 220, 210, 300, 280, 260, 290, 310, 305, 320]

    line_chart(
        x=days,
        y=prices,
        title="Stock Price Over Time",
        xlabel="Day",
        ylabel="Price ($)",
        grid=True
    )

    bar_chart(
        categories=days,
        values=volume,
        title="Volume by Day",
        xlabel="Day",
        ylabel="Volume",
        zero_line=True
    )

    scatter_chart(
        x=days,
        y=prices,
        title="Price Distribution",
        xlabel="Day",
        ylabel="Price ($)",
        grid=True,
        zero_line=False
    )

if __name__ == "__main__":
    main()`}
            />

            <Text
                heading="When Should You Adjust the Function?"
                content={`This structure is reusable, but not every chart should be forced into one generic template.

If you often make one particular chart with extra features, such as:`}
                bullets={[
                    "custom tick formatting",
                    "special annotations",
                    "different colours",
                    "direct labels instead of a legend",
                ]}
            />

            <Text
                content={`then it is completely reasonable to make a dedicated copy of that chart function and customise it.

That is often a better choice than trying to overload one function with too many arguments.

A good rule is:`}
                bullets={[
                    "use a shared template for common charts",
                    "make a separate copy when a chart becomes specialised",
                ]}
            />

            <Text
                content={`For example, a plain line chart template is great for many uses.

But if you often create equity curves with direct labels and special formatting, you may want a separate equity_curve_chart() function instead of forcing all of that into line_chart().`}
            />

            <Text
                content={`One limitation of these simple chart helpers is that they handle figure creation, styling, and display internally.

That makes them easy to reuse, but it also means you have less control after the chart has been created.

For example, if you want to:`}
                bullets={[
                    "set custom x or y axis limits",
                    "add special annotations",
                    "adjust tick locations or formatting",
                    "highlight one specific region of the chart",
                ]}
            />

            <Text
                content={`then the cleanest solution is usually not to overload the shared chart function.

Instead, make a dedicated variation of that chart function for the specific chart you need.

This keeps your common templates simple and reusable, while still giving you room to build more specialised charts when the situation calls for it.`}
            />

            <Text
                heading="Creating a Custom Chart Variation"
                content={`If you need more control, make a dedicated variation of the chart function instead of forcing every option into the shared template.

For example, here is a custom scatter chart that enables vertical grid lines as well:`}
            />

            <Text
                code={`def scatter_chart_with_vertical_grid(
    x,
    y,
    title,
    xlabel,
    ylabel,
    watermark=True,
    watermark_path=DEFAULT_LOGO_PATH
):
    fig, ax = plt.subplots()

    style_axes(
        fig,
        ax,
        grid=True,
        zero_line=False,
        watermark=watermark,
        watermark_path=watermark_path
    )

    # Add vertical grid lines in addition to the default horizontal ones
    ax.xaxis.grid(True, linestyle="--", linewidth=0.8, alpha=0.25)

    ax.scatter(x, y, s=90, alpha=0.85, color=COLORS["accent"], zorder=3)

    ax.set_title(title)
    ax.set_xlabel(xlabel)
    ax.set_ylabel(ylabel)

    plt.tight_layout()
    plt.show()`}
            />

            <Text
                content={`Notice that this custom function has a different method signature from the original scatter_chart() helper.

The original version accepted options like grid and zero_line, but this custom version removes those and instead hardcodes its own behaviour internally.

That means you do not replace the old scatter_chart() call with the exact same arguments. You need to add a new function call that matches this new signature.`}
            />
            <Text
                content={`Because this version only expects:`}
                bullets={[
                    "x",
                    "y",
                    "title",
                    "xlabel",
                    "ylabel",
                    "optional watermark arguments",
                ]}
            />
            <Text
                content={`your main() function needs a slightly different call for this chart variation.`}
            />
            <Text
                content={`For example, if you want to test this custom chart in main(), add a new call like this:`}
                code={`scatter_chart_with_vertical_grid(
    x=days,
    y=prices,
    title="Price Distribution with Vertical Grid",
    xlabel="Day",
    ylabel="Price ($)"
)`}
            />
            <Text
                content={`So the important idea is:

the custom chart variation is a new function with a new interface. When you create one of these specialised helpers, you should also update main() so that the function is called with the parameters it now expects.`}
            />
            <Text
                content={`Here is what that would look like inside the example main() function:`}
                code={`def main():
    setup_matplotlib_style()

    # Sample data
    days = np.arange(1, 11)
    prices = [100, 102, 101, 105, 107, 106, 108, 110, 109, 111]
    volume = [200, 220, 210, 300, 280, 260, 290, 310, 305, 320]

    line_chart(
        x=days,
        y=prices,
        title="Stock Price Over Time",
        xlabel="Day",
        ylabel="Price ($)",
        grid=True
    )

    bar_chart(
        categories=days,
        values=volume,
        title="Volume by Day",
        xlabel="Day",
        ylabel="Volume",
        zero_line=True
    )

    scatter_chart_with_vertical_grid(
        x=days,
        y=prices,
        title="Price Distribution with Vertical Grid",
        xlabel="Day",
        ylabel="Price ($)"
    )`}
            />

            <Text
                content={`This approach is usually better than turning one simple reusable function into a huge generic system.

A good shared template should handle the common case well.

When a chart becomes more specialised, make a specialised function for it.`}
            />

            <Text
                content={`With this setup, your workflow becomes much simpler.

You define the global style once, reuse shared axes formatting through a helper, and keep the chart functions focused on the data and labels.

That gives you a good balance between:`}
                bullets={[
                    "reusability",
                    "clarity",
                    "flexibility",
                ]}
            />

            <Text
                heading="Next Steps"
                content={`In this tutorial, you moved beyond basic plotting and started building charts with structure.

You learned how to:
`}
                bullets={[
                    "take control of axes instead of relying on pyplot defaults",
                    "separate datasets properly with twin axes and subplots",
                    "improve readability through layering and styling",
                    "apply consistent typography, colours, and watermarking",
                    "build reusable chart helpers instead of rewriting everything from scratch",
                ]}
            />

            <Text
                content={`That is a major shift.

You are no longer just making charts. You are starting to build a charting workflow.`}
            />

            <Text
                heading="Experimentation Ideas"
                content={`Before moving on, spend a little time experimenting with the code you now have.`}
                bullets={[
                    "change the colours and background values to match another project style",
                    "move the watermark to a different corner and test a different zoom value",
                    "turn one of the simple chart helpers into a dedicated chart for your own work",
                    "try replacing the sample data with a pandas Series from a real dataset",
                    "test how the same styling behaves on a wider or narrower figure size",
                ]}
            />

            <Text
                lead="Challenge"
                content={`As a small challenge, create your own reusable equity curve chart.

Try to include:
`}
                bullets={[
                    "a line chart using the same style system",
                    "a zero line if it makes sense for your data",
                    "direct labels or annotations instead of a legend",
                    "a watermark and consistent ThePortfolioLab styling",
                ]}
            />

            <Text
                content={`If you can build that cleanly, you will have moved from following examples to adapting the system for your own analysis.

That is exactly the point of this tutorial series.`}
            />

            <Text
                lead="Where to Go Next"
                content={
                    <>
                        The next step is to start applying this chart structure to real analysis work. If you need to revisit the foundations before that, go back to{" "}
                        <Link href="https://theportfoliolab.nz/tutorials/introduction-to-matplotlib-python-tutorial">
                            Introduction to Matplotlib (Python Tutorial)
                        </Link>.
                        <br />
                        <br />
                        That might mean:
                    </>
                }
                bullets={[
                    "using pandas data instead of toy arrays",
                    "adding custom tick formatting for dates, percentages, or currency",
                    "building more specialised chart helpers for recurring use cases",
                    "integrating these charts into your own articles, reports, or backtests",
                ]}
            />

            <Text
                content={`Once you reach that stage, matplotlib stops feeling like a plotting library and starts feeling like part of your analysis toolkit.`}
            />

        </Body>
    )
}
