import{n as e,r as t,s as n}from"./index-Bh-m3a3A.js";import{t as r}from"./text-BHlF0QQh.js";var i=n(t(),1);const a={title:`Data Cleaning in Pandas`,description:`A tutorial on detecting, inspecting, and cleaning real-world financial data using pandas.`,date:`2025-02-20`,tags:[`python`,`pandas`,`data cleaning`],type:`tutorial`,slug:`t2_data_cleaning_pandas`};function o(){return(0,i.jsxs)(e,{children:[(0,i.jsx)(r,{heading:`Intro`,content:`Once your financial data is loaded into a DataFrame, the next step is almost always cleaning it.
Real-world data — especially financial data — is rarely perfect. Missing values, inconsistent date formats, extra whitespace, or duplicated rows can all cause problems when performing calculations or visualisations.

In this tutorial, you’ll learn how to detect, inspect, and clean these issues using pandas.
By the end, you’ll have a clean, analysis-ready dataset that can be easily saved for later use.`}),(0,i.jsx)(r,{heading:`Setup`,content:`To follow along, make sure you have:`,bullets:[`Basic familiarity with pandas and DataFrames (from the previous tutorial)`,`A working Python setup and pandas installed (pip install pandas)`,`A CSV file ready — for example, the same AAPL daily prices file from the last tutorial.`,`You can also fetch the example files and scripts from the repository if provided, or simply copy the code samples below.`]}),(0,i.jsx)(r,{heading:`1. Loading and Inspecting the Data`,content:`Let’s start by loading the CSV file and taking a quick look at the data.`,code:`import pandas as pd

filename = "aapl_prices.csv"
df = pd.read_csv(filename)

print(df.head())
print(df.info())`}),(0,i.jsx)(r,{content:`You should always start by checking:

.head() — verifies the first few rows look correct

.info() — confirms column names, data types, and whether you have missing values

If you notice columns like Date are stored as strings (object), or numeric columns appear as text, don’t worry — we’ll fix that next.`}),(0,i.jsx)(r,{heading:`2. Parsing Dates and Setting Index`,content:`Dates are a crucial part of financial data, so it’s best to convert them to proper datetime objects.`,code:`df["Date"] = pd.to_datetime(df["Date"], errors="coerce")
df = df.set_index("Date")
print(df.head())`}),(0,i.jsx)(r,{content:`Here:

pd.to_datetime() converts the Date column into a datetime object.

errors="coerce" replaces invalid date entries with NaT (Not a Time).

.set_index("Date") makes Date the DataFrame’s index, making time-based operations easier later.`}),(0,i.jsx)(r,{heading:`3. Identifying Missing Values`,content:`Next, check for missing or incomplete data.`,code:`print(df.isnull().sum())`}),(0,i.jsx)(r,{content:`This shows the number of missing values per column.
You can also view which rows are affected:`,code:`print(df[df.isnull().any(axis=1)])`}),(0,i.jsx)(r,{content:`Financial data often has missing prices or volumes (e.g. holidays or partial trading days).
You’ll need to decide whether to remove or fill these gaps.`}),(0,i.jsx)(r,{heading:`4. Handling Missing Data`,content:`There are two main ways to deal with missing values: dropping or filling.

Dropping rows:`,code:`df = df.dropna()`}),(0,i.jsx)(r,{content:`Removes any rows that contain missing values.
Use this only if the dataset is large and the missing portion is small.

Filling values:`,code:`df["Close"] = df["Close"].fillna(method="ffill")  # forward fill
df["Volume"] = df["Volume"].fillna(0)             # replace with zero`}),(0,i.jsx)(r,{content:`Forward-fill (method="ffill") is common for financial time series — it carries forward the last valid value when data is missing.`}),(0,i.jsx)(r,{heading:`5. Converting Data Types`,content:`Sometimes, CSV files load numeric data as text. This can prevent calculations.
You can fix this using pd.to_numeric():`,code:`df["Open"] = pd.to_numeric(df["Open"], errors="coerce")
df["Close"] = pd.to_numeric(df["Close"], errors="coerce")`}),(0,i.jsx)(r,{content:`This will convert text-like numbers into floats, replacing non-numeric entries with NaN.
Then, you can check again with:`,code:`print(df.dtypes)`}),(0,i.jsx)(r,{heading:`6. Removing Duplicates`,content:`Duplicate rows can occur during data merges or exports.
To remove them:`,code:`print("Before:", len(df))
df = df.drop_duplicates()
print("After:", len(df))`}),(0,i.jsx)(r,{content:`If you suspect duplicates only by date, you can specify:`,code:`df = df[~df.index.duplicated(keep="first")]`}),(0,i.jsx)(r,{content:`This ensures only one record per date remains.`}),(0,i.jsx)(r,{heading:`7. Renaming and Reordering Columns`,content:`For consistent analysis, you might want shorter or cleaner column names:`,code:`df = df.rename(columns={
    "Adj": "Adjusted",
    "Trans": "Transactions"
})`}),(0,i.jsx)(r,{content:`To reorder columns:`,code:`df = df[["Code", "Open", "High", "Low", "Close", "Volume"]]`}),(0,i.jsx)(r,{content:`A well-structured dataset is easier to read, document, and reuse.`}),(0,i.jsx)(r,{heading:`8. Detecting and Handling Outliers`,content:`Outliers can distort averages and volatility calculations.
One quick way to check for them is using .describe():`,code:`print(df["Close"].describe())`}),(0,i.jsx)(r,{content:`To filter unrealistic values, you could cap or remove them:`,code:`df = df[(df["Close"] > 0) & (df["Close"] < 10000)]`}),(0,i.jsx)(r,{content:`This ensures all prices are within a reasonable range.`}),(0,i.jsx)(r,{heading:`9. Resampling and Filling Gaps`,content:`To ensure your data covers every trading day (or specific frequency), you can resample by day:`,code:`df = df.resample("D").ffill()`}),(0,i.jsx)(r,{content:`This fills any missing calendar days with the last known value — useful for time-series models that require continuous data.`}),(0,i.jsx)(r,{heading:`10. Verifying Clean Data`,content:`After all transformations, always verify the results:`,code:`print(df.info())
print(df.head())
print(df.describe())`}),(0,i.jsx)(r,{content:`Check that:

No missing or invalid data remains

Columns are in the right format

Dates are correctly parsed and indexed`}),(0,i.jsx)(r,{heading:`11. Saving Clean Data`,content:`Once cleaned, save the new DataFrame for later use.`,code:`df.to_csv("aapl_prices_cleaned.csv", index=True)`}),(0,i.jsx)(r,{content:`It’s good practice to:

Keep the original file untouched

Name your cleaned files clearly (e.g. *_cleaned.csv)

Optionally, export to Excel or parquet for future tutorials`}),(0,i.jsx)(r,{heading:`Summary`,content:`In this tutorial, you learned:

How to detect and fix missing, invalid, or duplicate data

How to correctly parse dates and numeric columns

How to make your dataset consistent and ready for analysis

You now have a clean, analysis-ready DataFrame that can be fed directly into your next steps — such as calculating returns or running backtests.`})]})}export{o as default,a as meta};