import pandas as pd
from solver import solve_frequency_dp, WORDS

def score_dp_limit(dp_limit: int) -> float:
    total = 0
    answers = sorted(WORDS)

    for answer in answers:
        total += solve_frequency_dp(answer, dp_limit)

    return total / len(answers)

def main():

    dp_limits = range(100, 140)
    results = []

    for limit in dp_limits:
        avg = score_dp_limit(limit)
        results.append({
            "dp_limit": limit,
            "avg_guesses": avg
        })
        print(f"DP_LIMIT={limit:>3} -> avg={avg:.4f}")

    df = pd.DataFrame(results)
    df.to_csv("dp_limit_results.csv", index=False)

    print("\nBest configuration:")
    print(df.sort_values("avg_guesses").head(1))

if __name__ == "__main__":
    main()
