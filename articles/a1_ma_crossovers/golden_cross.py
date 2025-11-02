import pandas as pd
import matplotlib.pyplot as plt
import numpy as np

# ------------------------
# Add moving averages
# ------------------------
def add_moving_averages(df, short_window, long_window):
    df[f"SMA_{short_window}"] = df["Close"].rolling(window=short_window).mean()
    df[f"SMA_{long_window}"] = df["Close"].rolling(window=long_window).mean()
    return df

# ------------------------
# Single-window backtest
# ------------------------
def backtest_strategy(df, short_window, long_window):
    df = add_moving_averages(df.copy(), short_window, long_window)
    df = df.dropna(subset=[f"SMA_{long_window}"])
    df["signal"] = 0
    df.loc[df[f"SMA_{short_window}"] > df[f"SMA_{long_window}"], "signal"] = 1
    df["returns"] = df["Close"].pct_change()
    df["strategy"] = df["signal"].shift(1) * df["returns"]
    df["cum_strategy"] = (1 + df["strategy"]).cumprod()
    final_return = df["cum_strategy"].iloc[-1] - 1
    return final_return, df

# ------------------------
# Multiple parameter sets backtest
# ------------------------
def run_backtests(df, window=252):
    results = []
    param_sets = [
        (5, 20), (5, 30), (10, 30),
        (10, 100), (10, 200), (20, 200), (50, 200)
    ]
    for short_window, long_window in param_sets:
        signals = pd.DataFrame(index=df.index)
        signals['short_mavg'] = df['Close'].rolling(window=short_window).mean()
        signals['long_mavg'] = df['Close'].rolling(window=long_window).mean()
        signals['signal'] = 0
        signals.loc[signals.index[short_window:], 'signal'] = np.where(
            signals['short_mavg'][short_window:] > signals['long_mavg'][short_window:], 1, 0
        )
        returns = df['Close'].pct_change()
        strategy_returns = returns * signals['signal'].shift(1)
        # Convert to percentages
        avg_return = strategy_returns.mean() * window * 100
        volatility = strategy_returns.std() * np.sqrt(window) * 100
        results.append({
            'short_window': short_window,
            'long_window': long_window,
            'avg_return': avg_return,
            'volatility': volatility
        })
    return pd.DataFrame(results)

# ------------------------
# Run golden crossover for multiple files
# ------------------------
def run_backtests_for_files(filenames):
    all_results = []
    for filename in filenames:
        df = pd.read_csv(filename, parse_dates=["Date"], index_col="Date")
        cutoff_date = df.index.max() - pd.DateOffset(years=10)
        df = df.loc[df.index >= cutoff_date]
        results = run_backtests(df)
        results["symbol"] = filename.replace(".CSV", "")
        all_results.append(results)
    return pd.concat(all_results, ignore_index=True)

def bh_return_vol_windows(filenames, window_size=252, step=20):
    all_points = []
    for filename in filenames:
        df = pd.read_csv(filename, parse_dates=["Date"], index_col="Date")
        cutoff_date = df.index.max() - pd.DateOffset(years=10)
        df = df.loc[df.index >= cutoff_date]

        for start in range(0, len(df) - window_size + 1, step):
            window_df = df.iloc[start:start+window_size]
            daily_returns = window_df['Close'].pct_change()

            bh_return = window_df['Close'].iloc[-1] / window_df['Close'].iloc[0] - 1
            bh_vol = daily_returns.std() * np.sqrt(window_size)

            all_points.append({
                "symbol": filename.replace(".CSV", ""),
                "return": bh_return * 100,
                "volatility": bh_vol * 100
            })
    return pd.DataFrame(all_points)


# ------------------------
# Average buy-and-hold return and volatility
# ------------------------
def average_bh_return_vol(filenames, window_size=252, step=20):
    results = []
    for filename in filenames:
        df = pd.read_csv(filename, parse_dates=["Date"], index_col="Date")
        cutoff_date = df.index.max() - pd.DateOffset(years=10)
        df = df.loc[df.index >= cutoff_date]
        bh_returns = []
        bh_vols = []
        for start in range(0, len(df) - window_size + 1, step):
            window_df = df.iloc[start:start+window_size]
            daily_returns = window_df['Close'].pct_change()
            bh_returns.append(window_df['Close'].iloc[-1] / window_df['Close'].iloc[0] - 1)
            bh_vols.append(daily_returns.std() * np.sqrt(window_size))
        results.append({
            "symbol": filename.replace(".CSV", ""),
            "avg_return": np.mean(bh_returns) * 100,      # percentage
            "avg_volatility": np.mean(bh_vols) * 100     # percentage
        })
    return pd.DataFrame(results)

# ------------------------
# Main: Produce 3 charts
# ------------------------
if __name__ == "__main__":
    filenames = [
        "data/AAPL.NAS@USXE.CSV",
        "data/BHP.ASX@TME.CSV",
        "data/CBA.ASX@TME.CSV"
    ]

    df_gc = run_backtests_for_files(filenames)
    df_bh = average_bh_return_vol(filenames)

    symbols = df_gc["symbol"].unique()
    colors = plt.cm.tab10.colors

# ------------------------
# 1. Golden Crossover Only
# ------------------------
plt.figure(figsize=(12,7))
for i, symbol in enumerate(symbols):
    subset = df_gc[df_gc["symbol"] == symbol]
    plt.scatter(subset["volatility"], subset["avg_return"],
                c=[colors[i % len(colors)]], alpha=0.6, s=80, label=symbol.replace("data/", ""))
    for _, row in subset.iterrows():
        plt.text(row["volatility"], row["avg_return"], f"{row['short_window']}/{row['long_window']}",
                 fontsize=8, ha='right', va='bottom', color=colors[i % len(colors)])

