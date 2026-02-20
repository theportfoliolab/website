import os
import sys
import pandas as pd
import matplotlib.pyplot as plt
import re

def find_peaks_regex(series, up_len=25, down_len=10, allowed_breaks=5):
    """
    Detect peaks in a SAX-encoded series with resilience to small opposing moves.
    - up_len: minimum consecutive upward symbols
    - down_len: minimum consecutive downward symbols
    - allowed_breaks: maximum number of symbols opposing the trend inside the trend
    Returns indices of peak centers.
    """
    sax_str = ''.join(series.tolist())

    # Build regex for uptrend
    up_pattern = f'(?:[B-E]+[^B-E]{{0,{allowed_breaks}}})' + f'{{{up_len}}}'

    # Build regex for downtrend
    down_pattern = f'(?:[A-D]+[^A-D]{{0,{allowed_breaks}}})' + f'{{{down_len}}}'

    # Full peak pattern: uptrend followed by downtrend
    pattern = re.compile(up_pattern + down_pattern)

    peaks = []
    for match in pattern.finditer(sax_str):
        start, end = match.start(), match.end()
        mid = (start + end) // 2
        peaks.append(mid)

    return peaks




def plot_peaks(df, peaks, price_col="close"):
    plt.figure(figsize=(14,5))
    plt.plot(df["date"], df[price_col], color="blue", label="Close Price")
    plt.scatter(df["date"].iloc[peaks], df[price_col].iloc[peaks], color="red", label="Peaks", zorder=5)
    plt.xlabel("Date")
    plt.ylabel("Price")
    plt.title("Detected Peaks Using SAX Regex Approach")
    plt.legend()
    plt.tight_layout()
    plt.show()

def main():
    if len(sys.argv) != 2:
        print("Usage: python detect_peaks_regex.py <encoded_filename.csv>")
        sys.exit(1)

    input_filename = sys.argv[1]
    data_folder = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data")
    input_path = os.path.join(data_folder, input_filename)

    if not os.path.exists(input_path):
        print(f"File not found: {input_path}")
        sys.exit(1)

    df = pd.read_csv(input_path)
    if "date" not in df.columns or "symbol_sax" not in df.columns or "close" not in df.columns:
        raise ValueError("CSV must contain 'date', 'close', and 'symbol_sax' columns.")

    df["date"] = pd.to_datetime(df["date"])

    peaks = find_peaks_regex(df["symbol_sax"])
    print(f"Found {len(peaks)} peaks")

    plot_peaks(df, peaks)

if __name__ == "__main__":
    main()
