import os
import sys
import pandas as pd

from quantile_symbolic_encoding import quantile_symbolic_encoding
from sax_encoding import sax_symbolic_encoding
from volatility_encoding import volatility_regime_encoding


def main():

    if len(sys.argv) != 2:
        print("Usage: python encode.py <filename.csv>")
        sys.exit(1)

    # Resolve project root
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)
    data_folder = os.path.join(project_root, "data")

    input_filename = sys.argv[1]
    input_path = os.path.join(data_folder, input_filename)

    if not os.path.exists(input_path):
        print(f"File not found: {input_path}")
        sys.exit(1)

    print("Loading data...")
    df = pd.read_csv(input_path)

    if "log_return" not in df.columns:
        raise ValueError("Input file must contain 'log_return' column.")

    # Drop NaNs in log_return (usually first row)
    df = df.dropna(subset=["log_return"]).copy()

    print("Applying quantile symbolic encoding (k=5)...")
    df["symbol_qse"] = quantile_symbolic_encoding(df["log_return"])
    # Safety: fill NaNs with 'X' if any
    df["symbol_qse"] = df["symbol_qse"].fillna("X")

    print("Applying symbolic aggregate approximation (n = 5)...")
    df["symbol_sax"] = sax_symbolic_encoding(df["log_return"], n_symbols=5)
    # Safety: fill NaNs with 'X' if any
    df["symbol_sax"] = df["symbol_sax"].fillna("X")

    print("Applying volatility regime encoding (window=20, k=5)...")
    df["symbol_vre"] = volatility_regime_encoding(df["log_return"])
    # No fillna needed: VRE already uses 'X' for missing rows

    # Save encoded CSV
    base_name = os.path.splitext(input_filename)[0]
    output_filename = f"{base_name}_encoded.csv"
    output_path = os.path.join(data_folder, output_filename)

    df.to_csv(output_path, index=False)

    print(f"Saved symbolic dataset to {output_path}")
    print("Done.")


if __name__ == "__main__":
    main()
