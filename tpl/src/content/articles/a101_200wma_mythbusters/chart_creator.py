from __future__ import annotations

from collections.abc import Mapping, Sequence

import matplotlib.image as mpimg
import matplotlib.pyplot as plt
from matplotlib.ticker import FuncFormatter
from cycler import cycler
from matplotlib.offsetbox import AnnotationBbox, OffsetImage


COLORS = {
    "bg": "#FDFBF7",
    "fg": "#0E0C21",
    "accent": "#3FC083",
    "secondary_bg": "#EEEFE6",
    "muted_fg": "#464F54",
    "link": "#0A95FF",
    "border": "#464F54",
}

DEFAULT_LOGO_PATH = "logo.png"


def add_logo_watermark(
    ax,
    logo_path=DEFAULT_LOGO_PATH,
    zoom=0.6,
    alpha=0.12,
):
    image = mpimg.imread(logo_path)

    imagebox = OffsetImage(
        image,
        zoom=zoom,
        alpha=alpha,
    )

    watermark = AnnotationBbox(
        imagebox,
        (0.98, 0.02),
        xycoords="axes fraction",
        box_alignment=(1, 0),
        frameon=False,
        zorder=10,
    )

    ax.add_artist(watermark)


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

    plt.rcParams["font.family"] = [
        "Merriweather",
        "DejaVu Serif",
    ]
    plt.rcParams["font.size"] = 11
    plt.rcParams["axes.titlesize"] = 16
    plt.rcParams["axes.labelsize"] = 12

    plt.rcParams["axes.prop_cycle"] = cycler(
        color=[
            COLORS["accent"],
            COLORS["link"],
            COLORS["muted_fg"],
            COLORS["secondary_bg"],
        ]
    )

    plt.rcParams["axes.grid"] = False
    plt.rcParams["axes.axisbelow"] = True

    plt.rcParams["grid.color"] = COLORS["border"]
    plt.rcParams["grid.alpha"] = 0.25
    plt.rcParams["grid.linestyle"] = "--"
    plt.rcParams["grid.linewidth"] = 0.8


def style_axes(
    fig,
    ax,
    grid=True,
    zero_line=False,
    watermark=True,
    watermark_path=DEFAULT_LOGO_PATH,
):
    fig.patch.set_facecolor(COLORS["bg"])
    ax.set_facecolor(COLORS["bg"])

    for spine in ax.spines.values():
        spine.set_color(COLORS["border"])

    ax.tick_params(
        colors=COLORS["fg"]
    )

    ax.grid(
        grid,
        axis="y",
        linestyle="--",
        linewidth=0.8,
        alpha=0.25,
        color=COLORS["border"],
    )

    if zero_line:
        ax.axhline(
            0,
            color=COLORS["fg"],
            linewidth=1.2,
            alpha=0.9,
            zorder=2,
        )

    if watermark:
        add_logo_watermark(
            ax,
            logo_path=watermark_path,
        )


def line_chart(
    x,
    y,
    title,
    xlabel,
    ylabel,
    label=None,
    grid=True,
    watermark=True,
    watermark_path=DEFAULT_LOGO_PATH,
):
    fig, ax = plt.subplots()

    style_axes(
        fig,
        ax,
        grid=grid,
        zero_line=False,
        watermark=watermark,
        watermark_path=watermark_path,
    )

    ax.plot(
        x,
        y,
        linewidth=2.4,
        label=label,
        zorder=3,
    )

    ax.set_title(title)
    ax.set_xlabel(xlabel)
    ax.set_ylabel(ylabel)

    if label is not None:
        ax.legend()

    plt.tight_layout()
    plt.show()


def multi_line_chart(
    x,
    series: Mapping[str, Sequence],
    title,
    xlabel,
    ylabel,
    grid=True,
    watermark=True,
    watermark_path=DEFAULT_LOGO_PATH,
):
    """
    Plot multiple labelled series against the same x-axis.

    Example:
        {
            "Strategy": strategy_values,
            "SPY": benchmark_values,
        }
    """

    fig, ax = plt.subplots()

    style_axes(
        fig,
        ax,
        grid=grid,
        zero_line=False,
        watermark=watermark,
        watermark_path=watermark_path,
    )

    for label, values in series.items():
        ax.plot(
            x,
            values,
            linewidth=2.4,
            label=label,
            zorder=3,
        )

    ax.set_title(title)
    ax.set_xlabel(xlabel)
    ax.set_ylabel(ylabel)

    ax.legend()

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
    watermark_path=DEFAULT_LOGO_PATH,
):
    fig, ax = plt.subplots()

    style_axes(
        fig,
        ax,
        grid=grid,
        zero_line=zero_line,
        watermark=watermark,
        watermark_path=watermark_path,
    )

    ax.bar(
        categories,
        values,
        color=COLORS["accent"],
        alpha=0.9,
        zorder=3,
    )

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
    watermark_path=DEFAULT_LOGO_PATH,
):
    fig, ax = plt.subplots()

    style_axes(
        fig,
        ax,
        grid=grid,
        zero_line=zero_line,
        watermark=watermark,
        watermark_path=watermark_path,
    )

    ax.scatter(
        x,
        y,
        s=90,
        alpha=0.85,
        color=COLORS["accent"],
        zorder=3,
    )

    ax.set_title(title)
    ax.set_xlabel(xlabel)
    ax.set_ylabel(ylabel)

    plt.tight_layout()
    plt.show()
    

