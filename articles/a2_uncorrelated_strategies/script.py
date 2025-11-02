# filename: analysis/uncorrelated_strategies.py
# Python 3.10+
# pip install pandas numpy yfinance matplotlib

from __future__ import annotations
import os
from dataclasses import dataclass
from typing import Dict, Tuple, List
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

try:
    import yfinance as yf
except Exception:
    yf = None


# ------------------------------
# Config
# ------------------------------
START = "2006-01-01"     # regime-rich window
END   = None             # to latest
TARGET_VOL = 0.10        # per-strategy annual vol target (10%)
LEVERAGE_CAP = 3.0       # cap to avoid extreme scaling
SIGMA_LOOKBACK = 20      # days for realized vol estimate
RB_FREQ = "M"            # monthly rebal for combo
WEIGHTING = "inverse_vol"  # "equal" or "inverse_vol"
COST_BPS_PER_TURN = 2.0  # bps per trade (enter/exit) equivalent
DATA_DIR = "./data"      # local CSV folder if available

# Primary tickers (with fallback for DBC -> GLD)
TICKERS_PRIMARY = ["SPY", "IEF", "DBC"]


# ------------------------------
# Utilities
# ------------------------------
def load_local_csv(symbol: str, folder: str) -> pd.Series | None:
    """
    Try to load a CSV from ./data in a few common formats.
    Returns a pandas Series of adjusted close indexed by date, or None.
    """
    if not os.path.isdir(folder):
        return None

    # common naming patterns
    candidates = [
        f"{symbol}.csv", f"{symbol}.CSV",
        f"{symbol}.us.csv", f"{symbol}.US.csv",
        # Your repo examples looked like AAPL.NAS@USXE.CSV — we’ll also try contains
    ]

    # If there is a file that contains the symbol exactly, prefer it
    files = os.listdir(folder)
    # direct candidates first
    for c in candidates:
        p = os.path.join(folder, c)
        if os.path.exists(p):
            s = _read_close_series(p)
            if s is not None:
                return s

    # fuzzy search: file contains the symbol pattern
    for fn in files:
        if symbol.upper() in fn.upper() and fn.lower().endswith(".csv"):
            p = os.path.join(folder, fn)
            s = _read_close_series(p)
            if s is not None:
                return s
    return None


def _read_close_series(path: str) -> pd.Series | None:
    try:
        df = pd.read_csv(path)
        # Make column names case-insensitive
        cols = {c.lower(): c for c in df.columns}
        # Try standard columns
        if "date" in cols:
            df["Date"] = pd.to_datetime(df[cols["date"]])
            df.set_index("Date", inplace=True)
        else:
            # try to parse first column as date
            df.iloc[:, 0] = pd.to_datetime(df.iloc[:, 0], errors="coerce")
            df = df.set_index(df.columns[0]).dropna(axis=0, subset=[df.columns[1]])

        # Try prefer Adj Close, else Close or last numeric column
        for cand in ["Adj Close", "AdjClose", "Adjusted Close", "Close", "close", "Adj", "Value"]:
            if cand in df.columns:
                series = pd.to_numeric(df[cand], errors="coerce").dropna()
                series.name = os.path.splitext(os.path.basename(path))[0]
                return series.asfreq("B").interpolate(limit=5)

        # Fallback: last numeric column
        numeric_cols = df.select_dtypes(include=[np.number]).columns
        if len(numeric_cols) > 0:
            series = df[numeric_cols[-1]].dropna()
            series.name = os.path.splitext(os.path.basename(path))[0]
            return series.asfreq("B").interpolate(limit=5)
    except Exception:
        return None
    return None


def load_prices(tickers: List[str], start: str = START, end: str | None = END) -> pd.DataFrame:
    """
    Load adjusted close prices for tickers from local CSVs if present,
    otherwise try yfinance. Returns DataFrame with business day frequency.
    """
    out = {}
    for t in tickers:
        s = load_local_csv(t, DATA_DIR)
        if s is not None:
            out[t] = s
    missing = [t for t in tickers if t not in out]

    if missing and yf is not None:
        data = yf.download(missing, start=start, end=end, auto_adjust=True, progress=False)
        if isinstance(data, pd.DataFrame) and "Close" in data.columns:
            if len(missing) == 1:
                out[missing[0]] = data["Close"].rename(missing[0])
            else:
                for t in missing:
                    if ("Close", t) in data.columns:
                        out[t] = data[("Close", t)].rename(t)

    prices = pd.concat(out.values(), axis=1).sort_index().dropna(how="all")
    prices = prices.loc[prices.index >= pd.to_datetime(start)]
    if end:
        prices = prices.loc[prices.index <= pd.to_datetime(end)]

    # Business day frequency & light interpolation for small gaps
    prices = prices.asfreq("B").interpolate(limit=5)
    return prices


