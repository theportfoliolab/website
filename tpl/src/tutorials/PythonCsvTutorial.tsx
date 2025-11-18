import React from "react"
import {
    PageTitle,
    Subheading,
    Kicker,
    SectionTitle,
    Lead,
    Code,
    Body,
    CodeBlock
} from "@/components/typography/typography.tsx"

export default function PythonCsvTutorial() {
    return (
        <article className="prose max-w-none">
            <Kicker>Intro</Kicker>
            <PageTitle>CSV Dataframes with pandas</PageTitle>
            <Subheading>
                Financial analysis using Python usually involves time series and tables. This
                tutorial shows how to load, inspect and clean CSV data into a pandas DataFrame.
            </Subheading>

            <SectionTitle>Setup</SectionTitle>
            <Lead>
                You should have Python and pandas installed. If not, run:
            </Lead>
            <Code>pip install pandas</Code>
            <Body>
                Ensure you can run Python scripts and that the CSV sample files live in the
                same folder as your script (or provide the path when opening them).
            </Body>

            <SectionTitle>Fetching the sample code and data</SectionTitle>
            <Body>
                Clone the repository or download the archive that contains the example scripts
                and CSVs. Place example.py and the CSV (for example data.csv or AAPL sample)
                in your working directory before running the examples.
            </Body>

            <SectionTitle>Loading a CSV</SectionTitle>
            <Lead>Open example.py (or create a new script) and add:</Lead>
            <CodeBlock language="bash">
{`import pandas as pd

filename = "data.csv"
df = pd.read_csv(filename)`}
            </CodeBlock>
            <Body>
                The first line imports pandas. filename is the CSV file name and df is the
                resulting DataFrame. Keeping a header row in the CSV (column labels) is best
                practice for later processing.
            </Body>

            <SectionTitle>Inspecting the DataFrame</SectionTitle>
            <Body>
                Useful methods to inspect your DataFrame:
            </Body>
            <CodeBlock language="bash">
{`print(df.head())
print(df.columns.tolist())
print(df.shape)
print(df.info())`}
            </CodeBlock>
            <Body>
                - head() shows the first rows. - columns gives column names. - shape returns
                rows × columns. - info() reports dtypes and missing values.
            </Body>

            <SectionTitle>Accessing data</SectionTitle>
            <Body>
                Common access patterns:
            </Body>
            <CodeBlock language="bash">
{`df["Close"]               # single column (Series)
df[["Date","Close"]]       # multiple columns (DataFrame)
df.loc[0]                  # row by label / index
df.iloc[0]                 # row by integer position
df.loc[0,"Close"]          # specific cell by label
df.iloc[0,4]               # specific cell by position`}
            </CodeBlock>

            <SectionTitle>Selecting & processing</SectionTitle>
            <Body>
                Examples of filtering, sorting and deriving new columns:
            </Body>
            <CodeBlock language="bash">
{`df_filtered = df[df["Volume"] > 200_000_000]
df_sorted = df.sort_values("Close", ascending=False)
df["Range"] = df["High"] - df["Low"]`}
            </CodeBlock>

            <SectionTitle>Parsing dates & indexing</SectionTitle>
            <Body>
                Convert date strings to datetime and set the index for time series ops:
            </Body>
            <CodeBlock language="bash">
{`df["Date"] = pd.to_datetime(df["Date"], errors="coerce")
df = df.set_index("Date")`}
            </CodeBlock>

            <SectionTitle>Missing values</SectionTitle>
            <Body>
                Inspect and handle missing data:
            </Body>
            <CodeBlock language="bash">
{`print(df.isnull().sum())
df = df.dropna()                     # drop rows with any missing values
df["Close"] = df["Close"].fillna(method="ffill")  # forward-fill
df["Volume"] = df["Volume"].fillna(0)`}
            </CodeBlock>

            <SectionTitle>Converting types</SectionTitle>
            <Body>
                Ensure numeric columns are numeric:
            </Body>
            <CodeBlock language="bash">
{`df["Open"] = pd.to_numeric(df["Open"], errors="coerce")
df["Close"] = pd.to_numeric(df["Close"], errors="coerce")`}
            </CodeBlock>

            <SectionTitle>Duplicates</SectionTitle>
            <Body>
                Remove duplicate rows or duplicate dates:
            </Body>
            <CodeBlock language="bash">
{`df = df.drop_duplicates()
df = df[~df.index.duplicated(keep="first")]`}
            </CodeBlock>

            <SectionTitle>Resampling & filling gaps</SectionTitle>
            <Body>
                To ensure continuous calendar days (filling missing trading days):
            </Body>
            <CodeBlock language="bash">
{`df = df.resample("D").ffill()`}
            </CodeBlock>

            <SectionTitle>Saving cleaned data</SectionTitle>
            <Body>
                Save the cleaned DataFrame for later use:
            </Body>
            <CodeBlock language="bash">
{`df.to_csv("aapl_prices_cleaned.csv", index=True)`}
            </CodeBlock>
            <Body>
                Use index=True if you want to keep the Date index as a column in the CSV.
            </Body>

            <SectionTitle>Summary</SectionTitle>
            <Body>
                You learned how to load, inspect, clean and save CSV data with pandas. The
                steps include parsing dates, handling missing values, converting types,
                removing duplicates, resampling and exporting cleaned data. These are the
                essential preparations before computing returns or running backtests.
            </Body>
        </article>
    )
}