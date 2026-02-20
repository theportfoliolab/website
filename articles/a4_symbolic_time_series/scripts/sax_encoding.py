import numpy as np
import pandas as pd
import string
from statistics import NormalDist


def sax_symbolic_encoding(series, n_symbols=5):
    """
    Symbolic Aggregate approXimation (SAX)

    Simplified (no PAA segmentation):

    Algorithm:
    1. Z-normalize the series.
    2. Compute Gaussian breakpoints using the standard normal distribution.
    3. Assign symbols based on breakpoint intervals.
    """

    # Step 1: Z-normalize
    mean = series.mean()
    std = series.std()

    if std == 0:
        raise ValueError("Standard deviation is zero; cannot normalize.")

    z_series = (series - mean) / std

    # Step 2: Define alphabet
    alphabet = list(string.ascii_uppercase[:n_symbols])

    # Step 3: Compute Gaussian breakpoints
    normal = NormalDist()
    quantiles = np.linspace(0, 1, n_symbols + 1)[1:-1]
    breakpoints = [normal.inv_cdf(q) for q in quantiles]

    # Step 4: Assign symbols
    bins = [-np.inf] + breakpoints + [np.inf]

    symbols = pd.cut(
        z_series,
        bins=bins,
        labels=alphabet
    )

    return symbols.astype(str)