def daily_returns(prices: pd.DataFrame) -> pd.DataFrame:
    ret = prices.pct_change().fillna(0.0)
    ret.replace([np.inf, -np.inf], 0.0, inplace=True)
    return ret


def ann_vol(s: pd.Series) -> float:
    return np.sqrt(252) * s.std(ddof=0)


def cagr(s: pd.Series) -> float:
    if len(s) < 2:
        return 0.0
    total = s.iloc[-1] / s.iloc[0]
    years = (s.index[-1] - s.index[0]).days / 365.25
    return total ** (1 / years) - 1 if years > 0 else np.nan


def sharpe(returns: pd.Series, rf: float = 0.0) -> float:
    # rf assumed 0 for simplicity (daily rf ~ 0)
    ann_ret = (1 + returns).prod() ** (252 / max(len(returns), 1)) - 1
    return (ann_ret - rf) / ann_vol(returns)


def max_drawdown(equity: pd.Series) -> float:
    peak = equity.cummax()
    dd = equity / peak - 1.0
    return dd.min()


def apply_transaction_costs(signal: pd.Series, scale: pd.Series, cost_bps: float) -> pd.Series:
    """
    Cost applied when there is a change in exposure (enter/exit).
    Costs deducted as a daily return: cost_bps * |Δ(position)| / 1e4
    position = signal * scale
    """
    position = (signal.fillna(0.0) * scale.fillna(0.0)).clip(-LEVERAGE_CAP, LEVERAGE_CAP)
    dpos = position.diff().abs().fillna(0.0)
    daily_cost = (cost_bps / 1e4) * dpos
    return daily_cost


# ------------------------------
# Strategy definitions
# ------------------------------
@dataclass
class StrategySpec:
    name: str
    symbol: str
    kind: str  # "trend", "meanrev", "carry" or "breakout"


