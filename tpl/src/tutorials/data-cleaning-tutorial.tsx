import { Intro } from "@/components/typography/intro"
import Section from "@/components/typography/section"
import Subsection from "@/components/typography/subsection"
import { CodeBlock, Body, Lead } from "@/components/typography/typography.tsx"

export default function DataCleaningTutorial() {
    return (
        <article className="prose w-full max-w-3xl mx-auto text-left">
            <Intro
                kicker="Intro"
                title="Data Cleaning in Pandas"
                description="Once your financial data is loaded into a DataFrame, the next step is almost always cleaning it. Real-world data — especially financial data — is rarely perfect. Missing values, inconsistent date formats, extra whitespace, or duplicated rows can all cause problems when performing calculations or visualisations."
            >
                <Lead>
                    In this tutorial, you’ll learn how to detect, inspect, and clean these issues using pandas.
                    By the end, you’ll have a clean, analysis-ready dataset that can be easily saved for later use.
                </Lead>
            </Intro>

            <Section title="Setup">
                <Subsection subtitle="Requirements">
                    <Body>
                        To follow along, make sure you have:
                        <br />
                        - Basic familiarity with pandas and DataFrames (from the previous tutorial)
                        <br />
                        - A working Python setup and pandas installed (pip install pandas)
                        <br />
                        - A CSV file ready — for example, the same AAPL daily prices file from the last tutorial.
                        <br />
                        You can also fetch the example files and scripts from the repository if provided, or simply copy the code samples below.
                    </Body>
                </Subsection>
            </Section>

            <Section title="1. Loading and Inspecting the Data">
                <Subsection subtitle="Load CSV">
                    <Body>
                        Let’s start by loading the CSV file and taking a quick look at the data.
                    </Body>
                    <CodeBlock language="python">
{`import pandas as pd

filename = "aapl_prices.csv"
df = pd.read_csv(filename)

print(df.head())
print(df.info())`}
                    </CodeBlock>
                    <Body>
                        You should always start by checking:
                        <br />
                        .head() — verifies the first few rows look correct
                        <br />
                        .info() — confirms column names, data types, and whether you have missing values
                        <br />
                        If you notice columns like Date are stored as strings (object), or numeric columns appear as text, don’t worry — we’ll fix that next.
                    </Body>
                </Subsection>
            </Section>

            <Section title="2. Parsing Dates and Setting Index">
                <Subsection subtitle="Parse Dates">
                    <Body>
                        Dates are a crucial part of financial data, so it’s best to convert them to proper datetime objects.
                    </Body>
                    <CodeBlock language="python">
{`df["Date"] = pd.to_datetime(df["Date"], errors="coerce")
df = df.set_index("Date")
print(df.head())`}
                    </CodeBlock>
                    <Body>
                        Here:
                        <br />
                        pd.to_datetime() converts the Date column into a datetime object.
                        <br />
                        errors="coerce" replaces invalid date entries with NaT (Not a Time).
                        <br />
                        .set_index("Date") makes Date the DataFrame’s index, making time-based operations easier later.
                    </Body>
                </Subsection>
            </Section>

            <Section title="3. Identifying Missing Values">
                <Subsection subtitle="Find Missing">
                    <Body>
                        Next, check for missing or incomplete data.
                    </Body>
                    <CodeBlock language="python">{`print(df.isnull().sum())`}</CodeBlock>
                    <Body>
                        This shows the number of missing values per column.
                        You can also view which rows are affected:
                    </Body>
                    <CodeBlock language="python">{`print(df[df.isnull().any(axis=1)])`}</CodeBlock>
                    <Body>
                        Financial data often has missing prices or volumes (e.g. holidays or partial trading days).
                        You’ll need to decide whether to remove or fill these gaps.
                    </Body>
                </Subsection>
            </Section>

            <Section title="4. Handling Missing Data">
                <Subsection subtitle="Strategies">
                    <Body>
                        There are two main ways to deal with missing values: dropping or filling.
                    </Body>

                    <Subsection subtitle="Dropping rows">
                        <CodeBlock language="python">{`df = df.dropna()`}</CodeBlock>
                        <Body>
                            Removes any rows that contain missing values.
                            Use this only if the dataset is large and the missing portion is small.
                        </Body>
                    </Subsection>

                    <Subsection subtitle="Filling values">
                        <CodeBlock language="python">
{`df["Close"] = df["Close"].fillna(method="ffill")  # forward fill
df["Volume"] = df["Volume"].fillna(0)`}
                        </CodeBlock>
                        <Body>
                            Forward-fill (method="ffill") is common for financial time series — it carries forward the last valid value when data is missing.
                        </Body>
                    </Subsection>
                </Subsection>
            </Section>

            <Section title="5. Converting Data Types">
                <Subsection subtitle="Numeric conversion">
                    <Body>
                        Sometimes, CSV files load numeric data as text. This can prevent calculations.
                        You can fix this using pd.to_numeric():
                    </Body>
                    <CodeBlock language="python">
{`df["Open"] = pd.to_numeric(df["Open"], errors="coerce")
df["Close"] = pd.to_numeric(df["Close"], errors="coerce")`}
                    </CodeBlock>
                    <Body>
                        This will convert text-like numbers into floats, replacing non-numeric entries with NaN.
                        Then, you can check again with:
                    </Body>
                    <CodeBlock language="python">{`print(df.dtypes)`}</CodeBlock>
                </Subsection>
            </Section>

            <Section title="6. Removing Duplicates">
                <Subsection subtitle="Remove duplicates">
                    <Body>
                        Duplicate rows can occur during data merges or exports. To remove them:
                    </Body>
                    <CodeBlock language="python">
{`print("Before:", len(df))
df = df.drop_duplicates()
print("After:", len(df))`}
                    </CodeBlock>
                    <Body>
                        If you suspect duplicates only by date, you can specify:
                    </Body>
                    <CodeBlock language="python">{`df = df[~df.index.duplicated(keep="first")]`}</CodeBlock>
                    <Body>
                        This ensures only one record per date remains.
                    </Body>
                </Subsection>
            </Section>

            <Section title="7. Renaming and Reordering Columns">
                <Subsection subtitle="Rename & reorder">
                    <Body>
                        For consistent analysis, you might want shorter or cleaner column names:
                    </Body>
                    <CodeBlock language="python">
{`df = df.rename(columns={
    "Adj": "Adjusted",
    "Trans": "Transactions"
})`}
                    </CodeBlock>
                    <Body>
                        To reorder columns:
                    </Body>
                    <CodeBlock language="python">{`df = df[["Code", "Open", "High", "Low", "Close", "Volume"]]`}</CodeBlock>
                    <Body>
                        A well-structured dataset is easier to read, document, and reuse.
                    </Body>
                </Subsection>
            </Section>

            <Section title="8. Detecting and Handling Outliers">
                <Subsection subtitle="Outliers">
                    <Body>
                        Outliers can distort averages and volatility calculations.
                        One quick way to check for them is using .describe():
                    </Body>
                    <CodeBlock language="python">{`print(df["Close"].describe())`}</CodeBlock>
                    <Body>
                        To filter unrealistic values, you could cap or remove them:
                    </Body>
                    <CodeBlock language="python">{`df = df[(df["Close"] > 0) & (df["Close"] < 10000)]`}</CodeBlock>
                    <Body>
                        This ensures all prices are within a reasonable range.
                    </Body>
                </Subsection>
            </Section>

            <Section title="9. Resampling and Filling Gaps">
                <Subsection subtitle="Resample">
                    <Body>
                        To ensure your data covers every trading day (or specific frequency), you can resample by day:
                    </Body>
                    <CodeBlock language="python">{`df = df.resample("D").ffill()`}</CodeBlock>
                    <Body>
                        This fills any missing calendar days with the last known value — useful for time-series models that require continuous data.
                    </Body>
                </Subsection>
            </Section>

            <Section title="10. Verifying Clean Data">
                <Subsection subtitle="Verify">
                    <Body>
                        After all transformations, always verify the results:
                    </Body>
                    <CodeBlock language="python">
{`print(df.info())
print(df.head())
print(df.describe())`}
                    </CodeBlock>
                    <Body>
                        Check that:
                        <br />
                        - No missing or invalid data remains
                        <br />
                        - Columns are in the right format
                        <br />
                        - Dates are correctly parsed and indexed
                    </Body>
                </Subsection>
            </Section>

            <Section title="11. Saving Changes">
                <Subsection subtitle="Save">
                    <Body>
                        Once you’ve finished processing or cleaning your data, you’ll often want to save the modified DataFrame for later use or sharing.
                    </Body>
                    <CodeBlock language="python">{`df.to_csv("aapl_prices_cleaned.csv", index=True)`}</CodeBlock>
                    <Body>
                        Saves the DataFrame as a CSV file.
                        Setting index=True prevents pandas from writing the row index as an extra column in the output file.
                        <br />
                        Best Practice:
                        <br />
                        - Keep a backup of the original dataset.
                        <br />
                        - Use clear filenames that describe the data’s purpose or date (e.g. cleaned_prices_2025.csv).
                        <br />
                        - Verify saved files by reopening them in pandas or a spreadsheet to ensure formatting and column alignment are correct.
                    </Body>
                </Subsection>
            </Section>

            <Section title="Summary">
                <Body>
                    In this tutorial, you learned:
                    <br />
                    - How to detect and fix missing, invalid, or duplicate data
                    <br />
                    - How to correctly parse dates and numeric columns
                    <br />
                    - How to make your dataset consistent and ready for analysis
                    <br />
                    You now have a clean, analysis-ready DataFrame that can be fed directly into your next steps — such as calculating returns or running backtests.
                </Body>
            </Section>
        </article>
    )
}