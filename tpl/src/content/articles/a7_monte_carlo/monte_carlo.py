import math
import random
import statistics
from dataclasses import dataclass, field
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt

plt.show = lambda *args, **kwargs: None

from chart_creator import (
    COLORS,
    add_logo_watermark,
    apply_compact_currency_axis,
    apply_month_ticks,
    horizon_loss_chart,
    horizon_range_chart,
    line_chart,
    setup_matplotlib_style,
    style_axes,
)


# 1. Coin toss: basic Monte Carlo intuition
# 2. Simple growth asset: translating randomness into investment paths
# 3. Investment horizon: how the same asset looks different over different time frames
# 4. Withdrawal model: path dependency, thresholds, and depletion risk
# 5. Simple model verification outputs
# 6. Simple article charts


@dataclass
class Asset:
    name: str
    annual_return: float
    annual_volatility: float

    monthly_return: float = field(init=False)
    monthly_volatility: float = field(init=False)

    def __post_init__(self):
        self.monthly_return = (1 + self.annual_return) ** (1 / 12) - 1
        self.monthly_volatility = self.annual_volatility / math.sqrt(12)


@dataclass
class WithdrawalScenario:
    starting_value: float
    annual_withdrawal: float
    months: int
    reserve_floor: float

    monthly_withdrawal: float = field(init=False)

    def __post_init__(self):
        self.monthly_withdrawal = self.annual_withdrawal / 12


# ---------------------------------------------------------------------------
# Coin toss example
# ---------------------------------------------------------------------------


def coin_toss_simulation(trials: int) -> list[int]:
    return [random.randint(0, 1) for _ in range(trials)]


def calculate_running_average(values: list[float]) -> list[float]:
    running_average = []

    for period in range(1, len(values) + 1):
        running_average.append(statistics.mean(values[:period]))

    return running_average


def chart_coin_toss_example(save_path=None):
    trials = 300
    results = coin_toss_simulation(trials)
    running_average = calculate_running_average(results)
    trial_numbers = list(range(1, trials + 1))

    line_chart(
        x=trial_numbers,
        y=running_average,
        title="Coin Toss Results Converge Towards 50%",
        xlabel="Number of tosses",
        ylabel="Running share of heads",
        y_min=0,
        y_max=1,
        reference_line=0.5,
        reference_label="Expected result: 50%",
        save_path=save_path,
    )


# ---------------------------------------------------------------------------
# Simple growth asset example
# ---------------------------------------------------------------------------


def generate_monthly_returns(asset: Asset, months: int) -> list[float]:
    return [
        random.normalvariate(asset.monthly_return, asset.monthly_volatility)
        for _ in range(months)
    ]


def calculate_portfolio_values(
    returns: list[float],
    starting_value: float,
) -> list[float]:
    values = [starting_value]

    for period_return in returns:
        values.append(values[-1] * (1 + period_return))

    return values


def run_monte_carlo_simulation(
    asset: Asset,
    months: int,
    starting_value: float,
    simulations: int,
) -> list[list[float]]:
    paths = []

    for _ in range(simulations):
        returns = generate_monthly_returns(asset, months)
        paths.append(calculate_portfolio_values(returns, starting_value))

    return paths


def percentile(sorted_values: list[float], percentile_value: float) -> float:
    index = int(percentile_value * (len(sorted_values) - 1))
    return sorted_values[index]


def summarise_final_values(final_values: list[float], starting_value: float) -> dict:
    sorted_values = sorted(final_values)

    return {
        "mean": statistics.mean(final_values),
        "median": statistics.median(final_values),
        "loss_probability": sum(value < starting_value for value in final_values)
        / len(final_values),
        "p5": percentile(sorted_values, 0.05),
        "p95": percentile(sorted_values, 0.95),
    }


def verify_asset_return_model(asset: Asset, sample_months: int = 100_000) -> dict:
    monthly_returns = generate_monthly_returns(asset, sample_months)

    return {
        "asset": asset.name,
        "annual_return_input": asset.annual_return,
        "annual_volatility_input": asset.annual_volatility,
        "expected_monthly_return": asset.monthly_return,
        "realised_sample_mean_monthly_return": statistics.mean(monthly_returns),
        "expected_monthly_volatility": asset.monthly_volatility,
        "realised_sample_standard_deviation": statistics.stdev(monthly_returns),
        "sample_months": sample_months,
    }


def print_asset_return_model_verification(verification: dict):
    print("\nSimple asset monthly return model verification")
    print(f"Asset: {verification['asset']}")
    print(f"Sample months: {verification['sample_months']:,}")
    print(f"Annual return input: {verification['annual_return_input']:.2%}")
    print(f"Annual volatility input: {verification['annual_volatility_input']:.2%}")
    print(f"Expected monthly return: {verification['expected_monthly_return']:.4%}")
    print(
        "Realised sample mean monthly return: "
        f"{verification['realised_sample_mean_monthly_return']:.4%}"
    )
    print(f"Expected monthly volatility: {verification['expected_monthly_volatility']:.4%}")
    print(
        "Realised sample standard deviation: "
        f"{verification['realised_sample_standard_deviation']:.4%}"
    )


