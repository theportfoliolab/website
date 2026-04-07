from pathlib import Path

import matplotlib.pyplot as plt
import pandas as pd
from cycler import cycler

from analytics.calculations import cumulative_growth, drawdown


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


def plot_cumulative_performance(
    df: pd.DataFrame,
    portfolio: pd.DataFrame | None = None,
    save_path: str | None = None,
) -> None:
    fig, ax = plt.subplots(figsize=(12, 7))
    style_axes(fig, ax, grid=True, zero_line=False)

    for fund_name, group in df.groupby("fund_name"):
        group = group.sort_values("date")
        fund_cum = cumulative_growth(group["fund"])

        ax.plot(
            group["date"],
            fund_cum,
            linewidth=2.0,
            alpha=0.85,
            zorder=3,
            label=fund_name,
        )

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

    if portfolio is not None:
        portfolio_series = portfolio.sort_values("date").reset_index(drop=True)
        portfolio_cum = cumulative_growth(portfolio_series["fund"])
        portfolio_name = portfolio_series["fund_name"].iloc[0]

        benchmark_for_portfolio = benchmark_series.set_index("date")["benchmark"].reindex(
            portfolio_series["date"]
        )
        benchmark_portfolio_cum = cumulative_growth(
            benchmark_for_portfolio.reset_index(drop=True)
        )
        portfolio_values = portfolio_cum.to_numpy()
        benchmark_values = benchmark_portfolio_cum.to_numpy()

        ax.fill_between(
            portfolio_series["date"],
            portfolio_values,
            benchmark_values,
            where=portfolio_values >= benchmark_values,
            interpolate=True,
            color="#B13A2F",
            alpha=0.10,
            hatch="////",
            edgecolor="#B13A2F",
            linewidth=0.0,
            zorder=4,
        )
        ax.fill_between(
            portfolio_series["date"],
            portfolio_values,
            benchmark_values,
            where=portfolio_values < benchmark_values,
            interpolate=True,
            color="#3FC083",
            alpha=0.10,
            zorder=4,
        )

        ax.plot(
            portfolio_series["date"],
            portfolio_cum,
            color=COLORS["fg"],
            linewidth=3.2,
            linestyle="-",
            zorder=6,
            label=portfolio_name,
        )

    ax.set_title("Holdings and Portfolio Performance")
    ax.set_xlabel("Date")
    ax.set_ylabel("Growth Index")
    ax.legend(frameon=False, ncol=2)

    plt.tight_layout()

    if save_path:
        output_path = Path(save_path)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        plt.savefig(output_path, dpi=150)
        print(f"\nChart saved to: {output_path}")

    plt.show()


def plot_drawdown(
    df: pd.DataFrame,
    portfolio: pd.DataFrame | None = None,
    save_path: str | None = None,
) -> None:
    fig, ax = plt.subplots(figsize=(12, 7))
    style_axes(fig, ax, grid=True, zero_line=True)

    for fund_name, group in df.groupby("fund_name"):
        group = group.sort_values("date")
        fund_dd = drawdown(cumulative_growth(group["fund"]))

        ax.plot(
            group["date"],
            fund_dd,
            linewidth=1.8,
            alpha=0.75,
            zorder=3,
            label=fund_name,
        )

    if portfolio is not None:
        portfolio_series = portfolio.sort_values("date").reset_index(drop=True)
        portfolio_dd = drawdown(cumulative_growth(portfolio_series["fund"]))
        portfolio_name = portfolio_series["fund_name"].iloc[0]

        ax.plot(
            portfolio_series["date"],
            portfolio_dd,
            color=COLORS["fg"],
            linewidth=3.0,
            linestyle="-",
            zorder=5,
            label=portfolio_name,
        )

    ax.set_title("Holdings and Portfolio Drawdown")
    ax.set_xlabel("Date")
    ax.set_ylabel("Drawdown")
    ax.legend(frameon=False, ncol=2)

    plt.tight_layout()

    if save_path:
        output_path = Path(save_path)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        plt.savefig(output_path, dpi=150)
        print(f"\nChart saved to: {output_path}")

    plt.show()


def plot_risk_return_scatter(
    df: pd.DataFrame,
    portfolio: pd.DataFrame | None = None,
    save_path: str | None = None,
) -> None:
    fig, ax = plt.subplots(figsize=(12, 7))
    style_axes(fig, ax, grid=True, zero_line=True)

    for fund_name, group in df.groupby("fund_name"):
        ax.scatter(
            group["fund"].std(ddof=0),
            group["fund"].mean(),
            s=90,
            alpha=0.85,
            zorder=3,
            label=fund_name,
        )

    benchmark_series = df.sort_values("date").drop_duplicates("date")["benchmark"]
    ax.scatter(
        benchmark_series.std(ddof=0),
        benchmark_series.mean(),
        color=COLORS["benchmark"],
        s=140,
        marker="X",
        zorder=4,
        label="Benchmark",
    )

    if portfolio is not None:
        ax.scatter(
            portfolio["fund"].std(ddof=0),
            portfolio["fund"].mean(),
            color=COLORS["fg"],
            s=150,
            marker="D",
            zorder=5,
            label=portfolio["fund_name"].iloc[0],
        )

    ax.set_title("Risk vs Return Overview")
    ax.set_xlabel("Monthly Volatility")
    ax.set_ylabel("Average Monthly Return")
    ax.legend(frameon=False, ncol=2)

    plt.tight_layout()

    if save_path:
        output_path = Path(save_path)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        plt.savefig(output_path, dpi=150)
        print(f"\nChart saved to: {output_path}")

    plt.show()
