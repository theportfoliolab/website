import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

filenames = ["BITCOINUSD.CX@IRX.CSV", "SPY.AXW@TME.CSV", "XAUUSD.FX@NFX.CSV"]

prices = pd.DataFrame()

for symbol in filenames:
    df = pd.read_csv(f"data/{symbol}")
    df["Date"] = pd.to_datetime(df["Date"], format="%d-%b-%Y")
    df = df[["Date", "Close"]]                     # only Date + Close
    df = df.rename(columns={"Close": symbol})      # rename Close column
    print(df.head)
    if prices.empty:
        prices = df
    else:
        prices = prices.merge(df, on="Date", how="outer")  # keep all days

    print(df.head)

# Clean and align
prices = (
    prices.set_index("Date")
          .sort_index()
          .ffill()         # fill missing values
          .dropna(how="any")
          .loc["2015":]    # start at 2015
)

returns = prices.pct_change().dropna()

print("Merged rows:", len(prices))
print(prices.head())
print()
print("Return rows:", len(returns))
print(returns.head())