def stacked_area_chart(
    x,
    series: Mapping[str, Sequence],
    title,
    xlabel,
    ylabel,
    grid=True,
    watermark=True,
    watermark_path=DEFAULT_LOGO_PATH,
    event_x=None,
    event_y=None,
    event_label="Purchase event",
):
    """
    Plot a stacked area chart for multiple labelled series.

    The order of the series is preserved, so the first series
    forms the base area, the second is stacked above it, and so on.
    Optional event markers can be overlaid for clarity.
    """

    fig, ax = plt.subplots()

    style_axes(
        fig,
        ax,
        grid=grid,
        zero_line=False,
        watermark=watermark,
        watermark_path=watermark_path,
    )

    labels = list(series.keys())
    values = [series[label] for label in labels]

    colours = [
        COLORS["accent"],
        COLORS["secondary_bg"],
        COLORS["link"],
        COLORS["muted_fg"],
    ][: len(labels)]

    ax.stackplot(
        x,
        *values,
        labels=labels,
        colors=colours,
        alpha=0.85,
        zorder=2,
    )

    if event_x is not None and event_y is not None:
        ax.scatter(
            event_x,
            event_y,
            s=28,
            color=COLORS["fg"],
            alpha=0.9,
            zorder=4,
            label=event_label,
        )

    ax.set_title(title)
    ax.set_xlabel(xlabel)
    ax.set_ylabel(ylabel)
    ax.legend()

    plt.tight_layout()
    plt.show()
    
def capital_allocation_chart(
    dates,
    deployed,
    cash,
    purchase_dates=None,
    title="How the strategy deployed contributed capital",
    watermark=True,
    watermark_path=DEFAULT_LOGO_PATH,
):
    total = deployed + cash

    fig, ax = plt.subplots()

    style_axes(
        fig,
        ax,
        grid=True,
        zero_line=False,
        watermark=watermark,
        watermark_path=watermark_path,
    )

    # Cash forms the bottom layer
    ax.fill_between(
        dates,
        0,
        cash,
        step="post",
        color=COLORS["muted_fg"],
        alpha=0.9,
        label="Cash awaiting investment",
        zorder=2,
    )

    # Deployed capital is stacked above cash
    ax.fill_between(
        dates,
        cash,
        total,
        step="post",
        color=COLORS["accent"],
        alpha=0.8,
        label="Capital deployed",
        zorder=2,
    )

    ax.set_title(title)
    ax.set_xlabel("Date")
    ax.set_ylabel("Capital ($)")

    ax.legend(
        loc="upper left"
    )

    plt.tight_layout()
    plt.show()
    
def capital_state_chart(
    dates,
    deployed,
    cash,
    deployed_scale=0.25,
    title="Deployment Of Capital",
    watermark=True,
    watermark_path=DEFAULT_LOGO_PATH,
):
    scaled_deployed = deployed * deployed_scale

    fig, ax = plt.subplots()

    style_axes(
        fig,
        ax,
        grid=True,
        zero_line=False,
        watermark=watermark,
        watermark_path=watermark_path,
    )

    # Cash awaiting investment, above the centre line.
    ax.fill_between(
        dates,
        0,
        cash,
        step="post",
        color=COLORS["muted_fg"],
        alpha=0.9,
        label="Cash awaiting investment",
        zorder=2,
    )

    # Capital already deployed, below the centre line.
    # Negative values are only used to position the series visually.
    ax.fill_between(
        dates,
        0,
        -(deployed * deployed_scale),
        step="post",
        color=COLORS["accent"],
        alpha=0.9,
        label=(
            f"Capital deployed "
            f"(shown at {deployed_scale:.0%} scale)"
        ),
        zorder=2,
    )

    # Strong visual boundary between the two capital states.
    ax.axhline(
        0,
        color=COLORS["fg"],
        linewidth=1.4,
        zorder=4,
    )

    # Display both halves as positive dollar values.
    ax.yaxis.set_major_formatter(
        FuncFormatter(
            lambda value, _: f"{abs(value):,.0f}"
        )
    )

    ax.set_title(title)
    ax.set_xlabel("Date")
    ax.set_ylabel("Capital ($)")

    ax.legend(
        loc="upper left"
    )

    plt.tight_layout()
    plt.show()