import matplotlib.pyplot as plt
import matplotlib.image as mpimg
from cycler import cycler
from matplotlib.offsetbox import OffsetImage, AnnotationBbox
from matplotlib.ticker import FuncFormatter


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

NOTE_STYLE = {
    "color": COLORS["muted_fg"],
    "fontsize": 10,
}


def format_compact_currency(value, _position=None):
    if abs(value) >= 1_000_000:
        return f"${value / 1_000_000:.1f}m"

    if abs(value) >= 1_000:
        return f"${value / 1_000:.0f}k"

    return f"${value:.0f}"


def format_whole_percent(value, _position=None):
    return f"{value:.0f}%"


def apply_compact_currency_axis(ax, axis="y"):
    formatter = FuncFormatter(format_compact_currency)

    if axis == "x":
        ax.xaxis.set_major_formatter(formatter)
    else:
        ax.yaxis.set_major_formatter(formatter)


def apply_whole_percent_axis(ax, axis="y"):
    formatter = FuncFormatter(format_whole_percent)

    if axis == "x":
        ax.xaxis.set_major_formatter(formatter)
    else:
        ax.yaxis.set_major_formatter(formatter)


def apply_month_ticks(ax, final_month):
    ticks = [0, 24, 48, 72, 96, 120, 144, 168]

    if final_month not in ticks:
        ticks.append(final_month)

    ax.set_xticks([tick for tick in ticks if tick <= final_month])


def inset_numeric_x_label_position(x_values, inset_share=0.10):
    return x_values[-1] - (x_values[-1] - x_values[0]) * inset_share


def add_logo_watermark(ax, logo_path=DEFAULT_LOGO_PATH, zoom=0.6, alpha=0.12):
    image = mpimg.imread(logo_path)
    imagebox = OffsetImage(image, zoom=zoom, alpha=alpha)

    ab = AnnotationBbox(
        imagebox,
        (0.98, 0.02),
        xycoords="axes fraction",
        box_alignment=(1, 0),
        frameon=False,
        zorder=10,
    )

    ax.add_artist(ab)


def setup_matplotlib_style():
    plt.rcParams["figure.figsize"] = (12, 7)
    plt.rcParams["figure.dpi"] = 100
    plt.rcParams["savefig.dpi"] = 100
    plt.rcParams["savefig.bbox"] = None

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
    plt.rcParams["xtick.labelsize"] = 10
    plt.rcParams["ytick.labelsize"] = 10
    plt.rcParams["axes.titlepad"] = 12

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

