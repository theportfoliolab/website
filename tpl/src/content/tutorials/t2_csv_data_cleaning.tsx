import Body from "@/components/content/body"
import { Text } from "@/components/content/text.tsx"
import type { PostMeta } from "@/components/content/types"

export const meta: PostMeta = {
    title: "How to Clean Financial Data in Pandas",
    description:
        "A practical pandas tutorial for cleaning financial time series, aligning dates, normalising frequency, and preparing data for analysis.",
    date: "2026-03-31",
    tags: ["python", "data", "pandas", "finance"],
    type: "tutorial",
    slug: "clean-financial-data-in-pandas",
    nextInSeriesSlug: "symbolic-encoding-financial-time-series",
    seriesId: "python-and-pandas-introduction",
    seriesTitle: "Introduction to Python and Pandas",
    seriesDescription:
        "A beginner-friendly starting sequence for loading, inspecting, and cleaning tabular data in Python with pandas.",
}

export default function Tutorial() {
    return (
        <Body>
            <Text
                heading="1. Introduction"
                lead="What this tutorial covers:"
                content={`Loading a CSV is easy. Trusting the data is the hard part.

Financial datasets often look clean at first glance, but still contain issues that will quietly break your analysis: invalid dates, duplicated rows, mixed data types, missing values, inconsistent trading calendars, and mismatched data frequency.

In this tutorial, we will build a practical cleaning workflow in pandas using a deliberately messy price file. Then we will extend that workflow to a more realistic scenario: aligning multiple assets on a common timeline and normalising them to a consistent frequency such as daily or monthly.`}
            />

            <Text
                lead="Why this matters:"
                bullets={[
                    "Return calculations are only meaningful if your dates are correct and ordered.",
                    "Joins across multiple instruments will fail or silently misalign if each series follows a different calendar.",
                    "Backtests and charts become unreliable if one dataset is daily, another monthly, and a third includes duplicated timestamps.",
                ]}
            />

            <Text
                lead="What the reader will build:"
                content={`By the end, you will have a repeatable cleaning pipeline that parses dates safely, fixes numeric columns, removes bad rows, handles missing values, aligns multiple series on shared dates, and converts the result to the frequency required for later analysis.`}
            />

            <Text
                heading="2. Setup"
                content={`We will use pandas only. Install it with:`}
                code={`pip install pandas`}
            />

            <Text
                content={`Then start your script with:`}
                code={`import pandas as pd`}
            />

            <Text
                content={`The examples below assume you are working with a CSV similar to the sample tutorial file. It contains several common problems on purpose:`}
                bullets={[
                    "Missing Open and Close values",
                    "A missing Volume entry",
                    "An invalid date such as 32-Feb-2018",
                    "A duplicated trading day",
                    "A non-numeric value like abc inside a price column",
                    "An unrealistic outlier close price of 12000",
                ]}
            />

            <Text
                heading="3. First Inspection"
                content={`Before changing anything, inspect the raw file and confirm what pandas thinks the schema is.`}
                code={`filename = "data.csv"
df = pd.read_csv(filename)

print(df.head(10))
print(df.info())
print(df.isna().sum())`}
            />

            <Text
                content={`This first pass tells you three important things:

1. Whether the columns loaded with the names you expected
2. Which fields already contain missing values
3. Which columns are being treated as text instead of numeric or datetime types

Do not skip this step. Most downstream bugs in a financial workflow start here.`}
            />

            <Text
                heading="4. Parse Dates and Fix Numeric Columns"
                content={`Dates and numeric fields should be normalised early. If these types are wrong, everything else becomes harder.`}
                code={`df["Date"] = pd.to_datetime(df["Date"], format="%d-%b-%Y", errors="coerce")

numeric_columns = ["Open", "High", "Low", "Close", "Volume", "Value", "Trans", "Adj"]
for column in numeric_columns:
    df[column] = pd.to_numeric(df[column], errors="coerce")

print(df.dtypes)`}
            />

            <Text
                content={`Two details matter here:

Using errors="coerce" converts invalid values into missing values instead of crashing the script.

That is exactly what we want. A bad date or bad number should become visible as NaT or NaN so we can handle it explicitly, rather than quietly remaining as a string and contaminating calculations later.`}
            />

            <Text
                lead="Code checkpoint:"
                code={`import pandas as pd

filename = "data.csv"
df = pd.read_csv(filename)

df["Date"] = pd.to_datetime(df["Date"], format="%d-%b-%Y", errors="coerce")

numeric_columns = ["Open", "High", "Low", "Close", "Volume", "Value", "Trans", "Adj"]
for column in numeric_columns:
    df[column] = pd.to_numeric(df[column], errors="coerce")

print(df.head())
print(df.dtypes)
print(df.isna().sum())`}
            />

            <Text
                heading="5. Remove Impossible Dates and Duplicated Rows"
                content={`Now that invalid values have been surfaced, we can remove records that clearly cannot be trusted.`}
                code={`# Drop rows where the date could not be parsed
df = df.dropna(subset=["Date"])

# Sort before checking for duplicate timestamps
df = df.sort_values("Date")

# Keep the first record for each duplicated date
df = df.drop_duplicates(subset=["Date"], keep="first")

print(df[["Date", "Close"]])`}
            />

            <Text
                content={`For time series, duplicated dates are usually more important than duplicated full rows.

If you are merging files from multiple exports, keeping one row per timestamp is usually the correct rule to apply first. In a more advanced workflow, you may instead aggregate duplicates, but you should make that choice deliberately rather than leaving duplicates in the data.`}
            />

            <Text
                heading="6. Set the Date Index"
                content={`Once the Date column is clean enough to trust, move it into the index. This unlocks pandas time-series methods such as resample(), reindex(), and date slicing.`}
                code={`df = df.set_index("Date")
df = df.sort_index()

print(df.head())`}
            />

            <Text
                content={`At this stage, the dataset is structurally closer to a usable price series, but we still need to decide how to treat missing prices and suspicious values.`}
            />

            <Text
                heading="7. Handle Missing Values Without Inventing Bad Prices"
                content={`Not every missing value should be treated the same way.

In finance, price columns and activity columns usually need different rules.`}
                bullets={[
                    "Missing prices may justify forward filling, but only after you have decided on the timeline you want to analyse.",
                    "Missing volume often means the asset did not trade, so filling with zero may be more appropriate than forward filling.",
                    "If core OHLC fields are missing in only a few rows, dropping those rows can be cleaner than trying to repair them.",
                ]}
            />

            <Text
                content={`For this small example, we will remove rows missing core prices, then fill missing volume with zero:`}
                code={`df = df.dropna(subset=["Open", "High", "Low", "Close"])
df["Volume"] = df["Volume"].fillna(0)

print(df.isna().sum())`}
            />

            <Text
                content={`This is a conservative rule. It avoids creating artificial price observations, which is generally safer when you are preparing data for returns, indicators, or backtests.`}
            />

            <Text
                heading="8. Detect Clearly Bad Price Values"
                content={`A dataset can be complete and still be wrong. Outliers deserve a separate check, especially if your source includes adjusted prices, unit conversions, or corrupted rows.`}
                code={`print(df["Close"].describe())

# Example rule: keep only plausible positive close prices
df = df[(df["Close"] > 0) & (df["Close"] < 1000)]`}
            />

            <Text
                content={`The exact threshold depends on the asset. The point is not that 1000 is universally correct. The point is that you should define a plausible range for the series you are analysing and make the filter explicit in code.`}
            />

            <Text
                heading="9. Aligning Dates Across Multiple Assets"
                content={`Cleaning a single series is only half the job. In practice, you usually want to compare or combine several assets, and their trading calendars will not always line up.

For example:
an equity ETF may trade on exchange business days, a macro series may be monthly, and a crypto asset may trade every day.

Before calculating correlations, portfolio returns, or signals, you need all series aligned to a common date index.`}
            />

            <Text
                content={`Here is a simple example using two cleaned close series:`}
                code={`aapl = pd.read_csv("AAPL.NAS@USXE.CSV")
spy = pd.read_csv("SPY.AXW@TME.CSV")

for frame in [aapl, spy]:
    frame["Date"] = pd.to_datetime(frame["Date"], format="%d-%b-%Y", errors="coerce")
    frame["Close"] = pd.to_numeric(frame["Close"], errors="coerce")
    frame.dropna(subset=["Date", "Close"], inplace=True)
    frame.drop_duplicates(subset=["Date"], inplace=True)
    frame.sort_values("Date", inplace=True)
    frame.set_index("Date", inplace=True)

prices = pd.concat(
    [
        aapl["Close"].rename("AAPL"),
        spy["Close"].rename("SPY"),
    ],
    axis=1,
)

print(prices.head())
print(prices.tail())`}
            />

            <Text
                content={`After concat(), pandas aligns rows by date automatically. This is one of the most useful behaviours in the library, but only if your timestamps are already clean.`}
            />

            <Text
                content={`You now need to decide what date set to keep:`}
                bullets={[
                    "Use inner join logic when you only want dates present in every series.",
                    "Use outer join logic when you want the full union of dates and will handle gaps afterwards.",
                    "Forward fill only when it makes economic sense for the variable you are carrying forward.",
                ]}
            />

            <Text
                content={`For strict overlap only:`}
                code={`aligned_prices = prices.dropna()
print(aligned_prices.head())`}
            />

            <Text
                content={`For a broader calendar with explicit filling:`}
                code={`aligned_prices = prices.sort_index().ffill()
print(aligned_prices.head())`}
            />

            <Text
                content={`This choice changes the meaning of your later analysis, so it should never be treated as a purely technical cleanup step.`}
            />

            <Text
                heading="10. Normalising Data Frequency"
                content={`Even after dates are aligned, the dataset may still not be at the frequency you actually need.

Examples:
you may want monthly returns from daily prices, weekly indicators from intraday data, or a daily panel that mixes weekday-only series with seven-day series.

This is where resample() becomes essential.`}
            />

            <Text
                lead="Daily normalisation"
                content={`If you want a daily calendar, reindex or resample to daily frequency and then apply a filling rule deliberately:`}
                code={`daily = df.resample("D").ffill()
print(daily.head())`}
            />

            <Text
                content={`This creates a row for every calendar day, including weekends. That may be useful for some modelling tasks, but not always for trading analysis.`}
            />

            <Text
                lead="Business-day normalisation"
                content={`For market data, business-day frequency is often more sensible:`}
                code={`business_daily = df.resample("B").ffill()
print(business_daily.head())`}
            />

            <Text
                content={`The B frequency uses business days rather than all calendar days, which is usually a better default for equities and ETFs.`}
            />

            <Text
                lead="Monthly normalisation"
                content={`To convert daily closes into month-end closes:`}
                code={`monthly_close = df["Close"].resample("ME").last()
print(monthly_close.head())`}
            />

            <Text
                content={`If you want a full monthly OHLCV dataset, use column-specific aggregation rules instead of blindly taking the last row:`}
                code={`monthly = df.resample("ME").agg({
    "Open": "first",
    "High": "max",
    "Low": "min",
    "Close": "last",
    "Volume": "sum",
})

print(monthly.head())`}
            />

            <Text
                content={`This is the key idea behind frequency normalisation:

prices, ranges, and activity measures should not all be aggregated the same way.

Open should usually be the first value in the period.
High should be the maximum.
Low should be the minimum.
Close should be the last.
Volume is usually summed.`}
            />

            <Text
                heading="11. Build a Reusable Cleaning Function"
                content={`Once the logic works, package it into a function so you can reuse the same rules across multiple files.`}
                code={`def load_and_clean_prices(filename: str) -> pd.DataFrame:
    df = pd.read_csv(filename)

    df["Date"] = pd.to_datetime(df["Date"], format="%d-%b-%Y", errors="coerce")

    numeric_columns = ["Open", "High", "Low", "Close", "Volume", "Value", "Trans", "Adj"]
    for column in numeric_columns:
        if column in df.columns:
            df[column] = pd.to_numeric(df[column], errors="coerce")

    df = df.dropna(subset=["Date"])
    df = df.sort_values("Date")
    df = df.drop_duplicates(subset=["Date"], keep="first")
    df = df.set_index("Date").sort_index()

    core_price_columns = [column for column in ["Open", "High", "Low", "Close"] if column in df.columns]
    df = df.dropna(subset=core_price_columns)

    if "Volume" in df.columns:
        df["Volume"] = df["Volume"].fillna(0)

    if "Close" in df.columns:
        df = df[(df["Close"] > 0) & (df["Close"] < 1000)]

    return df`}
            />

            <Text
                content={`Once that function exists, loading and aligning multiple assets becomes much simpler:`}
                code={`aapl = load_and_clean_prices("AAPL.NAS@USXE.CSV")
msft = load_and_clean_prices("MSFT.NAS@USXE.CSV")
nvda = load_and_clean_prices("NVDA.NAS@USXE.CSV")

close_panel = pd.concat(
    [
        aapl["Close"].rename("AAPL"),
        msft["Close"].rename("MSFT"),
        nvda["Close"].rename("NVDA"),
    ],
    axis=1,
).dropna()

monthly_returns = close_panel.resample("ME").last().pct_change().dropna()
print(monthly_returns.head())`}
            />

            <Text
                heading="12. Final Validation Before Analysis"
                content={`Always finish with a validation pass. After cleaning, check the dataset as if you were seeing it for the first time.`}
                code={`print(df.info())
print(df.head())
print(df.tail())
print(df.index.is_monotonic_increasing)
print(df.index.has_duplicates)
print(df.isna().sum())`}
            />

            <Text
                content={`You should be able to answer yes to these questions:

Are the dates parsed correctly?
Is the index sorted?
Are duplicate timestamps gone?
Are numeric columns genuinely numeric?
Are missing values handled according to an explicit rule?
Is the series at the frequency required for the next stage of analysis?`}
            />

            <Text
                heading="13. Saving Clean Data"
                content={`Once the data is validated, export it in a form that makes the next step easy.`}
                code={`df.to_csv("aapl_prices_cleaned.csv")
monthly.to_csv("aapl_prices_monthly.csv")`}
            />

            <Text
                content={`Keeping both a cleaned daily file and a normalised monthly file is often worth it. It prevents repeated preprocessing and makes your later notebooks or scripts much easier to audit.`}
            />

            <Text
                heading="Summary"
                content={`A good cleaning workflow for financial data does more than remove NaNs.

It establishes trusted timestamps, enforces numeric types, removes impossible rows, defines rules for missing data, aligns multiple assets on a common calendar, and converts everything to the frequency your analysis actually needs.

That is what turns a raw CSV into an analysis-ready dataset.`}
            />
        </Body>
    )
}
