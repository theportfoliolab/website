import matplotlib.pyplot as plt
import numpy as np
import matplotlib.image as mpimg
from cycler import cycler
from matplotlib.offsetbox import OffsetImage, AnnotationBbox
from matplotlib.collections import LineCollection
from matplotlib.colors import to_rgb


COLORS = {
    "bg": "#FDFBF7",
    "fg": "#0E0C21",
    "accent": "#3FC083",
    "negative": "#D1495B",
    "secondary_bg": "#EEEFE6",
    "muted_fg": "#464F54",
    "link": "#0A95FF",
    "border": "#464F54",
}

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
        zorder=10,
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


def style_axes(fig, ax, grid=True, zero_line=False, watermark=True, watermark_path=DEFAULT_LOGO_PATH):
    fig.patch.set_facecolor(COLORS["bg"])
    ax.set_facecolor(COLORS["bg"])

    for spine in ax.spines.values():
        spine.set_color(COLORS["border"])

    ax.tick_params(colors=COLORS["fg"])
    ax.grid(
        grid,
        axis="y",
        linestyle="--",
        linewidth=0.8,
        alpha=0.25,
        color=COLORS["border"],
        zorder=1,
    )

    if zero_line:
        ax.axhline(
            0,
            color=COLORS["fg"],
            linewidth=1.4,
            alpha=0.95,
            zorder=5,
        )

    if watermark:
        add_logo_watermark(ax, logo_path=watermark_path)


def get_line_segment_values(y, color_values=None):
    """
    Return one value per line segment.

    If color_values is provided, each segment is coloured by the midpoint
    of adjacent colour-driving values. Otherwise, y is used.
    """
    y = np.asarray(y, dtype=float)

    if color_values is not None:
        color_values = np.asarray(color_values, dtype=float)
        return (color_values[:-1] + color_values[1:]) / 2

    return (y[:-1] + y[1:]) / 2


def build_line_segments(x, y):
    """
    Build matplotlib line segments from x/y data.
    """
    x = np.asarray(x, dtype=float)
    y = np.asarray(y, dtype=float)

    points = np.array([x, y]).T.reshape(-1, 1, 2)
    return np.concatenate([points[:-1], points[1:]], axis=1)


def normalise_range(values, sensitivity=0.75):
    """
    Normalise values into [0, 1] using the observed range.

    Lower sensitivity values (< 1) increase contrast so values spread
    more aggressively toward the extremes.
    """
    values = np.asarray(values, dtype=float)

    vmin = np.min(values)
    vmax = np.max(values)

    if np.isclose(vmin, vmax):
        return np.full_like(values, 0.5, dtype=float)

    scaled = (values - vmin) / (vmax - vmin)
    centered = (scaled - 0.5) * 2.0
    transformed = np.sign(centered) * (np.abs(centered) ** sensitivity)
    return (transformed + 1.0) / 2.0


def blend_rgb(color_a, color_b, weight_a=0.5):
    """
    Blend two matplotlib-compatible colours in RGB space.
    """
    a = np.array(to_rgb(color_a))
    b = np.array(to_rgb(color_b))
    weight_b = 1.0 - weight_a
    return weight_a * a + weight_b * b


def get_bar_colors(values, positive_color=None, negative_color=None):
    """
    Return per-bar colours based on sign.
    """
    positive_color = positive_color or COLORS["accent"]
    negative_color = negative_color or COLORS["negative"]

    return [
        positive_color if value >= 0 else negative_color
        for value in values
    ]


def get_line_gradient_colors(values, sensitivity=0.75):
    """
    Create explicit blended colours for a line, mapped from:
    lowest value -> red
    highest value -> green
    """
    scaled = normalise_range(values, sensitivity=sensitivity)

    colors = []
    for w in scaled:
        color = blend_rgb(
            COLORS["negative"],
            COLORS["accent"],
            weight_a=1.0 - w,
        )
        colors.append(color)

    return colors


def add_gradient_line(
    ax,
    x,
    y,
    color_values=None,
    sensitivity=0.75,
    linewidth=3.2,
    alpha=1.0,
    zorder=3,
):
    """
    Add a line with explicit blended segment colours.

    Lowest observed value -> red
    Highest observed value -> green
    """
    x = np.asarray(x, dtype=float)
    y = np.asarray(y, dtype=float)

    if len(x) < 2 or len(y) < 2:
        ax.plot(x, y, color=COLORS["accent"], linewidth=linewidth, alpha=alpha, zorder=zorder)
        return

    segments = build_line_segments(x, y)
    segment_values = get_line_segment_values(y, color_values=color_values)

    if np.isclose(np.min(segment_values), np.max(segment_values)):
        ax.plot(x, y, color=COLORS["accent"], linewidth=linewidth, alpha=alpha, zorder=zorder)
        return

    segment_colors = get_line_gradient_colors(segment_values, sensitivity=sensitivity)

    lc = LineCollection(
        segments,
        colors=segment_colors,
        linewidths=linewidth,
        alpha=alpha,
        zorder=zorder,
        capstyle="round",
        joinstyle="round",
    )
    ax.add_collection(lc)

    ax.set_xlim(np.min(x), np.max(x))
    ax.set_ylim(np.min(y), np.max(y))