def simulated_paths_chart(
    x,
    paths,
    title,
    xlabel,
    ylabel,
    starting_value=None,
    grid=True,
    watermark=True,
    watermark_path=DEFAULT_LOGO_PATH,
    save_path=None,
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

    for path in paths:
        ax.plot(
            x,
            path,
            color=COLORS["accent"],
            linewidth=1.8,
            alpha=0.38,
            zorder=3,
        )

    if starting_value is not None:
        ax.axhline(
            starting_value,
            color=COLORS["muted_fg"],
            linewidth=1.3,
            linestyle="--",
            alpha=0.85,
            zorder=2,
        )

    all_values = [value for path in paths for value in path]
    lower = min(all_values)
    upper = max(all_values)
    padding = (upper - lower) * 0.12

    ax.set_ylim(
        max(0, lower - padding),
        upper + padding,
    )

    if starting_value is not None:
        ax.text(
            inset_numeric_x_label_position(x),
            starting_value - (upper - lower) * 0.02,
            "Starting value",
            va="top",
            ha="left",
            color=COLORS["muted_fg"],
            fontsize=10,
        )

    ax.set_title(title)
    ax.set_xlabel(xlabel)
    ax.set_ylabel(ylabel)
    apply_month_ticks(ax, x[-1])
    apply_compact_currency_axis(ax)

    plt.tight_layout()

    if save_path is not None:
        plt.savefig(save_path)

    plt.show()


def horizon_loss_chart(
    categories,
    values,
    title,
    xlabel,
    ylabel,
    grid=True,
    watermark=True,
    watermark_path=DEFAULT_LOGO_PATH,
    save_path=None,
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

    bars = ax.bar(
        categories,
        values,
        color=COLORS["accent"],
        alpha=0.9,
        zorder=3,
    )

    ax.set_ylim(0, max(values) * 1.25)

    for bar, value in zip(bars, values):
        ax.text(
            bar.get_x() + bar.get_width() / 2,
            bar.get_height(),
            f"{value:.0f}%",
            ha="center",
            va="bottom",
            color=COLORS["fg"],
            fontsize=10,
        )

    ax.set_title(title)
    ax.set_xlabel(xlabel)
    ax.set_ylabel(ylabel)
    apply_whole_percent_axis(ax)

    plt.tight_layout()

    if save_path is not None:
        plt.savefig(save_path)

    plt.show()


def horizon_range_chart(
    categories,
    p5_values,
    median_values,
    p95_values,
    starting_value,
    title,
    xlabel,
    ylabel,
    grid=True,
    watermark=True,
    watermark_path=DEFAULT_LOGO_PATH,
    save_path=None,
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

    x_positions = list(range(len(categories)))

    for x_pos, p5, median, p95 in zip(x_positions, p5_values, median_values, p95_values):
        ax.vlines(
            x=x_pos,
            ymin=p5,
            ymax=p95,
            color=COLORS["muted_fg"],
            linewidth=4,
            alpha=0.75,
            zorder=3,
        )

        ax.scatter(
            x_pos,
            median,
            color=COLORS["accent"],
            s=80,
            zorder=4,
        )

    ax.axhline(
        starting_value,
        color=COLORS["border"],
        linewidth=1.2,
        linestyle="--",
        alpha=0.8,
        zorder=2,
    )

    ax.text(
        x_positions[-1] - 0.35,
        starting_value,
        "Starting value",
        va="center",
        ha="left",
        color=COLORS["muted_fg"],
        fontsize=10,
    )

    ax.set_xticks(x_positions)
    ax.set_xticklabels(categories)

    lower = min(p5_values + [starting_value])
    upper = max(p95_values + [starting_value])
    padding = (upper - lower) * 0.12
    ax.set_ylim(lower - padding, upper + padding)

    ax.set_title(title)
    ax.set_xlabel(xlabel)
    ax.set_ylabel(ylabel)
    apply_compact_currency_axis(ax)

    ax.text(
        0.02,
        0.95,
        "Line shows 5th to 95th percentile range\nDot shows median final value",
        transform=ax.transAxes,
        va="top",
        ha="left",
        color=COLORS["muted_fg"],
        fontsize=10,
    )

    plt.tight_layout()

    if save_path is not None:
        plt.savefig(save_path)

    plt.show()


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

    ax.tick_params(colors=COLORS["fg"], labelsize=10)
    ax.grid(grid, axis="y", linestyle="--", linewidth=0.8, alpha=0.25, color=COLORS["border"])

    if zero_line:
        ax.axhline(0, color=COLORS["fg"], linewidth=1.2, alpha=0.9, zorder=2)

    if watermark:
        add_logo_watermark(ax, logo_path=watermark_path)


def line_chart(
    x,
    y,
    title,
    xlabel,
    ylabel,
    grid=True,
    watermark=True,
    watermark_path=DEFAULT_LOGO_PATH,
    y_min=None,
    y_max=None,
    reference_line=None,
    reference_label=None,
    save_path=None,
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

    ax.plot(x, y, color=COLORS["accent"], linewidth=2.4, zorder=3)

    if reference_line is not None:
        ax.axhline(
            reference_line,
            color=COLORS["muted_fg"],
            linewidth=1.3,
            linestyle="--",
            alpha=0.85,
            zorder=2,
        )

        if reference_label is not None:
            ax.text(
                inset_numeric_x_label_position(x),
                reference_line - (ax.get_ylim()[1] - ax.get_ylim()[0]) * 0.025,
                reference_label,
                va="top",
                ha="left",
                color=COLORS["muted_fg"],
                fontsize=10,
            )

    if y_min is not None or y_max is not None:
        ax.set_ylim(y_min, y_max)

    ax.set_title(title)
    ax.set_xlabel(xlabel)
    ax.set_ylabel(ylabel)
    if y_min == 0 and y_max == 1:
        ax.yaxis.set_major_formatter(FuncFormatter(lambda value, _pos: f"{value:.0%}"))

    plt.tight_layout()

    if save_path is not None:
        plt.savefig(save_path)

    plt.show()


def multi_line_chart(
    x,
    series,
    title,
    xlabel,
    ylabel,
    grid=True,
    watermark=True,
    watermark_path=DEFAULT_LOGO_PATH,
    y_min=None,
    y_max=None,
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

    for label, y in series.items():
        ax.plot(x, y, linewidth=2.2, zorder=3, label=label)

    if y_min is not None or y_max is not None:
        ax.set_ylim(y_min, y_max)

    ax.set_title(title)
    ax.set_xlabel(xlabel)
    ax.set_ylabel(ylabel)
    ax.legend(frameon=False)

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
    y_min=None,
    y_max=None,
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

    ax.bar(categories, values, color=COLORS["accent"], alpha=0.9, zorder=3)

    if y_min is not None or y_max is not None:
        ax.set_ylim(y_min, y_max)

    ax.set_title(title)
    ax.set_xlabel(xlabel)
    ax.set_ylabel(ylabel)

    plt.tight_layout()
    plt.show()


def histogram_chart(
    values,
    title,
    xlabel,
    ylabel,
    bins=30,
    grid=True,
    watermark=True,
    watermark_path=DEFAULT_LOGO_PATH,
    reference_line=None,
    reference_label=None,
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

    ax.hist(values, bins=bins, color=COLORS["accent"], alpha=0.85, zorder=3)

    if reference_line is not None:
        ax.axvline(
            reference_line,
            color=COLORS["muted_fg"],
            linewidth=1.3,
            linestyle="--",
            alpha=0.85,
            zorder=4,
        )

        if reference_label is not None:
            ax.text(
                reference_line,
                ax.get_ylim()[1] * 0.95,
                f" {reference_label}",
                va="top",
                ha="left",
                color=COLORS["muted_fg"],
                fontsize=10,
            )

    ax.set_title(title)
    ax.set_xlabel(xlabel)
    ax.set_ylabel(ylabel)

    plt.tight_layout()
    plt.show()
