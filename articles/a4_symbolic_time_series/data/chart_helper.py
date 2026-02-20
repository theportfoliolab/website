# helper_peak_regex_clean.py

import sys
import re
import pandas as pd
import matplotlib.pyplot as plt


# ----------------------------------
# Pure Regex Peak Detection
# ----------------------------------
def find_simple_peaks(series, min_up=10, min_down=10,
                      up_chars="BCDE", down_chars="ABCD"):
    """
    Detect peaks as:

        One run of up characters (min_up or more)
        followed by
        One run of down characters (min_down or more)

    Peak index = last character of the up run.
    """

    series_str = "".join(series.astype(str).values)

    pattern = re.compile(
        rf"([{up_chars}]{{{min_up},}})"
        rf"([{down_chars}]{{{min_down},}})"
    )

    peaks = []

    for match in pattern.finditer(series_str):
        peak_index = match.start(2) - 1
        peaks.append(peak_index)

    return peaks


# ----------------------------------
# Optional: Merge Nearby Peaks
# ----------------------------------
def merge_nearby_peaks(df, peaks, min_distance=20):
    """
    If multiple peaks are very close,
    keep only the highest close.
    """
    if not peaks:
        return []

    peaks = sorted(peaks)
    merged = [peaks[0]]

    for idx in peaks[1:]:
        if idx - merged[-1] <= min_distance:
            # Keep higher price
            if df["close"].iloc[idx] > df["close"].iloc[merged[-1]]:
                merged[-1] = idx
        else:
            merged.append(idx)

    return merged


# ----------------------------------
# Plot Peaks
# ----------------------------------
def plot_peaks(df, peak_indices, title="Regex Peak Detection"):
    plt.figure(figsize=(15, 6))
    plt.plot(df["date"], df["close"], label="Close Price")

    if peak_indices:
        plt.scatter(
            df["date"].iloc[peak_indices],
            df["close"].iloc[peak_indices],
            color="red",
            label="Detected Peaks",
            zorder=5
        )

    plt.title(title)
    plt.xlabel("Date")
    plt.ylabel("Price")
    plt.legend()
    plt.grid(True)
    plt.show()


# ----------------------------------
# Extract Multi-Size Windows
# ----------------------------------
def extract_peak_windows(df, peak_indices, window_sizes=(10, 15, 20, 25)):
    """
    Returns:
        {
            peak_index: {
                window_size: DataFrame,
                ...
            }
        }
    """
    n = len(df)
    result = {}

    for idx in peak_indices:
        result[idx] = {}
        for w in window_sizes:
            start = max(0, idx - w)
            end = min(n, idx + w + 1)
            result[idx][w] = df.iloc[start:end].copy()

    return result


# ----------------------------------
# Main
# ----------------------------------
def main():

    if len(sys.argv) != 2:
        print("Usage: python helper_peak_regex_clean.py <encoded_csv>")
        sys.exit(1)

    input_file = sys.argv[1]

    df = pd.read_csv(input_file)
    df["date"] = pd.to_datetime(df["date"])

    series = df["symbol_sax"]

    # -----------------------------
    # Tune These Only
    # -----------------------------
    min_up = 12
    min_down = 12

    # Stronger version (optional):
    # up_chars = "DE"
    # down_chars = "AB"

    up_chars = "BCDE"
    down_chars = "ABCD"

    # -----------------------------
    # Detect Peaks
    # -----------------------------
    peaks = find_simple_peaks(
        series,
        min_up=min_up,
        min_down=min_down,
        up_chars=up_chars,
        down_chars=down_chars
    )

    print(f"\nDetected {len(peaks)} raw peaks")

    # Optional merge
    peaks = merge_nearby_peaks(df, peaks, min_distance=25)

    print(f"After merging: {len(peaks)} peaks\n")

    # Plot
    plot_peaks(
        df,
        peaks,
        title=f"Regex Peaks | up>={min_up}, down>={min_down}"
    )

    # Extract context windows
    windows = extract_peak_windows(df, peaks, window_sizes=(5, 10, 15))

    for idx in peaks:
        print(f"\n=== Peak at index {idx}, date {df['date'].iloc[idx]} ===")
        for w, window_df in windows[idx].items():
            print(f"\n--- Window ±{w} days ---")
            print(window_df.to_string(index=False))


if __name__ == "__main__":
    main()
