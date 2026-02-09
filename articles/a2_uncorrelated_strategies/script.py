import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import yfinance as yf

# --------------------------------------------------
# 1. Choose assets (tickers from Yahoo Finance)
# --------------------------------------------------
tickers = ["SPY", "GLD", "IEF"]   # equities, gold, bonds
num_assets = len(tickers)

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
# 3. Generate moving averages
# --------------------------------------------------

ma_window = 100

moving_average = prices.rolling(window=ma_window).mean()

# Remove invalid entries (for days prior to moving average window)
prices = prices.loc[moving_average.dropna().index]
moving_average = moving_average.dropna()

print(f"{ma_window}-day moving average sample:")
print(moving_average.head())

# --------------------------------------------------
# 4. Generate momentum signal and reallocation weights
# --------------------------------------------------

# Baseline equal weight portfolio
base_weight = 1 / num_assets

# Minimum diversification constraint: Each asset must retain at least x% of its baseline weight
min_diversification = 0.2
min_weight = base_weight * min_diversification

# Momentum signal: 1 if price > MA, else 0
signal = (prices > moving_average).astype(int)

print("Momentum signal sample:")
print(signal.to_string())
print()

