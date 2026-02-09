import random
import pandas as pd
from collections import Counter, defaultdict
from functools import lru_cache
import matplotlib.pyplot as plt

WORD_LENGTH = 5

VALID_WORDS = set(
    pd.read_csv("valid_words.csv")["word"].astype(str).str.strip().str.lower()
)
VALID_ANSWERS = sorted(VALID_WORDS)


def feedback(guess: str, answer: str) -> str:
    guess = guess.lower()
    answer = answer.lower()

    pattern = ["B"] * WORD_LENGTH
    remaining = list(answer)

    # Greens
    for i in range(WORD_LENGTH):
        if guess[i] == answer[i]:
            pattern[i] = "G"
            remaining[i] = None

    # Yellows
    for i in range(WORD_LENGTH):
        if pattern[i] == "G":
            continue
        if guess[i] in remaining:
            pattern[i] = "Y"
            remaining[remaining.index(guess[i])] = None

    return "".join(pattern)


def filter_candidates(candidates: set[str], guess: str, pattern: str) -> set[str]:
    return {w for w in candidates if feedback(guess, w) == pattern}


# ─────────────────────────────────────────────
# Model 1: Frequency (one-puzzle solver)
# ─────────────────────────────────────────────

def letter_frequencies(candidates: set[str]) -> Counter:
    freq = Counter()
    for w in candidates:
        for ch in set(w):
            freq[ch] += 1
    return freq


def select_guess_frequency(candidates: set[str]) -> str:
    freq = letter_frequencies(candidates)

    def score(word: str) -> int:
        return sum(freq[ch] for ch in set(word))

    return max(sorted(candidates), key=score)


def solve_frequency(answer: str) -> int:
    candidates = VALID_WORDS.copy()

    for attempt in range(1, 7):
        guess = select_guess_frequency(candidates)
        pattern = feedback(guess, answer)

        if pattern == "GGGGG":
            return attempt

        candidates = filter_candidates(candidates, guess, pattern)

    return 6  # cap at 6


# ─────────────────────────────────────────────
# Model 2: Frequency + DP (one-puzzle solver)
# ─────────────────────────────────────────────

def partition_candidates(candidates: set[str], guess: str) -> dict[str, set[str]]:
    buckets = defaultdict(set)
    for ans in candidates:
        buckets[feedback(guess, ans)].add(ans)
    return buckets


def make_dp_value(dp_limit: int):
    @lru_cache(maxsize=None)
    def dp_value(state: frozenset[str]) -> tuple[float, str]:
        C = set(state)
        n = len(C)

        if n == 0:
            return 0.0, ""
        if n == 1:
            only = next(iter(C))
            return 1.0, only

        # cutoff -> fall back to greedy (value unused, guess used)
        if n > dp_limit:
            return float("inf"), select_guess_frequency(C)

        best_cost = float("inf")
        best_guess = None

        for g in C:  # answers-only action space
            buckets = partition_candidates(C, g)

            expected = 1.0
            for Cp in buckets.values():
                expected += (len(Cp) / n) * dp_value(frozenset(Cp))[0]

            if expected < best_cost:
                best_cost = expected
                best_guess = g

        return best_cost, best_guess

    return dp_value


def solve_frequency_dp(answer: str, dp_limit: int, dp_value) -> int:
    candidates = VALID_WORDS.copy()

    for attempt in range(1, 7):
        if len(candidates) <= dp_limit:
            _, guess = dp_value(frozenset(candidates))
        else:
            guess = select_guess_frequency(candidates)

        pattern = feedback(guess, answer)
        if pattern == "GGGGG":
            return attempt

        candidates = filter_candidates(candidates, guess, pattern)

    return 6  # cap at 6


# Collect and plot scores


def collect_scores_full_sweep(dp_limit: int = 121) -> tuple[list[int], list[int]]:
    freq_scores: list[int] = []
    dp_scores: list[int] = []

    dp_value = make_dp_value(dp_limit)  # memoized across the whole sweep

    for answer in VALID_ANSWERS:
        freq_scores.append(solve_frequency(answer))
        dp_scores.append(solve_frequency_dp(answer, dp_limit, dp_value))

    # Count score distributions
    freq_counts = Counter(freq_scores)
    dp_counts = Counter(dp_scores)

    print("\nScore distribution (full valid-word sweep):")
    print("Guesses | Frequency | DP | Difference (DP - Freq)")

    for guesses in range(1, 7):
        f = freq_counts.get(guesses, 0)
        d = dp_counts.get(guesses, 0)
        diff = d - f
        sign = "+" if diff >= 0 else ""
        print(f"{guesses:^7} | {f:^9} | {d:^2} | {sign}{diff:^19}")

    return freq_scores, dp_scores


def histogram(scores: list[int]) -> list[int]:
    c = Counter(scores)
    return [c[i] for i in range(1, 7)]  # counts for 1..6


def plot_distributions(freq_scores: list[int], dp_scores: list[int], out_path: str = "model_score_distribution.png") -> None:
    x = [1, 2, 3, 4, 5, 6]
    freq_counts = histogram(freq_scores)
    dp_counts = histogram(dp_scores)

    width = 0.35
    x_left = [v - width / 2 for v in x]
    x_right = [v + width / 2 for v in x]

    plt.figure(figsize=(9, 5))
    plt.bar(x_left, freq_counts, width=width, label="Frequency")
    plt.bar(x_right, dp_counts, width=width, label="Frequency + DP")

    plt.xticks(x, [str(v) for v in x])
    plt.xlabel("Guesses required")
    plt.ylabel("Number of puzzles")
    plt.title("Wordle Solver Score Distribution (Full Valid-Answer Sweep)")
    plt.legend()
    plt.tight_layout()
    plt.savefig(out_path, dpi=200)
    plt.close()


def main():
    dp_limit = 121

    freq_scores, dp_scores = collect_scores_full_sweep(dp_limit=dp_limit)

    avg_freq = sum(freq_scores) / len(freq_scores)
    avg_dp = sum(dp_scores) / len(dp_scores)

    print(f"Average guesses (frequency, valid-only):      {avg_freq:.3f}")
    print(f"Average guesses (frequency + DP, valid-only): {avg_dp:.3f}")

    plot_distributions(freq_scores, dp_scores, out_path="../../tpl/src/content/articles/a2_wordle_solver/model_score_distribution.png")
    print("Saved chart: model_score_distribution.png")


if __name__ == "__main__":
    main()