# ---------------------------------------------------------------------------
# Investment horizon analysis
# ---------------------------------------------------------------------------


def run_horizon_analysis(
    asset: Asset,
    horizons_months: list[int],
    starting_value: float,
    simulations: int,
) -> list[dict]:
    results = []

    for months in horizons_months:
        paths = run_monte_carlo_simulation(
            asset=asset,
            months=months,
            starting_value=starting_value,
            simulations=simulations,
        )
        final_values = [path[-1] for path in paths]
        summary = summarise_final_values(final_values, starting_value)

        results.append(
            {
                "asset": asset.name,
                "months": months,
                "years": months / 12,
                "paths": paths,
                "final_values": final_values,
                "summary": summary,
            }
        )

    return results


def print_horizon_summary(results: list[dict]):
    print("\nGrowth asset horizon analysis")

    for result in results:
        summary = result["summary"]

        print(f"\n{result['asset']}, {result['months']} month horizon")
        print(f"Median final value: ${summary['median']:,.2f}")
        print(f"5th percentile: ${summary['p5']:,.2f}")
        print(f"95th percentile: ${summary['p95']:,.2f}")
        print(f"Chance of loss: {summary['loss_probability']:.1%}")


def format_horizon_label(months: int) -> str:
    if months < 12:
        return f"{months}m"

    years = months / 12
    if years.is_integer():
        return f"{int(years)}y"

    return f"{years:.1f}y"


def find_horizon_result(results: list[dict], horizon_months: int) -> dict:
    for result in results:
        if result["months"] == horizon_months:
            return result

    raise ValueError(f"No result found for {horizon_months} months.")


def chart_simulated_paths(
    results: list[dict],
    horizon_months: int,
    number_of_paths: int,
    starting_value: float,
    expected_annual_return: float,
    save_path=None,
):
    selected_result = find_horizon_result(results, horizon_months)
    paths = selected_result["paths"][:number_of_paths]
    final_values = selected_result["final_values"]
    median_final_value = selected_result["summary"]["median"]
    median_annualised_growth_rate = (
        (median_final_value / starting_value) ** (12 / horizon_months) - 1
    )
    expected_final_value = starting_value * (
        1 + expected_annual_return
    ) ** (horizon_months / 12)
    month_numbers = list(range(0, horizon_months + 1))

    print(
        "\n120 month growth asset final value distribution"
        f"\nMedian final value: ${median_final_value:,.2f}"
        f"\nMedian final annualised growth rate: {median_annualised_growth_rate:.1%}"
        f"\nInput annual return assumption: {expected_annual_return:.1%}"
    )

    fig, (path_ax, hist_ax) = plt.subplots(
        ncols=2,
        sharey=True,
        gridspec_kw={"width_ratios": [2.15, 1], "wspace": 0.04},
    )
    style_axes(fig, path_ax, grid=True, zero_line=False, watermark=False)
    style_axes(fig, hist_ax, grid=True, zero_line=False, watermark=False)

    for path in paths:
        path_ax.plot(
            month_numbers,
            path,
            color=COLORS["accent"],
            linewidth=1.7,
            alpha=0.34,
            zorder=3,
        )

    all_values = [value for path in paths for value in path] + final_values
    lower = min(all_values + [starting_value])
    upper = max(all_values + [starting_value])
    padding = (upper - lower) * 0.1
    y_min = max(0, lower - padding)
    y_max = upper + padding

    path_ax.axhline(
        starting_value,
        color=COLORS["muted_fg"],
        linewidth=1.3,
        linestyle="--",
        alpha=0.85,
        zorder=2,
    )
    path_ax.text(
        horizon_months * 0.88,
        starting_value - (upper - lower) * 0.02,
        "Starting value",
        va="top",
        ha="right",
        color=COLORS["muted_fg"],
        fontsize=10,
    )

    hist_ax.hist(
        final_values,
        bins=34,
        orientation="horizontal",
        color=COLORS["muted_fg"],
        edgecolor="none",
        linewidth=0,
        alpha=0.28,
        zorder=3,
    )
    hist_ax.axhline(
        expected_final_value,
        color=COLORS["link"],
        linewidth=1.4,
        linestyle=":",
        alpha=0.95,
        zorder=4,
    )
    hist_ax.text(
        0.97,
        expected_final_value + (upper - lower) * 0.02,
        f"{expected_annual_return:.0%} deterministic growth path",
        transform=hist_ax.get_yaxis_transform(),
        va="bottom",
        ha="right",
        color=COLORS["muted_fg"],
        fontsize=10,
    )

    path_ax.set_ylim(y_min, y_max)
    path_ax.set_xlim(0, horizon_months)
    path_ax.set_title("Possible Investment Paths and Final Values", x=0.76)
    path_ax.set_xlabel("Month")
    path_ax.set_ylabel("Portfolio value ($)")
    hist_ax.set_xlabel("Frequency")
    hist_ax.tick_params(axis="y", labelleft=False, left=False)
    hist_ax.tick_params(axis="x", colors=COLORS["muted_fg"], labelsize=9, length=3)
    hist_ax.set_ylabel("")
    histogram_right = hist_ax.get_xlim()[1]
    hist_ax.set_xticks(
        [
            tick
            for tick in [200, 400, 600, 800, 1000]
            if tick < histogram_right
        ]
    )

    apply_month_ticks(path_ax, horizon_months)
    apply_compact_currency_axis(path_ax)

    add_logo_watermark(hist_ax)
    fig.subplots_adjust(left=0.08, right=0.94, top=0.88, bottom=0.12, wspace=0.04)

    if save_path is not None:
        plt.savefig(save_path)

    plt.show()