def signal_trend(prices: pd.Series, lookback: int = 200) -> pd.Series:
    sma = prices.rolling(lookback, min_periods=lookback//2).mean()
    sig = (prices > sma).astype(float)
    return sig


def signal_meanrev(prices: pd.Series, z_lookback: int = 5, z_entry: float = -1.0, z_exit: float = 0.0) -> pd.Series:
    ret = prices.pct_change()
    z = (ret - ret.rolling(z_lookback).mean()) / (ret.rolling(z_lookback).std(ddof=0) + 1e-12)
    # Long when deeply negative (oversold), flat when back to neutral
    sig = pd.Series(0.0, index=prices.index)
    in_pos = False
    for i in range(len(prices)):
        if not in_pos and z.iloc[i] < z_entry:
            in_pos = True
        elif in_pos and z.iloc[i] >= z_exit:
            in_pos = False
        sig.iloc[i] = 1.0 if in_pos else 0.0
    return sig


def signal_breakout(prices: pd.Series, up: int = 20, dn: int = 10) -> pd.Series:
    """
    Donchian-style: long when price closes at a new N-day high; exit on M-day low
    """
    rolling_high = prices.rolling(up, min_periods=up//2).max()
    rolling_low  = prices.rolling(dn, min_periods=dn//2).min()
    sig = pd.Series(0.0, index=prices.index)
    in_pos = False
    for i in range(len(prices)):
        if not in_pos and prices.iloc[i] >= rolling_high.iloc[i]:
            in_pos = True
        elif in_pos and prices.iloc[i] <= rolling_low.iloc[i]:
            in_pos = False
        sig.iloc[i] = 1.0 if in_pos else 0.0
    return sig


def signal_carry_buyhold(prices: pd.Series) -> pd.Series:
    return pd.Series(1.0, index=prices.index)


def vol_targeted_returns(prices: pd.Series,
                         signal: pd.Series,
                         target_vol: float = TARGET_VOL,
                         lookback: int = SIGMA_LOOKBACK,
                         cost_bps: float = COST_BPS_PER_TURN,
                         cap: float = LEVERAGE_CAP) -> pd.Series:
    r = prices.pct_change().fillna(0.0)
    # realized vol (use rolling on raw daily returns)
    realized = r.rolling(lookback).std(ddof=0) * np.sqrt(252)
    scale = (target_vol / (realized.replace(0, np.nan))).clip(upper=cap).fillna(0.0)

    # position based on yesterday's info (no lookahead)
    pos = (signal.shift(1).fillna(0.0) * scale.shift(1).fillna(0.0)).clip(-cap, cap)
    gross = pos * r

    # transaction cost when changing exposure
    costs = apply_transaction_costs(signal=signal.shift(1), scale=scale.shift(1), cost_bps=cost_bps)
    net = gross - costs
    net.replace([np.inf, -np.inf], 0.0, inplace=True)
    return net


def build_strategies(prices: pd.DataFrame) -> Dict[str, pd.Series]:
    """
    Assign strategy to asset for decorrelation:
      - SPY: mean reversion
      - IEF: carry (buy & hold)
      - DBC or GLD: trend / breakout (commodities or gold trend well)
    If DBC missing, use GLD from yfinance automatically.
    """
    columns = list(prices.columns)
    have = set(columns)

    # Choose commodity proxy: DBC if present else GLD
    com_sym = "DBC" if "DBC" in have else ("GLD" if "GLD" in have else None)
    if com_sym is None:
        # Try to fetch GLD quickly if available via yfinance
        if yf is not None:
            extra = load_prices(["GLD"])
            prices = prices.join(extra, how="outer")
            com_sym = "GLD"

    # Signals
    out = {}

    if "SPY" in have:
        sig_mr = signal_meanrev(prices["SPY"], z_lookback=5, z_entry=-1.0, z_exit=0.0)
        out["MR_SPY"] = vol_targeted_returns(prices["SPY"], sig_mr)

    if "IEF" in have:
        sig_cy = signal_carry_buyhold(prices["IEF"])
        out["CY_IEF"] = vol_targeted_returns(prices["IEF"], sig_cy)

    if com_sym in have:
        # Trend is reliable on commodities/gold
        sig_tf = signal_trend(prices[com_sym], lookback=200)
        out[f"TF_{com_sym}"] = vol_targeted_returns(prices[com_sym], sig_tf)
    elif len(columns) > 0:
        # Fallback: run breakout on whatever else we have (e.g., first column)
        sym0 = columns[0]
        sig_bo = signal_breakout(prices[sym0], up=20, dn=10)
        out[f"BO_{sym0}"] = vol_targeted_returns(prices[sym0], sig_bo)

    return out, prices


def monthly_weights(strat_df: pd.DataFrame, method: str = WEIGHTING, lookback_days: int = 60) -> pd.DataFrame:
    """
    Create a monthly weights DataFrame aligned to business days.
    - equal: equal weights each month
    - inverse_vol: inverse of trailing vol of strategy returns
    """
    # month ends
    month_ends = strat_df.resample(RB_FREQ).last().index
    weights_records = []

    for dt in month_ends:
        hist_end = dt
        hist_start = dt - pd.Timedelta(days=lookback_days)
        window = strat_df.loc[hist_start:hist_end]
        if window.dropna(how="all").empty:
            continue

        if method == "equal":
            w = np.ones(window.shape[1])
        else:
            vols = window.std(ddof=0).replace(0.0, np.nan)
            inv = 1.0 / vols
            inv = inv.replace([np.inf, -np.inf], np.nan).fillna(0.0)
            if inv.sum() == 0:
                w = np.ones_like(inv.values)
            else:
                w = inv.values

        w = w / w.sum() if w.sum() != 0 else np.ones_like(w) / len(w)
        weights_records.append(pd.Series(w, index=window.columns, name=dt))

    w_m = pd.DataFrame(weights_records)
    # forward fill weights daily until next rebalance
    w_daily = w_m.reindex(strat_df.index).ffill().dropna(how="all")
    return w_daily.loc[strat_df.index]


def summarize(port_ret: pd.Series, label: str) -> Dict[str, float]:
    eq = (1.0 + port_ret).cumprod()
    return {
        "CAGR": cagr(eq),
        "Vol": ann_vol(port_ret),
        "Sharpe": sharpe(port_ret),
        "MaxDD": max_drawdown(eq),
    }


def main():
    # 1) Load prices
    tickers = TICKERS_PRIMARY.copy()
    # If you know you have GLD locally instead of DBC, you can add it:
    if os.path.isdir(DATA_DIR):
        # opportunistically include GLD if present
        gl = load_local_csv("GLD", DATA_DIR)
        if gl is not None and "GLD" not in tickers:
            tickers.append("GLD")

    prices = load_prices(tickers, start=START, end=END)
    assert not prices.empty, "No price data loaded. Add CSVs to ./data or enable yfinance."

    # 2) Build strategies (signals + vol targeting → daily returns)
    strat_ret_map, prices = build_strategies(prices)
    strat_df = pd.DataFrame(strat_ret_map).dropna(how="all")
    assert strat_df.shape[1] >= 2, "Need at least two strategies for diversification."

    # 3) Combine strategies with monthly rebalancing
    w_daily = monthly_weights(strat_df, method=WEIGHTING, lookback_days=60)
    # Align
    common_idx = strat_df.index.intersection(w_daily.index)
    strat_df = strat_df.loc[common_idx]
    w_daily = w_daily.loc[common_idx, strat_df.columns]

    port_ret = (w_daily * strat_df).sum(axis=1)

    # 4) Metrics
    results = {}
    for col in strat_df.columns:
        results[col] = summarize(strat_df[col], col)
    results["COMBO"] = summarize(port_ret, "COMBO")

    metrics_df = pd.DataFrame(results).T[["CAGR", "Vol", "Sharpe", "MaxDD"]].sort_values("Sharpe", ascending=False)

    # 5) Correlations between strategy returns
    corr = strat_df.corr()

    # 6) Plots
    eq = (1.0 + strat_df).cumprod()
    eq_combo = (1.0 + port_ret).cumprod()

    plt.figure(figsize=(11, 6))
    for col in eq.columns:
        plt.plot(eq.index, np.log(eq[col]), label=col)
    plt.plot(eq_combo.index, np.log(eq_combo), linewidth=2.0, label="COMBO", linestyle="--")
    plt.title("Log Equity Curves: Individual Strategies vs Combined")
    plt.legend()
    plt.tight_layout()
    plt.show()

    print("\n=== Strategy Metrics (after vol targeting & costs) ===")
    print(metrics_df.to_string(float_format=lambda x: f"{x:0.3f}"))

    print("\n=== Correlation of Daily Strategy Returns ===")
    print(corr.to_string(float_format=lambda x: f"{x:0.2f}"))

    # Sanity: show which single strategy had best CAGR vs combo
    best_single = metrics_df.drop(index="COMBO", errors="ignore")["CAGR"].idxmax()
    print(f"\nBest single by CAGR: {best_single} | CAGR={metrics_df.loc[best_single, 'CAGR']:.3%}")
    print(f"Combo CAGR: {metrics_df.loc['COMBO', 'CAGR']:.3%}")
    print(f"Combo Sharpe: {metrics_df.loc['COMBO', 'Sharpe']:.2f} | Best single Sharpe: {metrics_df.drop(index='COMBO', errors='ignore')['Sharpe'].max():.2f}")

    # Optional: export CSVs for blog tables
    out_dir = "./outputs"
    os.makedirs(out_dir, exist_ok=True)
    metrics_df.to_csv(os.path.join(out_dir, "metrics.csv"))
    corr.to_csv(os.path.join(out_dir, "correlations.csv"))
    pd.concat([eq, eq_combo.rename("COMBO")], axis=1).to_csv(os.path.join(out_dir, "equity_curves.csv"))

    print(f"\nExported: {out_dir}/metrics.csv, {out_dir}/correlations.csv, {out_dir}/equity_curves.csv")


if __name__ == "__main__":
    pd.set_option("display.width", 140)
    pd.set_option("display.max_columns", 20)
    main()