def get_bivariate_scatter_colors(
    x_values,
    y_values,
    x_sensitivity=0.75,
    y_sensitivity=0.75,
):
    """
    Create bivariate colours for scatter points.

    y-axis:
        low return -> red
        high return -> green

    x-axis:
        low volatility -> muted neutral
        high volatility -> blue
    """
    x_values = np.asarray(x_values, dtype=float)
    y_values = np.asarray(y_values, dtype=float)

    x_norm = normalise_range(x_values, sensitivity=x_sensitivity)
    y_norm = normalise_range(y_values, sensitivity=y_sensitivity)

    colors = []
    for xw, yw in zip(x_norm, y_norm):
        return_color = blend_rgb(
            COLORS["negative"],
            COLORS["accent"],
            weight_a=1.0 - yw,
        )

        risk_color = blend_rgb(
            COLORS["muted_fg"],
            COLORS["link"],
            weight_a=1.0 - xw,
        )

        final_color = 0.68 * return_color + 0.32 * risk_color
        colors.append(final_color)

    return colors


def line_chart(
    x,
    y,
    title,
    xlabel,
    ylabel,
    grid=True,
    watermark=True,
    watermark_path=DEFAULT_LOGO_PATH,
    use_gradient=False,
    color_values=None,
    color_sensitivity=0.75,
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

    if use_gradient:
        add_gradient_line(
            ax=ax,
            x=x,
            y=y,
            color_values=color_values,
            sensitivity=color_sensitivity,
            linewidth=3.2,
            alpha=1.0,
            zorder=3,
        )
    else:
        ax.plot(x, y, color=COLORS["accent"], linewidth=2.8, zorder=3)

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
    watermark_path=DEFAULT_LOGO_PATH,
    color_mode="sign",
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

    if color_mode == "sign":
        bar_colors = get_bar_colors(values)
    else:
        bar_colors = [COLORS["accent"]] * len(values)

    ax.bar(categories, values, color=bar_colors, alpha=0.9, zorder=3)

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
    point_size=140,
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
        s=point_size,
        alpha=0.95,
        color=COLORS["accent"],
        edgecolors=COLORS["bg"],
        linewidths=1.0,
        zorder=3,
    )

    ax.set_title(title)
    ax.set_xlabel(xlabel)
    ax.set_ylabel(ylabel)

    plt.tight_layout()
    plt.show()


def scatter_chart_bivariate(
    x,
    y,
    title,
    xlabel,
    ylabel,
    grid=True,
    zero_line=True,
    watermark=True,
    watermark_path=DEFAULT_LOGO_PATH,
    return_sensitivity=0.75,
    risk_sensitivity=0.75,
    point_size=190,
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

    point_colors = get_bivariate_scatter_colors(
        x_values=x,
        y_values=y,
        x_sensitivity=risk_sensitivity,
        y_sensitivity=return_sensitivity,
    )

    ax.scatter(
        x,
        y,
        s=point_size,
        alpha=0.95,
        color=point_colors,
        edgecolors=COLORS["bg"],
        linewidths=1.0,
        zorder=3,
    )

    ax.set_title(title)
    ax.set_xlabel(xlabel)
    ax.set_ylabel(ylabel)

    plt.tight_layout()
    plt.show()


def main():
    setup_matplotlib_style()

    np.random.seed(42)

    # --- Equity curve: strong rise, sharp drawdown, base, breakout ---
    days = np.arange(1, 121)

    regime_1 = np.random.normal(0.0042, 0.007, 28)
    regime_2 = np.random.normal(0.0008, 0.006, 12)
    regime_3 = np.random.normal(-0.0062, 0.010, 24)
    regime_4 = np.random.normal(0.0012, 0.007, 18)
    regime_5 = np.random.normal(0.0048, 0.008, 38)

    period_returns = np.concatenate([regime_1, regime_2, regime_3, regime_4, regime_5])
    portfolio_values = 10000 * np.cumprod(1 + period_returns)

    months = [f"M{i}" for i in range(1, 13)]
    strategy_returns = [
        period_returns[i * 10:(i + 1) * 10].sum() * 100
        for i in range(12)
    ]

    # --- Scatter: shaped clusters + standout points ---
    risk_low = np.random.normal(9.2, 0.6, 9)
    ret_low = np.random.normal(2.6, 0.8, 9)

    risk_mid = np.random.normal(12.5, 0.8, 10)
    ret_mid = np.random.normal(5.1, 1.3, 10)

    risk_high = np.random.normal(16.6, 0.7, 8)
    ret_high = np.random.normal(1.4, 2.4, 8)

    risk_outliers = np.array([15.2, 17.8, 14.9, 11.1])
    ret_outliers = np.array([10.4, 6.1, -2.2, 8.0])

    risk = np.concatenate([risk_low, risk_mid, risk_high, risk_outliers])
    returns_scatter = np.concatenate([ret_low, ret_mid, ret_high, ret_outliers])

    risk = np.clip(risk, 8.0, 18.5)
    returns_scatter = np.clip(returns_scatter, -4.5, 10.5)

    line_chart(
        x=days,
        y=portfolio_values,
        title="Strategy Equity Curve",
        xlabel="Time",
        ylabel="Portfolio Value ($)",
        grid=True,
        use_gradient=True,
        color_values=period_returns,
        color_sensitivity=0.65,
    )

    bar_chart(
        categories=months,
        values=strategy_returns,
        title="Rolling Period Returns",
        xlabel="Period",
        ylabel="Return (%)",
        grid=True,
        zero_line=True,
        color_mode="sign",
    )

    scatter_chart_bivariate(
        x=risk,
        y=returns_scatter,
        title="Risk vs Return Across Strategies",
        xlabel="Volatility (%)",
        ylabel="Return (%)",
        grid=True,
        zero_line=True,
        return_sensitivity=0.65,
        risk_sensitivity=0.75,
        point_size=190,
    )


if __name__ == "__main__":
    main()