# Add padding
y_min = df_gc["avg_return"].min()
y_max = df_gc["avg_return"].max()
y_padding = (y_max - y_min) * 0.05
plt.ylim(y_min - y_padding, y_max + y_padding)

x_min = df_gc["volatility"].min()
x_max = df_gc["volatility"].max()
x_padding = (x_max - x_min) * 0.05
plt.xlim(x_min - x_padding, x_max + x_padding)

plt.xlabel("Average Standard Deviation (%)")
plt.ylabel("Average Return (%)")
plt.title("Golden Crossover: Average Return vs Volatility (Last 10 Years)")
plt.grid(True, linestyle='--', alpha=0.7)
plt.axhline(0, color='black', linewidth=1.5)  # thicker 0 line
plt.legend(loc="upper left")
plt.show()

# ------------------------
# 2. Buy-and-Hold (All Windows)
# ------------------------
df_bh_points = bh_return_vol_windows(filenames)

plt.figure(figsize=(12,7))
for i, symbol in enumerate(df_bh_points["symbol"].unique()):
    subset = df_bh_points[df_bh_points["symbol"] == symbol]
    plt.scatter(subset["volatility"], subset["return"], s=60, alpha=0.6, label=symbol.replace("data/", ""))

# Padding
y_min = df_bh_points["return"].min()
y_max = df_bh_points["return"].max()
y_padding = (y_max - y_min) * 0.05
plt.ylim(y_min - y_padding, y_max + y_padding)

x_min = df_bh_points["volatility"].min()
x_max = df_bh_points["volatility"].max()
x_padding = (x_max - x_min) * 0.05
plt.xlim(x_min - x_padding, x_max + x_padding)

plt.xlabel("Standard Deviation (%)")
plt.ylabel("Return (%)")
plt.title("Buy and Hold (All 1-Year Windows, Last 10 Years)")
plt.grid(True, linestyle='--', alpha=0.7)
plt.axhline(0, color='black', linewidth=1.5)
plt.legend(loc="upper left")
plt.show()

# ------------------------
# 3. Comparison Chart (Golden Crossover vs Buy and Hold)
# ------------------------
plt.figure(figsize=(12,7))

for i, symbol in enumerate(symbols):
    # Subset for this stock
    subset_gc = df_gc[df_gc["symbol"] == symbol]
    avg_gc_return = subset_gc["avg_return"].mean()
    avg_gc_vol = subset_gc["volatility"].mean()
    
    # Individual golden crossovers
    plt.scatter(subset_gc["volatility"], subset_gc["avg_return"],
                c=[colors[i % len(colors)]], alpha=0.6, s=80)
    for _, row in subset_gc.iterrows():
        plt.text(row["volatility"], row["avg_return"], f"{row['short_window']}/{row['long_window']}",
                 fontsize=8, ha='right', va='bottom', color=colors[i % len(colors)])

    # Average golden crossover
    plt.scatter(avg_gc_vol, avg_gc_return, marker='X', s=100, c=[colors[i % len(colors)]], edgecolor='black')

    # Buy and hold points
    subset_bh = df_bh[df_bh["symbol"] == symbol]
    plt.scatter(subset_bh["avg_volatility"], subset_bh["avg_return"],
                marker='D', s=80, c=[colors[i % len(colors)]], alpha=0.7)
    
    for _, row in subset_bh.iterrows():
        delta_return = row["avg_return"] - avg_gc_return
        delta_vol = row["avg_volatility"] - avg_gc_vol
        
        plt.text(
            row["avg_volatility"] + 0.2,
            row["avg_return"] + 0.5,
            f"+{delta_return:.1f}% return\n+{delta_vol:.1f}% vol",
            fontsize=8, ha='left', va='bottom', color=colors[i % len(colors)]
        )

        plt.plot([avg_gc_vol, row["avg_volatility"]],
                 [avg_gc_return, row["avg_return"]],
                 linestyle='dotted', color=colors[i % len(colors)])

# Padding for chart
all_returns = pd.concat([df_gc["avg_return"], df_bh["avg_return"]])
all_vols = pd.concat([df_gc["volatility"], df_bh["avg_volatility"]])
y_min = all_returns.min()
y_max = all_returns.max()
y_padding = (y_max - y_min) * 0.05
plt.ylim(y_min - y_padding, y_max + y_padding)

x_min = all_vols.min()
x_max = all_vols.max()
x_padding = (x_max - x_min) * 0.05
plt.xlim(x_min - x_padding, x_max + x_padding)

# Labels and grid
plt.xlabel("Average Standard Deviation (%)")
plt.ylabel("Average Return (%)")
plt.title("Golden Crossover vs Buy and Hold (Last 10 Years)")
plt.grid(True, linestyle='--', alpha=0.7)
plt.axhline(0, color='black', linewidth=1.5)

# ------------------------
# Custom legend
# ------------------------
from matplotlib.lines import Line2D

legend_elements = []
for i, symbol in enumerate(symbols):
    legend_elements.append(Line2D([0], [0], marker='o', color='w', label=symbol.replace("data/", ""),
                                  markerfacecolor=colors[i % len(colors)], markersize=10))
# Add shape explanation
legend_elements.append(Line2D([0], [0], marker='X', color='w', label='Average Golden Crossover',
                              markerfacecolor='grey', markeredgecolor='black', markersize=10))
legend_elements.append(Line2D([0], [0], marker='D', color='w', label='Average Buy and Hold',
                              markerfacecolor='grey', markeredgecolor='black', markersize=10))

plt.legend(handles=legend_elements, loc='upper left')
plt.show()










