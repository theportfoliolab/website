import numpy as np
import pandas as pd

def cumulative_growth(returns: pd.Series) -> pd.Series:
    return (1 + returns).cumprod()

def drawdown(cumulative: pd.Series) -> pd.Series:
    peak = cumulative.cummax()
    return (cumulative - peak) / peak

def excess_return(fund: pd.Series, benchmark: pd.Series) -> pd.Series:
    return fund - benchmark