def chart_loss_probability_by_horizon(results: list[dict], save_path=None):
    categories = [format_horizon_label(result["months"]) for result in results]
    values = [result["summary"]["loss_probability"] * 100 for result in results]

    horizon_loss_chart(
        categories=categories,
        values=values,
        title="Chance of Finishing Below the Starting Value",
        xlabel="Investment horizon",
        ylabel="Chance of loss (%)",
        save_path=save_path,
    )


def chart_percentile_range_by_horizon(
    results: list[dict],
    starting_value: float,
    save_path=None,
):
    categories = [format_horizon_label(result["months"]) for result in results]
    p5_values = [result["summary"]["p5"] for result in results]
    median_values = [result["summary"]["median"] for result in results]
    p95_values = [result["summary"]["p95"] for result in results]

    horizon_range_chart(
        categories=categories,
        p5_values=p5_values,
        median_values=median_values,
        p95_values=p95_values,
        starting_value=starting_value,
        title="Final Value Range by Investment Horizon",
        xlabel="Investment horizon",
        ylabel="Final portfolio value ($)",
        save_path=save_path,
    )


# ---------------------------------------------------------------------------
# Withdrawal model example
# ---------------------------------------------------------------------------


def simulate_withdrawal_path(asset: Asset, scenario: WithdrawalScenario) -> dict:
    returns = generate_monthly_returns(asset, scenario.months)
    return calculate_withdrawal_result_from_returns(
        asset_name=asset.name,
        returns=returns,
        scenario=scenario,
    )


def calculate_withdrawal_result_from_returns(
    asset_name: str,
    returns: list[float],
    scenario: WithdrawalScenario,
    reduced_monthly_withdrawal: float | None = None,
    reduction_after_month: int | None = None,
) -> dict:
    values = calculate_withdrawal_values_for_rule(
        returns=returns,
        scenario=scenario,
        reduced_monthly_withdrawal=reduced_monthly_withdrawal,
        reduction_after_month=reduction_after_month,
    )
    breached_reserve_floor = any(value < scenario.reserve_floor for value in values)
    depleted = any(value <= 0 for value in values)
    first_depletion_month = None

    for month, value in enumerate(values):
        if value <= 0:
            first_depletion_month = month
            break

    return {
        "asset": asset_name,
        "returns": returns,
        "values": values,
        "final_value": values[-1],
        "breached_reserve_floor": breached_reserve_floor,
        "stayed_above_reserve_floor": not breached_reserve_floor,
        "depleted": depleted,
        "funded_all_withdrawals": not depleted,
        "first_depletion_month": first_depletion_month,
    }


def calculate_withdrawal_values_for_rule(
    returns: list[float],
    scenario: WithdrawalScenario,
    reduced_monthly_withdrawal: float | None = None,
    reduction_after_month: int | None = None,
) -> list[float]:
    portfolio_value = scenario.starting_value
    values = [portfolio_value]

    for month, period_return in enumerate(returns, start=1):
        monthly_withdrawal = scenario.monthly_withdrawal
        if (
            reduced_monthly_withdrawal is not None
            and reduction_after_month is not None
            and month > reduction_after_month
        ):
            monthly_withdrawal = reduced_monthly_withdrawal

        if portfolio_value > 0:
            portfolio_value = portfolio_value * (1 + period_return)
            portfolio_value -= monthly_withdrawal

        if portfolio_value <= 0:
            portfolio_value = 0

        values.append(portfolio_value)

    return values


def run_withdrawal_monte_carlo(
    asset: Asset,
    scenario: WithdrawalScenario,
    simulations: int,
) -> list[dict]:
    return [
        simulate_withdrawal_path(asset=asset, scenario=scenario)
        for _ in range(simulations)
    ]


