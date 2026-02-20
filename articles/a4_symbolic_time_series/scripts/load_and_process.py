"""
Load and clean daily data for symbolic time series analysis.

Input file: data/<filename>.CSV
Output file: output/<filename>_cleaned.csv
"""

import os
import sys
import pandas as pd
import numpy as np

# =============================
# Load Raw Data
# =============================

def load_raw_data(path: str) -> pd.DataFrame:
    """
    Load raw CSV data
    """
    df = pd.read_csv(path)

    # Standardise column names
    df.columns = [col.strip().lower() for col in df.columns]

    return df


# =============================
# Clean Data
# =============================

def process_data(df: pd.DataFrame) -> pd.DataFrame:
    """
    Clean and prepare dataset for analysis.
    """

    # Ensure required columns exist
    required_cols = {"date", "open", "high", "low", "close", "volume"}
    missing = required_cols - set(df.columns)
    if missing:
        raise ValueError(f"Missing required columns: {missing}")

    # Parse date column
    df["date"] = pd.to_datetime(df["date"], errors="raise")

    # Sort chronologically
    df = df.sort_values("date").reset_index(drop=True)

    # Remove duplicate dates
    df = df.drop_duplicates(subset="date")

    # Ensure numeric types
    numeric_cols = ["open", "high", "low", "close", "volume"]
    df[numeric_cols] = df[numeric_cols].apply(pd.to_numeric, errors="raise")

    # Remove rows with zero or negative prices
    df = df[df["close"] > 0]


    # =============================
    # Additional processing
    # =============================

    # Log returns
    df = add_log_returns(df)

    # Drop first row (NaN return)
    df = df.dropna(subset=["log_return"])

    # Reset index
    df = df.reset_index(drop=True)

    return df

def add_log_returns(df, price_col="close"):
        df = df.copy()
        df["log_return"] = np.log(df[price_col] / df[price_col].shift(1))
        df = df.dropna()
        return df



# =============================
# Save Cleaned Data
# =============================

def save_clean_data(df: pd.DataFrame, path: str) -> None:
    os.makedirs(os.path.dirname(path), exist_ok=True)
    df.to_csv(path, index=False)


# =============================
# Main Execution
# =============================

def main():

    if len(sys.argv) != 2:
        print("Usage: python load_and_clean.py <filename.csv>")
        sys.exit(1)    

    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)
    data_folder = os.path.join(project_root, "data")

    input_filename = sys.argv[1]
    input_path = os.path.join(data_folder, input_filename)

    if not os.path.exists(input_path):
        print(f"File not found: {input_path}")
        sys.exit(1)

    base_name = os.path.splitext(input_filename)[0]
    output_filename = f"{base_name}_cleaned.csv"
    output_path = os.path.join(data_folder, output_filename)

    raw_df = load_raw_data(input_path)

    print("Cleaning data...")
    clean_df = process_data(raw_df)

    print(f"Final dataset contains {len(clean_df)} rows.")

    print("Saving cleaned dataset...")
    save_clean_data(clean_df, output_path)

    print(f"Saved to {output_path}")
    print("Done.")


if __name__ == "__main__":
    main()
