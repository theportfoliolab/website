import pandas as pd

from pathlib import Path

def load_returns(path: str) -> pd.DataFrame:
    input_path = Path(path)

    if input_path.is_dir():
        frames = []

        for csv_path in sorted(input_path.glob("*.csv")):
            df = pd.read_csv(csv_path, parse_dates=["date"])

            required_cols = {"date", "fund", "benchmark"}
            if not required_cols.issubset(df.columns):
                raise ValueError(f"Missing required columns in {csv_path.name}")

            df["fund_name"] = csv_path.stem
            frames.append(df)

        if not frames:
            raise ValueError("No CSV files found in input folder")

        df = pd.concat(frames, ignore_index=True)

    else:
        df = pd.read_csv(input_path, parse_dates=["date"])

        required_cols = {"date", "fund_name", "fund", "benchmark"}
        if not required_cols.issubset(df.columns):
            raise ValueError("Missing required columns")

    df = df.sort_values(["fund_name", "date"]).reset_index(drop=True)

    if df.duplicated(subset=["fund_name", "date"]).any():
        raise ValueError("Duplicate fund_name/date combinations detected")

    if df.isnull().any().any():
        raise ValueError("Missing values detected")

    return df