def summarise_withdrawal_results(results: list[dict]) -> dict:
    final_values = [result["final_value"] for result in results]
    sorted_final_values = sorted(final_values)
    depleted_results = [result for result in results if result["depleted"]]
    reserve_breach_results = [
        result for result in results if result["breached_reserve_floor"]
    ]
    breached_not_depleted_results = [
        result
        for result in reserve_breach_results
        if not result["depleted"]
    ]
    depletion_months = [
        result["first_depletion_month"]
        for result in depleted_results
        if result["first_depletion_month"] is not None
    ]

    if depletion_months:
        median_depletion_month = statistics.median(depletion_months)
        average_depletion_month = statistics.mean(depletion_months)
    else:
        median_depletion_month = None
        average_depletion_month = None

    return {
        "funding_success_probability": sum(
            result["funded_all_withdrawals"] for result in results
        )
        / len(results),
        "reserve_success_probability": sum(
            result["stayed_above_reserve_floor"] for result in results
        )
        / len(results),
        "reserve_breach_probability": len(reserve_breach_results) / len(results),
        "breached_not_depleted_probability": len(breached_not_depleted_results)
        / len(results),
        "depletion_probability": len(depleted_results) / len(results),
        "median_final_value": statistics.median(final_values),
        "p5_final_value": percentile(sorted_final_values, 0.05),
        "p95_final_value": percentile(sorted_final_values, 0.95),
        "median_depletion_month": median_depletion_month,
        "average_depletion_month": average_depletion_month,
    }


def build_withdrawal_portfolios() -> list[Asset]:
    return [
        Asset("Conservative", 0.04, 0.06),
        Asset("Balanced", 0.06, 0.10),
        Asset("Growth", 0.08, 0.16),
    ]


def compare_withdrawal_portfolios(
    portfolios: list[Asset],
    scenario: WithdrawalScenario,
    simulations: int,
) -> list[dict]:
    comparison = []

    for portfolio in portfolios:
        results = run_withdrawal_monte_carlo(
            asset=portfolio,
            scenario=scenario,
            simulations=simulations,
        )
        summary = summarise_withdrawal_results(results)

        comparison.append(
            {
                "asset": portfolio,
                "name": portfolio.name,
                "results": results,
                "summary": summary,
            }
        )

    return comparison


def print_withdrawal_summary(
    comparison: list[dict],
    scenario: WithdrawalScenario,
    simulations: int,
):
    print("\nWithdrawal model under regular monthly withdrawals")
    print(f"Starting portfolio: ${scenario.starting_value:,.0f}")
    print(f"Annual withdrawal: ${scenario.annual_withdrawal:,.0f}")
    print(f"Reserve floor: ${scenario.reserve_floor:,.0f}")
    print(f"Horizon: {scenario.months // 12} years")
    print(f"Simulations: {simulations:,}")
    print("\nThese are model outputs under the assumptions used, not financial advice.")

    for result in comparison:
        summary = result["summary"]

        print(f"\n{result['name']}")
        print(
            "Chance of funding all withdrawals: "
            f"{summary['funding_success_probability']:.1%}"
        )
        print(
            "Chance of staying above reserve floor: "
            f"{summary['reserve_success_probability']:.1%}"
        )
        print(
            "Chance of breaching reserve floor: "
            f"{summary['reserve_breach_probability']:.1%}"
        )
        print(f"Chance of depletion: {summary['depletion_probability']:.1%}")
        print(f"Median final value: ${summary['median_final_value']:,.2f}")
        print(f"5th percentile final value: ${summary['p5_final_value']:,.2f}")


def find_withdrawal_comparison_result(comparison: list[dict], name: str) -> dict:
    for result in comparison:
        if result["name"] == name:
            return result

    raise ValueError(f"No withdrawal result found for {name}.")


