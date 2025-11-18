import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import yfinance as yf

# --------------------------------------------------
# 1. Choose assets (tickers from Yahoo Finance)
# --------------------------------------------------
tickers = ["SPY", "GLD", "IEF"]   # equities, gold, bonds

# --------------------------------------------------
# 2. Download daily close prices
# --------------------------------------------------
data = yf.download(
    tickers,
    start="2015-01-01",
    end="2025-01-01",
    interval="1d",
    auto_adjust=True,
    progress=False
)

prices = data["Close"].dropna()
returns = prices.pct_change().dropna()

print("Price sample:")
print(prices.head(), "\n")

# --------------------------------------------------
# 3. Momentum Strategy A: Price > 100-day MA
# --------------------------------------------------
ma_window = 100
ma = prices.rolling(ma_window).mean()

signals_A = (prices > ma).astype(float)
weights_A = signals_A.div(signals_A.sum(axis=1), axis=0)
weights_A = weights_A.fillna(1 / len(tickers))
weights_A = weights_A.shift(1).dropna()

returns_A = (weights_A * returns).sum(axis=1)
equity_A = (1 + returns_A).cumprod()

# --------------------------------------------------
# 4. Momentum Strategy B: Golden Cross (10/30)
# --------------------------------------------------
short_window = 10
long_window = 30

short_ma = prices.rolling(short_window).mean()
long_ma  = prices.rolling(long_window).mean()

signals_B = (short_ma > long_ma).astype(float)
weights_B = signals_B.div(signals_B.sum(axis=1), axis=0)
weights_B = weights_B.fillna(1 / len(tickers))
weights_B = weights_B.shift(1).dropna()

returns_B = (weights_B * returns).sum(axis=1)
equity_B = (1 + returns_B).cumprod()

# --------------------------------------------------
# 5. Static equal-weight portfolio
# --------------------------------------------------
num_assets = len(tickers)
# Buy & Hold Equal Weight Portfolio
initial_weights = np.array([1/num_assets] * num_assets)

# cumulative returns for each asset
asset_growth = (1 + returns).cumprod()

# portfolio value = weighted sum of asset growth
static_equity = (asset_growth * initial_weights).sum(axis=1)

# --------------------------------------------------
# 6. Risk Parity Portfolio (Inverse Volatility)
# --------------------------------------------------
vol_window = 60
rolling_vol = returns.rolling(vol_window).std()
inv_vol = 1 / rolling_vol

rp_weights = inv_vol.div(inv_vol.sum(axis=1), axis=0)
rp_weights = rp_weights.shift(1).dropna()

rp_returns = (rp_weights * returns).sum(axis=1)
rp_equity = (1 + rp_returns).cumprod()

# --------------------------------------------------
# 7. Performance metrics
# --------------------------------------------------
def cagr(series):
    years = (series.index[-1] - series.index[0]).days / 365.25
    return series.iloc[-1] ** (1/years) - 1

print("CAGR Momentum A (Price > 100MA):", f"{cagr(equity_A)*100:.2f}%")
print("CAGR Momentum B (10/30 Cross):  ", f"{cagr(equity_B)*100:.2f}%")
print("CAGR Static Equal Weight:       ", f"{cagr(static_equity)*100:.2f}%")
print("CAGR Risk Parity:               ", f"{cagr(rp_equity)*100:.2f}%\n")

# --------------------------------------------------
# 8. Charts for the article
# --------------------------------------------------

def plot_equity_curves(series_dict, title):
    """
    series_dict: {"Label": pd.Series}
    """
    plt.figure(figsize=(10,6))

    # Ensure the dictionary is not empty
    if not series_dict:
        raise ValueError("series_dict is empty — no series provided to plot.")

    for label, series in series_dict.items():

        # Ensure it's not an empty series
        if len(series) == 0:
            print(f"Warning: '{label}' is empty and will not be plotted.")
            continue

        # Plot with a proper label
        plt.plot(series.index, series.values, label=str(label), linewidth=2)

        # Final % annotation
        final_value = series.iloc[-1]
        pct_return = (final_value - 1.0) * 100

        plt.text(
            series.index[-1],
            final_value,
            f" {pct_return:+.1f}%",
            fontsize=9,
            ha='left',
            va='center'
        )

    plt.title(title)
    plt.ylabel("Cumulative Return")
    plt.xlabel("Date")
    plt.legend()
    plt.tight_layout()
    plt.show()

# -------------------------
# Chart 1: Simple Momentum vs Static
# -------------------------
plot_equity_curves(
    {
        "Momentum A (Price > 100MA)": equity_A,
        "Static Equal Weight": static_equity
    },
    "Comparison: Simple Momentum vs Static Equal Weight"
)

# -------------------------
# Chart 2: Simple Momentum vs Golden Cross vs Static
# -------------------------
plot_equity_curves(
    {
        "Momentum A (Price > 100MA)": equity_A,
        "Momentum B (Golden Cross 10/30)": equity_B,
        "Static Equal Weight": static_equity
    },
    "Comparison: Simple Momentum vs Golden Cross vs Static Equal Weight"
)

# -------------------------
# Chart 3: All 4 portfolios
# -------------------------
plot_equity_curves(
    {
        "Momentum A (Price > 100MA)": equity_A,
        "Momentum B (Golden Cross 10/30)": equity_B,
        "Static Equal Weight": static_equity,
        "Risk Parity": rp_equity
    },
    "Comparison: All Portfolio Strategies"
)

