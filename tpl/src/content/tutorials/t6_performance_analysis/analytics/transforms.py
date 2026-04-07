import pandas as pd

def load_returns(path: str) -> pd.DataFrame:
    df = pd.read_csv(path, parse_dates=["date"])

    required_cols = {"date", "fund", "benchmark"}
    if not required_cols.issubset(df.columns):
        raise ValueError("Missing required columns")

    df = df.sort_values("date")

    if df["date"].duplicated().any():
        raise ValueError("Duplicate dates detected")

    if df.isnull().any().any():
        raise ValueError("Missing values detected")

    return df