def chart_withdrawal_paths(
    results: list[dict],
    scenario: WithdrawalScenario,
    number_of_paths: int,
    save_path=None,
):
    fig, ax = plt.subplots()
    style_axes(fig, ax, grid=True, zero_line=False)

    month_numbers = list(range(0, scenario.months + 1))
    selected_paths = select_early_experience_withdrawal_paths(
        results,
        number_of_paths,
        early_months=24,
    )
    path_styles = {
        "Highest third after 24 months": {
            "color": COLORS["accent"],
            "linewidth": 1.8,
            "alpha": 0.48,
        },
        "Middle third after 24 months": {
            "color": COLORS["muted_fg"],
            "linewidth": 1.7,
            "alpha": 0.42,
        },
        "Lowest third after 24 months": {
            "color": COLORS["link"],
            "linewidth": 1.9,
            "alpha": 0.58,
        },
    }

    for result, label in selected_paths:
        style = path_styles[label]

        ax.plot(
            month_numbers,
            result["values"],
            color=style["color"],
            linewidth=style["linewidth"],
            alpha=style["alpha"],
            zorder=3,
        )

    ax.axhline(
        scenario.reserve_floor,
        color=COLORS["muted_fg"],
        linewidth=1.3,
        linestyle="--",
        alpha=0.9,
        zorder=2,
    )
    ax.text(
        month_numbers[-1] - 14,
        scenario.reserve_floor,
        "Reserve floor",
        va="bottom",
        ha="left",
        color=COLORS["muted_fg"],
        fontsize=10,
    )

    if any(result["depleted"] for result, _ in selected_paths):
        ax.axhline(
            0,
            color=COLORS["border"],
            linewidth=1.0,
            alpha=0.55,
            zorder=2,
        )

    all_values = [
        value
        for result, _ in selected_paths
        for value in result["values"]
    ]
    upper = max(all_values + [scenario.starting_value, scenario.reserve_floor])
    ax.set_ylim(0, upper * 1.12)

    ax.set_title("Early Returns Matter When Withdrawals Continue")
    ax.set_xlabel("Month")
    ax.set_ylabel("Portfolio value ($)")

    legend_labels = list(path_styles.keys())
    legend_handles = [
        plt.Line2D(
            [0],
            [0],
            color=path_styles[label]["color"],
            linewidth=2.2,
            alpha=0.8,
        )
        for label in legend_labels
    ]
    ax.legend(
        legend_handles,
        legend_labels,
        frameon=False,
        loc="upper right",
        bbox_to_anchor=(0.99, 0.99),
    )
    apply_month_ticks(ax, scenario.months)
    apply_compact_currency_axis(ax)

    plt.tight_layout()

    if save_path is not None:
        plt.savefig(save_path)

    plt.show()


