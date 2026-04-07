import matplotlib.pyplot as plt
from cycler import cycler


COLORS = {
    "bg": "#FDFBF7",
    "fg": "#0E0C21",
    "accent": "#3FC083",
    "benchmark": "#0A95FF",
    "border": "#464F54",
}

SERIES_COLORS = [
    "#3FC083",
    "#0A95FF",
    "#FF8A65",
    "#7E57C2",
    "#26A69A",
    "#EC407A",
    "#AB47BC",
    "#FFA726",
]

def setup_matplotlib_style():
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

    plt.rcParams["axes.prop_cycle"] = cycler(color=SERIES_COLORS)

    plt.rcParams["axes.grid"] = False
    plt.rcParams["axes.axisbelow"] = True
    plt.rcParams["grid.color"] = COLORS["border"]
    plt.rcParams["grid.alpha"] = 0.25
    plt.rcParams["grid.linestyle"] = "--"
    plt.rcParams["grid.linewidth"] = 0.8

def style_axes(fig, ax, grid=True, zero_line=False):
    fig.patch.set_facecolor(COLORS["bg"])
    ax.set_facecolor(COLORS["bg"])

    for spine in ax.spines.values():
        spine.set_color(COLORS["border"])

    ax.tick_params(colors=COLORS["fg"])

    if grid:
        ax.grid(
            True,
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
            linewidth=1.2,
            alpha=0.9,
            zorder=2,
        )

from pathlib import Path
from analytics.calculations import cumulative_growth

def plot_cumulative_performance(df, save_path: str | None = None):
    fig, ax = plt.subplots()
    style_axes(fig, ax, grid=True, zero_line=False)

    # Plot each fund
    for fund_name, group in df.groupby("fund_name"):
        group = group.sort_values("date")

        fund_cum = cumulative_growth(group["fund"])

        ax.plot(
            group["date"],
            fund_cum,
            linewidth=2.2,
            zorder=3,
            label=fund_name,
        )

    # Plot benchmark (assumes shared benchmark across funds)
    benchmark_series = df.sort_values("date").drop_duplicates("date")
    benchmark_cum = cumulative_growth(benchmark_series["benchmark"])

    ax.plot(
        benchmark_series["date"],
        benchmark_cum,
        linewidth=2.8,
        linestyle="--",
        color=COLORS["benchmark"],
        zorder=5,
        label="Benchmark",
    )

    ax.set_title("Fund Performance Comparison")
    ax.set_xlabel("Date")
    ax.set_ylabel("Growth Index")
    ax.legend(frameon=False)

    plt.tight_layout()

    if save_path:
        output_path = Path(save_path)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        plt.savefig(output_path, dpi=150)
        print(f"\nChart saved to: {output_path}")

    plt.show()

def plot_drawdown(dates, fund_drawdown):
    fig, ax = plt.subplots()
    style_axes(fig, ax, grid=True, zero_line=True)

    ax.plot(dates, fund_drawdown, color=COLORS["accent"], linewidth=2.4, zorder=3)

    ax.set_title("Drawdown")
    ax.set_xlabel("Date")
    ax.set_ylabel("Drawdown")

    plt.tight_layout()
    plt.show()

def plot_excess_return(dates, excess_returns):
    fig, ax = plt.subplots()
    style_axes(fig, ax, grid=True, zero_line=True)

    ax.plot(dates, excess_returns, color=COLORS["accent"], linewidth=2.4, zorder=3)

    ax.set_title("Excess Return vs Benchmark")
    ax.set_xlabel("Date")
    ax.set_ylabel("Excess Return")

    plt.tight_layout()
    plt.show()