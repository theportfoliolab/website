import pandas as pd
import numpy as np
import string


def volatility_regime_encoding(series, window=20, n_symbols=5):
    """
    Volatility Regime Encoding (VRE)

    Algorithm:
    1. Compute rolling standard deviation of returns.
    2. Discretize volatility into quantile bins.
    3. Map bins to symbols A–E.
    4. Replace missing symbols with 'X'.
    """

    # Step 1: Rolling volatility
    rolling_vol = series.rolling(window=window).std()

    # Step 2: Define alphabet
    alphabet = list(string.ascii_uppercase[:n_symbols])

    # Step 3: Compute quantile thresholds on rolling_vol excluding NaNs
    valid_vol = rolling_vol.dropna()
    quantiles = np.linspace(0, 1, n_symbols + 1)
    thresholds = valid_vol.quantile(quantiles).values
    thresholds = np.unique(thresholds)

    if len(thresholds) != n_symbols + 1:
        raise ValueError("Volatility thresholds are not unique.")

    # Step 4: Assign symbols
    symbols = pd.cut(
        rolling_vol,
        bins=thresholds,
        labels=alphabet,
        include_lowest=True
    )

    # Step 5: Convert categorical to string and replace missing with 'X'
    symbols = symbols.astype(str).replace('nan', 'X')

    return symbols
