import matplotlib.pyplot as plt
from cycler import cycler

COLORS = {
    "bg": "#FDFBF7",
    "fg": "#0E0C21",
    "accent": "#3FC083",
    "benchmark": "#0A95FF",
    "border": "#464F54",
}

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

    plt.rcParams["axes.prop_cycle"] = cycler(
        color=[COLORS["accent"], COLORS["benchmark"]]
    )

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


def plot_cumulative_performance(dates, fund_cumulative, benchmark_cumulative):
    fig, ax = plt.subplots()
    style_axes(fig, ax, grid=True, zero_line=False)

    ax.plot(dates, fund_cumulative, color=COLORS["accent"], linewidth=2.4, zorder=3, label="Fund")
    ax.plot(dates, benchmark_cumulative, color=COLORS["benchmark"], linewidth=2.2, zorder=3, label="Benchmark")

    ax.set_title("Cumulative Performance")
    ax.set_xlabel("Date")
    ax.set_ylabel("Growth Index")
    ax.legend(frameon=False)

    plt.tight_layout()
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