def select_early_experience_withdrawal_paths(
    results: list[dict],
    number_of_paths: int,
    early_months: int,
) -> list[tuple[dict, str]]:
    buckets = classify_by_early_return_experience(results, early_months)
    base_count = max(1, number_of_paths // len(buckets))
    selected = []

    for label, bucket in buckets.items():
        selected.extend((result, label) for result in spread_select(bucket, base_count))

    remaining = number_of_paths - len(selected)
    if remaining > 0:
        already_selected_ids = {id(result) for result, _ in selected}

        for label, bucket in buckets.items():
            for result in bucket:
                if id(result) in already_selected_ids:
                    continue
                selected.append((result, label))
                already_selected_ids.add(id(result))
                if len(selected) == number_of_paths:
                    break
            if len(selected) == number_of_paths:
                break

    return selected[:number_of_paths]


def classify_by_early_return_experience(
    results: list[dict],
    early_months: int,
) -> dict[str, list[dict]]:
    early_months = min(early_months, len(results[0]["returns"]))
    sorted_results = sorted(
        results,
        key=lambda result: cumulative_return(result["returns"][:early_months]),
        reverse=True,
    )
    bucket_size = len(sorted_results) // 3

    return {
        "Highest third after 24 months": sorted_results[:bucket_size],
        "Middle third after 24 months": sorted_results[bucket_size : bucket_size * 2],
        "Lowest third after 24 months": sorted_results[bucket_size * 2 :],
    }


def cumulative_return(returns: list[float]) -> float:
    cumulative_value = 1

    for period_return in returns:
        cumulative_value *= 1 + period_return

    return cumulative_value - 1


def spread_select(values: list, count: int) -> list:
    if count >= len(values):
        return values
    if count <= 1:
        return [values[len(values) // 2]]

    step = (len(values) - 1) / (count - 1)
    return [values[round(index * step)] for index in range(count)]


def calculate_cumulative_breach_probabilities(
    results: list[dict],
    scenario: WithdrawalScenario,
) -> list[float]:
    probabilities = []

    for month in range(scenario.months + 1):
        breached_count = 0

        for result in results:
            if min(result["values"][: month + 1]) < scenario.reserve_floor:
                breached_count += 1

        probabilities.append(breached_count / len(results) * 100)

    return probabilities


def chart_cumulative_reserve_floor_breach_probability(
    results: list[dict],
    scenario: WithdrawalScenario,
    save_path=None,
):
    month_numbers = list(range(scenario.months + 1))
    breach_probabilities = calculate_cumulative_breach_probabilities(
        results,
        scenario,
    )

    fig, ax = plt.subplots()
    style_axes(fig, ax, grid=True, zero_line=False)

    ax.plot(
        month_numbers,
        breach_probabilities,
        color=COLORS["accent"],
        linewidth=2.6,
        zorder=3,
    )
    final_probability = breach_probabilities[-1]
    ax.scatter(
        month_numbers[-1],
        final_probability,
        color=COLORS["link"],
        s=70,
        zorder=4,
    )
    ax.text(
        month_numbers[-1],
        final_probability,
        f" {final_probability:.1f}%",
        va="center",
        ha="left",
        color=COLORS["fg"],
        fontsize=10,
    )
    ax.text(
        0.02,
        0.95,
        (
            "Balanced portfolio only. A path counts once it has fallen below "
            f"\\${scenario.reserve_floor:,.0f}.\n"
            f"Monthly withdrawals are \\${scenario.monthly_withdrawal:,.0f}."
        ),
        transform=ax.transAxes,
        va="top",
        ha="left",
        color=COLORS["muted_fg"],
        fontsize=10,
    )

    ax.set_ylim(0, max(60, max(breach_probabilities) * 1.12))
    ax.set_xlim(0, scenario.months)
    ax.set_title("Chance of Breaching the Reserve Floor Over Time")
    ax.set_xlabel("Year")
    ax.set_ylabel("Cumulative share of simulations (%)")
    ax.set_xticks(list(range(0, scenario.months + 1, 12)))
    ax.set_xticklabels(
        [str(month // 12) for month in range(0, scenario.months + 1, 12)]
    )

    plt.tight_layout()

    if save_path is not None:
        plt.savefig(save_path)

    plt.show()


def run_adaptive_withdrawal_rule_test(
    results: list[dict],
    scenario: WithdrawalScenario,
    early_months: int = 24,
    reduced_monthly_withdrawal: float = 500,
) -> dict:
    buckets = classify_by_early_return_experience(results, early_months)
    weak_start_results = buckets["Lowest third after 24 months"]
    static_results = [
        calculate_withdrawal_result_from_returns(
            asset_name=result["asset"],
            returns=result["returns"],
            scenario=scenario,
        )
        for result in weak_start_results
    ]
    adaptive_results = [
        calculate_withdrawal_result_from_returns(
            asset_name=result["asset"],
            returns=result["returns"],
            scenario=scenario,
            reduced_monthly_withdrawal=reduced_monthly_withdrawal,
            reduction_after_month=early_months,
        )
        for result in weak_start_results
    ]

    return {
        "weak_start_count": len(weak_start_results),
        "early_months": early_months,
        "reserve_floor": scenario.reserve_floor,
        "reduced_monthly_withdrawal": reduced_monthly_withdrawal,
        "static_results": static_results,
        "adaptive_results": adaptive_results,
        "static_summary": summarise_withdrawal_results(static_results),
        "adaptive_summary": summarise_withdrawal_results(adaptive_results),
    }


def print_adaptive_withdrawal_rule_test(result: dict):
    static_summary = result["static_summary"]
    adaptive_summary = result["adaptive_summary"]

    print("\nAdaptive withdrawal rule test on weak early-start paths")
    print(f"Weak-start simulations: {result['weak_start_count']:,}")
    print(
        "Static withdrawal chance of staying above reserve floor: "
        f"{static_summary['reserve_success_probability']:.1%}"
    )
    print(
        "Adaptive withdrawal chance of staying above reserve floor: "
        f"{adaptive_summary['reserve_success_probability']:.1%}"
    )
    print(
        "Static withdrawal chance of depletion: "
        f"{static_summary['depletion_probability']:.1%}"
    )
    print(
        "Adaptive withdrawal chance of depletion: "
        f"{adaptive_summary['depletion_probability']:.1%}"
    )
    print(f"Static median final value: ${static_summary['median_final_value']:,.2f}")
    print(f"Adaptive median final value: ${adaptive_summary['median_final_value']:,.2f}")
    print("This does not prove the adaptive rule is best.")
    print(
        "It shows how Monte Carlo can be used to test a rule after identifying "
        "a vulnerable path group."
    )


def chart_adaptive_withdrawal_rule_test(
    result: dict,
    number_of_paths: int = 32,
    save_path=None,
):
    static_results = result["static_results"]
    adaptive_results = result["adaptive_results"]
    indices_by_static_final_value = sorted(
        range(len(static_results)),
        key=lambda index: static_results[index]["final_value"],
    )
    selected_indices = spread_select(
        indices_by_static_final_value,
        min(number_of_paths, len(static_results)),
    )
    month_numbers = list(range(len(static_results[0]["values"])))
    early_months = result["early_months"]
    reserve_floor = result["reserve_floor"]
    static_final_values = [result["final_value"] for result in static_results]
    adaptive_final_values = [result["final_value"] for result in adaptive_results]
    static_survivor_values = [value for value in static_final_values if value > 0]
    adaptive_survivor_values = [value for value in adaptive_final_values if value > 0]
    static_survivor_median = statistics.median(static_survivor_values)
    adaptive_survivor_median = statistics.median(adaptive_survivor_values)
    static_depletion_rate = (
        len(static_final_values) - len(static_survivor_values)
    ) / len(static_final_values)
    adaptive_depletion_rate = (
        len(adaptive_final_values) - len(adaptive_survivor_values)
    ) / len(adaptive_final_values)
    selected_values = [
        value
        for index in selected_indices
        for result_set in [static_results, adaptive_results]
        for value in result_set[index]["values"]
    ]
    all_chart_values = (
        selected_values
        + static_final_values
        + adaptive_final_values
        + [reserve_floor]
    )
    upper = max(all_chart_values)

    fig, (path_ax, hist_ax) = plt.subplots(
        ncols=2,
        sharey=True,
        gridspec_kw={"width_ratios": [2.15, 1], "wspace": 0.04},
    )
    style_axes(fig, path_ax, grid=True, zero_line=False, watermark=False)
    style_axes(fig, hist_ax, grid=True, zero_line=False, watermark=False)

    for index in selected_indices:
        path_ax.plot(
            month_numbers,
            static_results[index]["values"],
            color=COLORS["link"],
            linewidth=1.7,
            alpha=0.3,
            zorder=3,
        )
        path_ax.plot(
            month_numbers,
            adaptive_results[index]["values"],
            color=COLORS["accent"],
            linewidth=1.9,
            alpha=0.42,
            zorder=4,
        )

    path_ax.axhline(
        reserve_floor,
        color=COLORS["border"],
        linewidth=1.3,
        linestyle="--",
        alpha=0.9,
        zorder=3,
    )
    path_ax.text(
        month_numbers[-1] - 24,
        reserve_floor,
        "Reserve floor",
        va="bottom",
        ha="right",
        color=COLORS["muted_fg"],
        fontsize=10,
    )
    path_ax.axvline(
        early_months,
        color=COLORS["link"],
        linewidth=1.3,
        linestyle=":",
        alpha=0.9,
        zorder=3,
    )
    path_ax.text(
        early_months + 1,
        max(selected_values) * 0.86,
        "Withdrawal rule changes",
        va="top",
        ha="left",
        color=COLORS["link"],
        fontsize=10,
    )

    if any(
        static_results[index]["depleted"] or adaptive_results[index]["depleted"]
        for index in selected_indices
    ):
        path_ax.axhline(
            0,
            color=COLORS["border"],
            linewidth=1.0,
            alpha=0.55,
            zorder=2,
        )

    survivor_values = static_survivor_values + adaptive_survivor_values
    bins = build_histogram_bins(survivor_values, 28)
    hist_ax.hist(
        static_survivor_values,
        bins=bins,
        orientation="horizontal",
        color=COLORS["link"],
        edgecolor="none",
        linewidth=0,
        alpha=0.18,
        label="Static withdrawals",
        zorder=3,
    )
    hist_ax.hist(
        adaptive_survivor_values,
        bins=bins,
        orientation="horizontal",
        color=COLORS["accent"],
        edgecolor="none",
        linewidth=0,
        alpha=0.24,
        label="Adaptive withdrawals",
        zorder=4,
    )
    hist_ax.axhline(
        static_survivor_median,
        color=COLORS["link"],
        linewidth=1.5,
        alpha=0.95,
        zorder=5,
    )
    hist_ax.axhline(
        adaptive_survivor_median,
        color=COLORS["accent"],
        linewidth=1.5,
        alpha=0.95,
        zorder=5,
    )
    hist_ax.text(
        0.97,
        max(static_survivor_median + upper * 0.035, upper * 0.08),
        f"Static survivor median: ${static_survivor_median / 1_000:.1f}k",
        transform=hist_ax.get_yaxis_transform(),
        va="bottom",
        ha="right",
        color=COLORS["link"],
        fontsize=10,
    )
    hist_ax.text(
        0.97,
        adaptive_survivor_median + upper * 0.025,
        f"Adaptive survivor median: ${adaptive_survivor_median / 1_000:.1f}k",
        transform=hist_ax.get_yaxis_transform(),
        va="bottom",
        ha="right",
        color=COLORS["accent"],
        fontsize=10,
    )
    hist_ax.text(
        0.04,
        0.94,
        (
            "Histogram shows surviving portfolios only.\n"
            "Depletion rates are reported separately."
        ),
        transform=hist_ax.transAxes,
        va="top",
        ha="left",
        color=COLORS["muted_fg"],
        fontsize=10,
    )

    path_ax.set_ylim(0, upper * 1.12)
    path_ax.set_xlim(0, month_numbers[-1])
    path_ax.set_title("Testing a Spending Adjustment After a Weak Start", x=0.76)
    path_ax.set_xlabel("Month")
    path_ax.set_ylabel("Portfolio value ($)")
    hist_ax.set_xlabel("Frequency")
    hist_ax.set_ylabel("")
    hist_ax.tick_params(axis="y", labelleft=False, left=False)
    hist_ax.tick_params(axis="x", colors=COLORS["muted_fg"], labelsize=9, length=3)
    histogram_right = hist_ax.get_xlim()[1]
    hist_ax.set_xticks(
        [
            tick
            for tick in [100, 200, 300, 400, 500, 600]
            if tick < histogram_right
        ]
    )

    legend_handles = [
        plt.Line2D(
            [0],
            [0],
            color=COLORS["link"],
            linewidth=2.4,
            alpha=0.8,
        ),
        plt.Line2D(
            [0],
            [0],
            color=COLORS["accent"],
            linewidth=2.4,
            alpha=0.85,
        ),
    ]
    path_ax.legend(
        legend_handles,
        ["Static withdrawals", "Adaptive withdrawals"],
        frameon=False,
        loc="upper right",
        bbox_to_anchor=(0.99, 0.99),
    )
    apply_month_ticks(path_ax, month_numbers[-1])
    apply_compact_currency_axis(path_ax)

    add_logo_watermark(hist_ax)
    fig.subplots_adjust(left=0.08, right=0.94, top=0.88, bottom=0.20, wspace=0.04)

    if save_path is not None:
        plt.savefig(save_path)

    plt.show()


def build_histogram_bins(values: list[float], bin_count: int) -> list[float]:
    lower = min(values)
    upper = max(values)

    if lower == upper:
        return [lower - 1, upper + 1]

    step = (upper - lower) / bin_count
    return [lower + step * index for index in range(bin_count + 1)]


# ---------------------------------------------------------------------------
# Model verification outputs and orchestration
# ---------------------------------------------------------------------------


def main():
    setup_matplotlib_style()
    plt.rcParams["font.family"] = ["DejaVu Serif"]
    random.seed(7)

    output_dir = Path("outputs")
    output_dir.mkdir(exist_ok=True)
    saved_chart_paths = [
        output_dir / "01_coin_toss_convergence.png",
        output_dir / "02_simulated_investment_paths.png",
        output_dir / "03_loss_probability_by_horizon.png",
        output_dir / "04_final_value_range_by_horizon.png",
        output_dir / "05_withdrawal_paths_balanced.png",
        output_dir / "06_adaptive_withdrawal_paths.png",
    ]

    growth_asset = Asset("Growth asset", 0.08, 0.16)
    horizons_months = [1, 3, 6, 12, 24, 60, 120, 240]
    growth_starting_value = 10_000
    simulations = 5_000

    asset_verification = verify_asset_return_model(growth_asset)
    print_asset_return_model_verification(asset_verification)

    chart_coin_toss_example(save_path=saved_chart_paths[0])

    growth_results = run_horizon_analysis(
        asset=growth_asset,
        horizons_months=horizons_months,
        starting_value=growth_starting_value,
        simulations=simulations,
    )
    print_horizon_summary(growth_results)

    chart_simulated_paths(
        results=growth_results,
        horizon_months=120,
        number_of_paths=20,
        starting_value=growth_starting_value,
        expected_annual_return=growth_asset.annual_return,
        save_path=saved_chart_paths[1],
    )
    chart_loss_probability_by_horizon(
        growth_results,
        save_path=saved_chart_paths[2],
    )
    chart_percentile_range_by_horizon(
        growth_results,
        growth_starting_value,
        save_path=saved_chart_paths[3],
    )

    withdrawal_scenario = WithdrawalScenario(
        starting_value=100_000,
        annual_withdrawal=8_000,
        months=15 * 12,
        reserve_floor=40_000,
    )
    withdrawal_portfolios = build_withdrawal_portfolios()
    withdrawal_comparison = compare_withdrawal_portfolios(
        portfolios=withdrawal_portfolios,
        scenario=withdrawal_scenario,
        simulations=simulations,
    )
    print_withdrawal_summary(
        comparison=withdrawal_comparison,
        scenario=withdrawal_scenario,
        simulations=simulations,
    )

    balanced_withdrawal_result = find_withdrawal_comparison_result(
        withdrawal_comparison,
        "Balanced",
    )
    chart_withdrawal_paths(
        results=balanced_withdrawal_result["results"],
        scenario=withdrawal_scenario,
        number_of_paths=24,
        save_path=saved_chart_paths[4],
    )
    adaptive_rule_test = run_adaptive_withdrawal_rule_test(
        results=balanced_withdrawal_result["results"],
        scenario=withdrawal_scenario,
        early_months=24,
        reduced_monthly_withdrawal=500,
    )
    print_adaptive_withdrawal_rule_test(adaptive_rule_test)
    chart_adaptive_withdrawal_rule_test(
        result=adaptive_rule_test,
        number_of_paths=28,
        save_path=saved_chart_paths[5],
    )

    print("\nSaved chart files")
    for chart_path in saved_chart_paths:
        print(chart_path)


if __name__ == "__main__":
    main()
