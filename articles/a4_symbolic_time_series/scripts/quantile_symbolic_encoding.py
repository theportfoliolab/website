import pandas as pd
import numpy as np


def quantile_symbolic_encoding(series):
    """
    Quantile Symbolic Encoding (QSE) with 5 symbols.

    Algorithm:
    1. Compute quintile thresholds (0%, 20%, 40%, 60%, 80%, 100%).
    2. Assign symbols A–E to each quintile.
    3. Return symbolic representation of the series.
    """

    # Step 1: Define alphabet (fixed to 5 symbols)
    alphabet = ["A", "B", "C", "D", "E"]

    # Step 2: Compute quintile thresholds
    quantiles = [0.0, 0.2, 0.4, 0.6, 0.8, 1.0]
    thresholds = series.quantile(quantiles).values

    # Step 3: Ensure strictly increasing bin edges
    thresholds = np.unique(thresholds)

    if len(thresholds) != 6:
        raise ValueError(
            "Quantile thresholds are not unique. "
            "Data may contain too many repeated values."
        )

    # Step 4: Assign symbols using bins
    symbols = pd.cut(
        series,
        bins=thresholds,
        labels=alphabet,
        include_lowest=True
    )

    return symbols.astype(str)
