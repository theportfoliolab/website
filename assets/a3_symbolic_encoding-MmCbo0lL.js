import{n as e,o as t,r as n}from"./index-CS41XcpE.js";import{t as r}from"./text-Bv7hthU5.js";var i=t(n(),1);const a={title:`Symbolic Encoding for Financial Time Series`,description:`A practical introduction to symbolic encoding for financial time series, covering QSE, SAX, VRE, and the performance benefits of preprocessing data into symbolic sequences.`,date:`2026-03-10`,tags:[`python`,`finance`,`analysis`,`time series`,`regex`],type:`article`,slug:`a3_symbolic_encoding`};function o(){return(0,i.jsxs)(e,{children:[(0,i.jsx)(r,{heading:`Introduction`,content:`Financial time series analysis often involves repeatedly searching for patterns such as volatility regimes, structural transitions, or unusual behaviour in the data.
These tasks are usually performed directly on the raw numeric series, requiring repeated computation of rolling statistics, thresholds, and comparisons across the dataset.
As the number of ideas being tested grows, this workflow can quickly become computationally expensive.

An alternative approach is to convert the time series into a symbolic representation before performing analysis.
Instead of repeatedly computing signals on the raw data, we preprocess the series once and encode each observation as a symbol from a small alphabet.
The resulting sequence can then be analysed using efficient string-processing techniques such as regular expressions and pattern matching.

Formally, we can think of a time series as a numeric sequence

X = (x1, x2, ..., xn)

where each value represents an observation such as a daily return. Symbolic encoding transforms this sequence into a symbolic sequence

S = (s1, s2, ..., sn)

where each symbol belongs to a finite alphabet, for example

Σ = {A, B, C, D, E}.

The goal of symbolic encoding is therefore to construct a mapping

f: X -> S

that preserves useful structural information in the series while allowing the data to be analysed using efficient string-based algorithms.

Once this representation has been constructed, searching for patterns such as volatility clusters or regime transitions becomes a string search problem rather than a repeated numerical computation.
This can significantly reduce the cost of exploratory analysis, allowing analysts to test many hypotheses quickly.

In this article, I introduce three methods of symbolic encoding for financial time series:`,bullets:[`Quantile Symbolic Encoding (QSE), which discretises observations relative to the distribution of the dataset`,`Symbolic Aggregate approXimation (SAX), which normalises the series and encodes deviations from the mean`,`Volatility Regime Encoding (VRE), which focuses on encoding market volatility regimes`]}),(0,i.jsx)(r,{content:`Finally, I demonstrate how symbolic preprocessing can make exploratory regime detection dramatically cheaper by comparing raw numerical searches with regex-based searches on encoded sequences.`}),(0,i.jsx)(r,{heading:`Preparing Data`,content:`Before running the examples in this article, it helps to clean the raw financial dataset so that the structure is consistent and easy to work with.

The small script below performs a few basic preparation steps. It assumes you have a CSV file containing daily OHLCV market data (date, open, high, low, close, volume). The script:`,bullets:[`standardises column names`,`sorts the data chronologically`,`removes duplicate rows`,`ensures numeric values are correctly formatted`,`removes invalid price data`,`computes daily log returns, which are used throughout the examples in this article`]}),(0,i.jsx)(r,{lead:`To use the script:`,bullets:[`Create a folder called data in your project directory.`,`Place your raw CSV file in that folder.`,`Run the script from the command line: python load_and_clean.py your_data.csv`,`The script will read the file from the data folder, clean it, and save a new dataset called data/your_data_cleaned.csv`],content:`This cleaned dataset can then be used directly with the encoding and benchmarking examples in the rest of the article.

The script is intentionally simple so you can easily adapt it to your own data sources.`}),(0,i.jsx)(r,{code:`"""
Load and clean daily data for symbolic time series analysis.

Input file: data/<filename>.csv
Output file: data/<filename>_cleaned.csv
"""

import os
import sys
import pandas as pd
import numpy as np

# =============================
# Load Raw Data
# =============================

def load_raw_data(path: str) -> pd.DataFrame:
    """
    Load raw CSV data
    """
    df = pd.read_csv(path)

    # Standardise column names
    df.columns = [col.strip().lower() for col in df.columns]

    return df


# =============================
# Clean Data
# =============================

def process_data(df: pd.DataFrame) -> pd.DataFrame:
    """
    Clean and prepare dataset for analysis.
    """

    # Ensure required columns exist
    required_cols = {"date", "open", "high", "low", "close", "volume"}
    missing = required_cols - set(df.columns)
    if missing:
        raise ValueError(f"Missing required columns: {missing}")

    # Parse date column
    df["date"] = pd.to_datetime(df["date"], errors="raise")

    # Sort chronologically
    df = df.sort_values("date").reset_index(drop=True)

    # Remove duplicate dates
    df = df.drop_duplicates(subset="date")

    # Ensure numeric types
    numeric_cols = ["open", "high", "low", "close", "volume"]
    df[numeric_cols] = df[numeric_cols].apply(pd.to_numeric, errors="raise")

    # Remove rows with zero or negative prices
    df = df[df["close"] > 0]

    # =============================
    # Additional processing
    # =============================

    # Log returns
    df = add_log_returns(df)

    # Drop first row (NaN return)
    df = df.dropna(subset=["log_return"])

    # Reset index
    df = df.reset_index(drop=True)

    return df


def add_log_returns(df, price_col="close"):
    df = df.copy()
    df["log_return"] = np.log(df[price_col] / df[price_col].shift(1))
    df = df.dropna()
    return df


# =============================
# Save Cleaned Data
# =============================

def save_clean_data(df: pd.DataFrame, path: str) -> None:
    os.makedirs(os.path.dirname(path), exist_ok=True)
    df.to_csv(path, index=False)


# =============================
# Main Execution
# =============================

def main():

    if len(sys.argv) != 2:
        print("Usage: python load_and_clean.py <filename.csv>")
        sys.exit(1)

    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)
    data_folder = os.path.join(project_root, "data")

    input_filename = sys.argv[1]
    input_path = os.path.join(data_folder, input_filename)

    if not os.path.exists(input_path):
        print(f"File not found: {input_path}")
        sys.exit(1)

    base_name = os.path.splitext(input_filename)[0]
    output_filename = f"{base_name}_cleaned.csv"
    output_path = os.path.join(data_folder, output_filename)

    raw_df = load_raw_data(input_path)

    print("Cleaning data...")
    clean_df = process_data(raw_df)

    print(f"Final dataset contains {len(clean_df)} rows.")

    print("Saving cleaned dataset...")
    save_clean_data(clean_df, output_path)

    print(f"Saved to {output_path}")
    print("Done.")


if __name__ == "__main__":
    main()`}),(0,i.jsx)(r,{heading:`Quantile Symbolic Encoding`,content:`The simplest way to convert a numeric time series into a symbolic sequence is to separate the data into discrete bins using quantiles.
Instead of recording the exact value of each observation (for example the closing price of every day), we classify it according to where it lies in the distribution of the series.

In Quantile Symbolic Encoding (QSE), we first define a series of symbols, each one representing an equally sized probability interval.
Each data point is then assigned a symbol according to the interval that it falls into.
Here, I have divided the data into five intervals (quintiles), producing the symbol set A-E.

We can apply this encoding to the daily log returns of a time series:`,bullets:[`A = lowest 20% of daily log returns`,`B = 20–40%`,`C = 40–60%`,`D = 60–80%`,`E = highest 20%`]}),(0,i.jsx)(r,{content:`For example, a sequence of returns might be encoded as follows:

Returns:   -0.018  -0.005   0.001   0.012   0.027
Symbols:      A       B       C       D       E

This encoding preserves the relative position of each value in the distribution, but discards the exact numerical magnitude.
Although we lose some information about the exact magnitude, we gain the ability to apply efficient string-based analysis methods.

This encoding is relatively simple to implement using quantile thresholds and binning. The following function maps each observation in a series to one of five symbols based on its quintile.`}),(0,i.jsx)(r,{code:`import pandas as pd
import numpy as np


def quantile_symbolic_encoding(series):
    """
    Quantile Symbolic Encoding (QSE) with 5 symbols.

    This function converts a numeric time series into a symbolic sequence
    by dividing the distribution of the data into equal probability intervals.

    Each interval is assigned a symbol, producing a string representation
    of the time series.
    """

    # Step 1: Define the symbolic alphabet
    # We choose five symbols representing five equal probability bins.
    # These correspond to quintiles of the data distribution.
    alphabet = ["A", "B", "C", "D", "E"]

    # Step 2: Define the quantile levels that will be used as bin boundaries.
    # These represent the edges of the probability intervals:
    # 0%, 20%, 40%, 60%, 80%, and 100%.
    quantiles = [0.0, 0.2, 0.4, 0.6, 0.8, 1.0]

    # Compute the numeric thresholds corresponding to these quantiles.
    # For example, the 20% quantile represents the value below which
    # 20% of the data falls.
    thresholds = series.quantile(quantiles).values

    # Step 3: Ensure the bin edges are strictly increasing.
    # If many identical values exist in the dataset, some quantiles
    # may collapse to the same number. This would break the binning process.
    thresholds = np.unique(thresholds)

    if len(thresholds) != 6:
        raise ValueError(
            "Quantile thresholds are not unique. "
            "Data may contain too many repeated values."
        )

    # Step 4: Assign symbols to each observation based on the bin it falls into.
    # pandas.cut maps each value to the interval defined by the thresholds.
    # Each interval is labelled using our symbolic alphabet.
    symbols = pd.cut(
        series,
        bins=thresholds,
        labels=alphabet,
        include_lowest=True
    )

    # Convert the resulting categorical values to strings so they can
    # easily be concatenated or processed as text.
    return symbols.astype(str)`}),(0,i.jsx)(r,{heading:`Why QSE Is Useful`,bullets:[`Distribution-aware: each symbol includes information on each data point relative to the dataset itself, meaning we can more easily identify anomalous or trend-conforming data.`,`Balanced symbol frequency: each symbol appears with roughly equal frequency, so the effect of a long-term uptrend in years of data can be muted.`,`Computational simplicity: QSE is straightforward to implement and computationally inexpensive, making it a useful preprocessing step for large datasets.`],content:`However, QSE also has a number of limitations.
Because it only captures relative positions within the distribution, it does not preserve information about the shape or temporal structure of the series.
More sophisticated encodings, such as Symbolic Aggregate approXimation (SAX), attempt to address this limitation.`}),(0,i.jsx)(r,{heading:`Symbolic Aggregate approXimation`,lead:`How can we preserve information about the shape or local structure of a time series?`,content:`Enter Symbolic Aggregate approXimation (SAX): an alternative method of encoding which first normalises the time series.
In other words, the encoding can focus on deviation relative to the series itself, rather than an absolute scale.`}),(0,i.jsx)(r,{lead:`The SAX Encoding Process`,content:`First, the series is converted to z-scores by taking each value, subtracting the mean, and dividing by the standard deviation.
This rescales the data so that the series has a mean of zero, and a standard deviation of 1.

After normalisation, values can be interpreted in terms of their distance from the average behaviour of the series:`,bullets:[`z-score = 0 -> typical value`,`z-score = 1 -> one standard deviation above average`,`z-score = -1 -> one standard deviation below average`]}),(0,i.jsx)(r,{content:`At this point, SAX divides the standard normal distribution into equal probability regions, and each region is assigned a symbol in a similar fashion to QSE.

Using five symbols, the encoding on daily log returns might look like:`,bullets:[`A = very low daily return relative to the series`,`B = moderately low daily return`,`C = near the average`,`D = moderately high daily return`,`E = very high daily return`]}),(0,i.jsx)(r,{content:`Because these thresholds are derived from the standard normal distribution, the encoding becomes independent of the scale of the original data.
The key benefit of this is that two time series with very different magnitudes, such as a stock trading at $50 and one trading at $150,
can produce comparable symbolic representations if their underlying behaviour is similar.

The key point here is that SAX captures information about relative behaviour within the signal, rather than information about absolute values.`}),(0,i.jsx)(r,{heading:`Implementation`,content:`If we compare SAX with QSE, most of the encoding process is actually the same. The key differences are:`,bullets:[`SAX first normalises the data (new step).`,`The thresholds are derived from the standard normal distribution instead of the dataset itself.`,`The symbolic assignment step is identical to QSE.`]}),(0,i.jsx)(r,{content:`In the full SAX algorithm, an additional preprocessing step called Piecewise Aggregate Approximation (PAA) is often applied before symbol assignment.
PAA compresses the time series by averaging neighbouring points into segments.
For simplicity, the implementation below omits this step, but the location where it would normally occur is shown in the code.`}),(0,i.jsx)(r,{code:`import numpy as np
import pandas as pd
import string
from statistics import NormalDist


def sax_symbolic_encoding(series, n_symbols=5):
    """
    Symbolic Aggregate approXimation (SAX)

    Simplified implementation (no PAA segmentation).

    Key differences from QSE:
    - Adds a normalisation step
    - Uses Gaussian breakpoints instead of dataset quantiles
    - Reuses the same symbolic binning process
    """

    # ---------------------------------------------------------
    # NEW STEP (not present in QSE)
    # Normalise the series so it has mean 0 and standard deviation 1
    # ---------------------------------------------------------

    mean = series.mean()
    std = series.std()

    if std == 0:
        raise ValueError("Standard deviation is zero; cannot normalise.")

    z_series = (series - mean) / std

    # ---------------------------------------------------------
    # OPTIONAL STEP IN FULL SAX (not implemented here)
    # Piecewise Aggregate Approximation (PAA)
    #
    # In full SAX, the normalised series would first be compressed
    # into segments before symbol assignment:
    #
    # z_series = paa_transform(z_series, segments)
    #
    # This reduces dimensionality and smooths the signal.
    # ---------------------------------------------------------

    # ---------------------------------------------------------
    # REUSED FROM QSE
    # Define the symbolic alphabet
    # (this section is identical to QSE)
    # ---------------------------------------------------------

    alphabet = list(string.ascii_uppercase[:n_symbols])

    # ---------------------------------------------------------
    # MODIFIED FROM QSE
    # Compute thresholds using the standard normal distribution
    # instead of dataset quantiles
    # ---------------------------------------------------------

    normal = NormalDist()

    quantiles = np.linspace(0, 1, n_symbols + 1)[1:-1]

    breakpoints = [normal.inv_cdf(q) for q in quantiles]

    # ---------------------------------------------------------
    # REUSED FROM QSE
    # Assign symbols using binning
    # (same logic used in quantile encoding)
    # ---------------------------------------------------------

    bins = [-np.inf] + breakpoints + [np.inf]

    symbols = pd.cut(
        z_series,
        bins=bins,
        labels=alphabet
    )

    return symbols.astype(str)`}),(0,i.jsx)(r,{content:`To reiterate, the differences between QSE and SAX can be described as:

QSE
data -> quantiles -> symbols

SAX
data -> normalize -> (PAA) -> Gaussian breakpoints -> symbols`}),(0,i.jsx)(r,{heading:`Why SAX Is Useful`,bullets:[`Scale independent: normalised data focuses on relative behaviour.`,`Shape awareness: deviations from the mean are preserved in the encoding, allowing patterns related to the structure of the signal to be captured.`,`Comparability between time series: different time series can be compared symbolically even if they have very different magnitudes.`],content:`As always, there are also some limitations.
We assume that the normalised data follows a standard normal distribution, which may not always be the case in real financial data.
In addition, the implementation here omits a step called Piecewise Aggregate Approximation, which compresses the time series before encoding.
The simplified implementation here allows the core concept to be illustrated more clearly.`}),(0,i.jsx)(r,{heading:`Volatility Regime Encoding`,content:`While SAX focuses on the structure of the signal itself, another useful perspective is to encode market regimes, such as periods of high or low volatility.

This is where Volatility Regime Encoding (VRE) comes in.

Instead of encoding the value of the time series directly, VRE encodes the volatility of the series over time.
In financial markets, volatility often occurs in clusters: calm periods tend to remain calm, while turbulent periods tend to produce sustained sequences of large price movements.

By encoding volatility, we can symbolically represent these regime shifts.`}),(0,i.jsx)(r,{lead:`How VRE works`,content:`Conceptually, the process is:`,bullets:[`Measure the rolling volatility of the time series using a sliding window`,`Divide the volatility distribution into quantile intervals`,`Assign a symbol to each volatility regime`]}),(0,i.jsx)(r,{content:`Here, the symbols refer to how volatile the market is for a given security:`,bullets:[`A = very low volatility`,`B = low volatility`,`C = moderate volatility`,`D = high volatility`,`E = very high volatility`]}),(0,i.jsx)(r,{content:`Unlike QSE and SAX, which encode the value of the signal itself such as closing price, VRE encodes a derived property of the signal.
The resulting symbolic sequence highlights transitions between calm and turbulent market conditions.
This makes VRE useful for identifying volatility regimes, market shocks, or prolonged periods of stability or instability.

The implementation follows the same symbolic binning pattern used in QSE and SAX.

The key difference is that we first compute rolling volatility, then discretise that derived series into symbolic regimes.`}),(0,i.jsx)(r,{code:`import pandas as pd
import numpy as np
import string


def volatility_regime_encoding(series, window=20, n_symbols=5):
    """
    Volatility Regime Encoding (VRE)

    Algorithm:
    1. Compute rolling standard deviation of returns.
    2. Discretise volatility into quantile bins.
    3. Map bins to symbols A–E.
    4. Replace missing symbols with 'X'.
    """

    # ---------------------------------------------------------
    # NEW STEP
    # Compute rolling volatility of the time series
    #
    # The rolling window measures how much returns fluctuate
    # over recent observations. Larger values indicate higher
    # market instability.
    # ---------------------------------------------------------

    rolling_vol = series.rolling(window=window).std()

    # ---------------------------------------------------------
    # REUSED FROM QSE
    # Define the symbolic alphabet
    # ---------------------------------------------------------

    alphabet = list(string.ascii_uppercase[:n_symbols])

    # ---------------------------------------------------------
    # REUSED FROM QSE
    # Compute quantile thresholds
    #
    # Instead of using the raw series, we compute thresholds
    # on the rolling volatility distribution.
    # ---------------------------------------------------------

    valid_vol = rolling_vol.dropna()

    quantiles = np.linspace(0, 1, n_symbols + 1)

    thresholds = valid_vol.quantile(quantiles).values

    thresholds = np.unique(thresholds)

    if len(thresholds) != n_symbols + 1:
        raise ValueError("Volatility thresholds are not unique.")

    # ---------------------------------------------------------
    # REUSED FROM QSE
    # Assign symbols based on volatility bins
    # ---------------------------------------------------------

    symbols = pd.cut(
        rolling_vol,
        bins=thresholds,
        labels=alphabet,
        include_lowest=True
    )

    # ---------------------------------------------------------
    # NEW STEP
    # Replace missing values (caused by the rolling window)
    # with a placeholder symbol.
    # ---------------------------------------------------------

    symbols = symbols.astype(str).replace('nan', 'X')

    return symbols`}),(0,i.jsx)(r,{heading:`Why VRE Is Useful`,bullets:[`Regime detection: easily find transitions between calm and turbulent market environments.`,`Clustering behaviour: pattern matching on the encoded sequence can be used to find volatility clusters.`,`Efficient pattern searching: as with all of the encoding techniques shown here, string-based tools can be used to find complex patterns more efficiently.`]}),(0,i.jsx)(r,{heading:`Limitations of VRE`,content:`The resulting encoding is heavily affected by the window length used for calculating rolling volatility.
A short window may produce an encoding that is too noisy to accurately find regime switches, while a long window may smooth out meaningful changes in volatility.

In addition, discretisation of volatility into symbols means some information about the exact magnitude of volatility changes is discarded.`}),(0,i.jsx)(r,{heading:`Performance of String-Based Algorithms vs Calculations on Raw Data`,content:`Now that we have a few methods of encoding a time series, we should look at why this is useful.

Up to this point, the focus has been on what symbolic encoding preserves.
The next question is whether symbolic preprocessing is useful in practice.
For exploratory analysis, the answer is yes: once a time series has been encoded, many different pattern searches can be performed much more cheaply than repeated calculations on the raw data.

Consider exactly when these performance improvements can be seen: a single regex search on an encoded sequence is unlikely to produce noticeable performance gains, because the cost of encoding still has to be paid.
The real benefit becomes apparent when we can use that encoded sequence for multiple operations, and earn back that initial computation cost.

For this demonstration, I will measure compute time for this somewhat arbitrary task:

Find the periods where volatility remains elevated for several days.

This is a realistic task used in regime detection, risk monitoring, and market stress detection.`}),(0,i.jsx)(r,{lead:`Raw data approach`,content:`With no encoding, we must perform the following steps:`,bullets:[`Compute rolling volatility`,`Compute quantiles`,`Check thresholds`,`Scan for consecutive returns`]}),(0,i.jsx)(r,{lead:`And in Python:`,code:`rolling_vol = returns.rolling(20).std()
threshold = rolling_vol.quantile(0.8)

high_vol = rolling_vol > threshold

clusters = []
run_start = None

for i, val in enumerate(high_vol):
    if val:
        if run_start is None:
            run_start = i
    else:
        if run_start is not None and i - run_start >= 5:
            clusters.append((run_start, i))
        run_start = None`}),(0,i.jsx)(r,{lead:`Encoded approach`,content:`If we pre-encode the volatility using VRE, the problem becomes a string search.

For example, if our encoded sequence is:

AACCDDDEEEEEDDCCBAA...

and we know that EEEEE is the volatility cluster that we want to detect, then we can express this as a regex:

E{5,}`}),(0,i.jsx)(r,{code:`import re

symbol_string = "".join(symbols)

clusters = [m.span() for m in re.finditer(r"E{5,}", symbol_string)]`}),(0,i.jsx)(r,{content:`Note that we did that in just three lines of code.

We are taking advantage of the fact that regex engines like the one in Python's re package are highly optimised, and because we are working on simple characters no repeated numeric computation is required.

So how much faster is it?

In theory, each individual pass over the dataset has time complexity O(n).
However, exploratory analysis rarely involves only one search.
Testing k different regime definitions on raw data behaves like O(kn), because the numerical computations must be repeated for every hypothesis.
With symbolic encoding, the preprocessing cost is paid once, and subsequent pattern searches operate directly on the encoded sequence.

But it is just as easy to set up a practical test to demonstrate the time savings.

To make the comparison fair, I benchmark three stages separately:`,bullets:[`Raw detection: compute rolling volatility, threshold it, and scan for clusters.`,`Encoding cost: construct the symbolic volatility sequence once.`,`Regex search on encoded data: search the encoded sequence for the target pattern.`]}),(0,i.jsx)(r,{content:`This shows where the real advantage of symbolic preprocessing appears: the encoding has an upfront cost, but once it has been paid, repeated searches become much cheaper.`}),(0,i.jsx)(r,{heading:`Benchmark Script`,content:`To demonstrate the practical benefit of symbolic encoding, the following script compares two approaches to detecting volatility regimes.

The script accepts a CSV file containing cleaned market data and reads the log_return column. It then performs three steps:

First, it runs a raw numerical search to identify periods where volatility remains elevated for several consecutive days, in this case 3-8 day windows.

Next, it encodes the return series using Volatility Regime Encoding (VRE), converting the numeric time series into a sequence of symbols.

Finally, it performs a large number of regex searches on the encoded sequence, exploring different volatility patterns, including the 3-8 day volatility regimes computed in the raw data approach.`}),(0,i.jsx)(r,{code:`"""
Demonstration: raw volatility search vs symbolic regex search.

Assumes input CSV is already cleaned and contains:
    date
    log_return
"""

import argparse
import re
import time
import numpy as np
import pandas as pd

WINDOW = 20
RAW_REPEATS = 50

# Raw volatility detection
def raw_volatility_search(returns):

    vol = returns.rolling(WINDOW).std()
    threshold = vol.quantile(0.8)

    high_vol = (vol > threshold).fillna(False)

    clusters = []
    run = 0

    for i, val in enumerate(high_vol):
        run = run + 1 if val else 0
        if 3 <= run <= 8:
            clusters.append(i)

    return clusters

# Volatility Regime Encoding
def encode_vre(returns):

    vol = returns.rolling(WINDOW).std()
    thresholds = vol.dropna().quantile(np.linspace(0,1,6))

    symbols = pd.cut(
        vol,
        bins=thresholds,
        labels=list("ABCDE"),
        include_lowest=True
    )

    return symbols.astype(str).replace("nan","X")

# Main demo
def main():

    parser = argparse.ArgumentParser()
    parser.add_argument("file")
    args = parser.parse_args()

    df = pd.read_csv(args.file)
    returns = df["log_return"]

    print("
Symbolic Encoding Demonstration")
    print("--------------------------------")
    print(f"Rows: {len(df)}
")

    # Raw search timing
    t0 = time.perf_counter()
    for _ in range(RAW_REPEATS):
        raw_results = raw_volatility_search(returns)
    raw_time = time.perf_counter() - t0

    print(f"Raw volatility search time ({RAW_REPEATS} runs): {raw_time:.6f} s")
    print(f"Matches found: {len(raw_results)}
")

    # Encoding
    t0 = time.perf_counter()
    symbols = encode_vre(returns)
    encode_time = time.perf_counter() - t0

    symbol_string = "".join(symbols)

    print(f"Encoding time: {encode_time:.6f} s")

    # Time budget remaining
    budget = raw_time - encode_time

    patterns = [
        # Direct equivalents to raw search
        # elevated volatility runs, length 3-8
        r"E{3}",
        r"E{4}",
        r"E{5}",
        r"E{6}",
        r"E{7}",
        r"E{8}",
        r"E{3,8}",

        # Slight variations on the same idea
        r"E{2,5}",
        r"E{4,10}",
        r"E{5,}",
        r"[DE]{3,8}",
        r"[DE]{5,}",
        r"D{3,8}",
        r"D{5,}",

        # Calm regimes
        r"A{3}",
        r"A{4}",
        r"A{5}",
        r"A{6}",
        r"A{3,8}",
        r"A{5,}",
        r"[AB]{5,}",

        # Neutral / middle regimes
        r"C{3}",
        r"C{5,}",
        r"[BC]{4,}",
        r"[BCD]{5,}",

        # Regime transitions
        r"A{3,}E{3,}",
        r"E{3,}A{3,}",
        r"A{2,}D{2,}",
        r"D{2,}A{2,}",
        r"C{3,}E{3,}",
        r"E{3,}C{3,}",
        r"A{3,}[DE]{3,}",
        r"[DE]{3,}A{3,}",

        # Broader elevated-volatility ideas
        r"[DE]{4,}",
        r"[CDE]{5,}",
        r"[BCD]{6,}",
        r"D{2,}E{2,}",
        r"E{2,}D{2,}",

        # Alternating / choppy structures
        r"(DE){2,}",
        r"(ED){2,}",
        r"(AB){2,}",
        r"(AE){2,}",
        r"(DA){2,}",

        # Mixed “interesting shape” patterns
        r"A+E+",
        r"E+A+",
        r"A{2,}C{2,}E{2,}",
        r"E{2,}C{2,}A{2,}",
        r"[AB]{3,}C{2,}[DE]{3,}",
        r"[DE]{3,}C{2,}[AB]{3,}",
    ]

    searches = 0
    start = time.perf_counter()

    while time.perf_counter() - start < budget:
        pattern = patterns[searches % len(patterns)]
        re.findall(pattern, symbol_string)
        searches += 1

    print(f"
Regex searches completed in same time window: {searches}")

if __name__ == "__main__":
    main()`}),(0,i.jsx)(r,{content:`On my machine using a dataset of 2436 lines, the result was:`,code:`Symbolic Encoding Demonstration
--------------------------------
Rows: 2435

Raw volatility search time (50 runs): 0.034320 s
Matches found: 131

Encoding time: 0.002050 s

Regex searches completed in same time window: 829`}),(0,i.jsx)(r,{content:`Using the encoding + regex approach, I was able to explore over 800 more hypotheses in the same amount of time compared to repeatedly working on raw data alone.

The performance gain here is somewhat exaggerated by the repeated benchmark, but it illustrates an important idea: once the data has been encoded, exploring alternative pattern definitions becomes extremely cheap.`}),(0,i.jsx)(r,{content:`In a real-world analysis workflow, this difference becomes meaningful very quickly.
You are likely working through an idea, iterating and refining it, not just running one query and calling it a day.
Being able to adjust thresholds, tune parameters, experiment with different regime definitions,
or test new pattern structures without waiting for repeated numerical computations makes exploratory research far more efficient.
An analyst can test many more ideas quickly and cheaply before committing to more in-depth modelling.

Symbolic encoding opens the door to a different style of time series analysis.
Instead of repeatedly computing indicators on raw data, we can preprocess a dataset once and then explore patterns rapidly using string-based methods.

The examples shown here are only a starting point.
Once a time series has been encoded, it becomes easy to experiment with new ideas:
searching for regime transitions, identifying recurring behavioural motifs, or building libraries of symbolic patterns that describe different market conditions.
Because these searches are computationally inexpensive, analysts can test many hypotheses quickly and refine them iteratively.`}),(0,i.jsx)(r,{heading:`Experiments to Try`,content:`If you want to explore symbolic encoding further, here are a few practical experiments you can try using the techniques introduced in this article:`}),(0,i.jsx)(r,{lead:`1. Detect regime transitions`,content:`Instead of searching for single regimes, try detecting transitions between regimes. For example:

A{3,}E{3,}

could represent a shift from calm markets to high volatility. Searching for these transitions can help identify periods where market conditions changed rapidly.`}),(0,i.jsx)(r,{lead:`2. Compare patterns across assets`,content:`Apply the same encoding method to different assets, for example SPY, QQQ, or individual equities, and compare their symbolic sequences.
Because SAX normalises the data, you can directly compare patterns across time series with very different price levels or volatility scales.`}),(0,i.jsx)(r,{lead:`3. Explore parameter sensitivity`,content:`Small changes to encoding parameters can dramatically change the symbolic sequence.
Try adjusting the number of symbols, the rolling volatility window in VRE, and the segment length in SAX, and observe how these changes affect the patterns that appear in the encoded data.

The most interesting applications will likely come from combining symbolic encodings with domain knowledge and creative pattern design. The tools are simple, but the space of possible experiments is surprisingly large.`})]})}export{o as default,a as meta};