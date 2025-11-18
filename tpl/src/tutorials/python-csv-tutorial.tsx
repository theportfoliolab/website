import { Intro } from "@/components/typography/intro"
import Section from "@/components/typography/section.tsx"
import Subsection from "@/components/typography/subsection.tsx"
import { CodeBlock, Body } from "@/components/typography/typography.tsx"

export default function PythonCsvTutorial() {
    return (
        <article className="prose w-full max-w-3xl mx-auto text-left">
            <Intro
                kicker="Tutorial"
                title="Introduction to Pandas for CSV Data"
                description="Learn how to load, clean and save CSV data with pandas.">
            </Intro>

            <Section title="Setup">
                <Subsection title="Installation">
                    <Body>To follow along, have Python and pandas installed. If not, run:</Body>
                    <CodeBlock language="bash">pip install pandas</CodeBlock>
                    <Body>
                        Ensure you can run Python scripts and that the CSV sample files live in the
                        same folder as your script (or provide the path when opening them).
                    </Body>
                </Subsection>

                <Subsection title="Fetching the sample code and data">
                    <Body>Clone the repository or download the archive that contains the example scripts
                        and CSVs. Place example.py and the CSV (for example data.csv or AAPL sample)
                        in your working directory before running the examples.
                    </Body>
                </Subsection>
            </Section>

            <Section title="Loading a CSV">
                <Subsection title="Python Script">
                    <Body>Open example.py (or create a new script)</Body>
                    <CodeBlock language="python">
                        {`import pandas as pd
filename = "data.csv"
df = pd.read_csv(filename)`}
                    </CodeBlock>
                    <Body>The first line imports pandas. filename is the CSV file name and df is the resulting DataFrame.</Body>
                </Subsection>

            <Subsection title="Inspecting the DataFrame">
                <Body>Useful methods to inspect your DataFrame:</Body>
                <CodeBlock language="python">
{`print(df.head())
print(df.columns.tolist())
print(df.shape)
print(df.info())`}
                </CodeBlock>
            </Subsection>
            </Section>

            <Section title="Accessing Data" subtitle="">
                <Body>Common ways to access data in a CSV dataframe.</Body>
                <CodeBlock language="python">
{`df["Close"]               # single column (Series)
df[["Date","Close"]]       # multiple columns (DataFrame)
df.loc[0]                  # row by label / index
df.iloc[0]                 # row by integer position
df.loc[0,"Close"]          # specific cell by label
df.iloc[0,4]               # specific cell by position`}
                </CodeBlock>

                <Subsection title="Selecting & processing">
                    <Body>Examples of filtering, sorting and deriving new columns:</Body>
                    <CodeBlock language="python">
{`df_filtered = df[df["Volume"] > 200_000_000]
df_sorted = df.sort_values("Close", ascending=False)
df["Range"] = df["High"] - df["Low"]`}
                    </CodeBlock>
                </Subsection>

                <Subsection title="Parsing dates & indexing">
                    <Body>Convert date strings to datetime and set the index for time series ops:</Body>
                    <CodeBlock language="python">
{`df["Date"] = pd.to_datetime(df["Date"], errors="coerce")
df = df.set_index("Date")`}
                    </CodeBlock>
                    </Subsection>
                </Section>

            <Section title="Cleaning the data">
                <Subsection title="Missing values">
                    <Body>Inspect and handle missing data:</Body>
                    <CodeBlock language="python">
{`print(df.isnull().sum())
df = df.dropna()                     # drop rows with any missing values
df["Close"] = df["Close"].fillna(method="ffill")  # forward-fill
df["Volume"] = df["Volume"].fillna(0)`}
                    </CodeBlock>
                </Subsection>

                <Subsection title="Converting types">
                    <Body>Ensure numeric columns are numeric:</Body>
                    <CodeBlock language="python">
{`df["Open"] = pd.to_numeric(df["Open"], errors="coerce")
df["Close"] = pd.to_numeric(df["Close"], errors="coerce")`}
                    </CodeBlock>
                </Subsection>

                <Subsection title="Duplicates">
                    <Body>Remove duplicate rows or duplicate dates:</Body>
                    <CodeBlock language="python">
{`df = df.drop_duplicates()
df = df[~df.index.duplicated(keep="first")]`}
                    </CodeBlock>
                </Subsection>

                <Subsection title="Resampling & filling gaps">
                    <Body>To ensure continuous calendar days (filling missing trading days):</Body>
                    <CodeBlock language="python">{`df = df.resample("D").ffill()`}</CodeBlock>
                </Subsection>

                <Subsection title="Saving cleaned data">
                    <Body>Save the cleaned DataFrame for later use:</Body>
                    <CodeBlock language="python">{`df.to_csv("aapl_prices_cleaned.csv", index=True)`}</CodeBlock>
                </Subsection>
            </Section>

            <Section title="Summary">
                <Body>
                    You learned how to load, inspect, clean and save CSV data with pandas. The
                    steps include parsing dates, handling missing values, converting types,
                    removing duplicates, resampling and exporting cleaned data. These are the
                    essential preparations before computing returns or running backtests.
                </Body>
            </Section>
        </article>
    )
}