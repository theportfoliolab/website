import React from "react"
import {
  PageTitle,
  Subheading,
  Kicker,
  SectionTitle,
  Lead,
  CodeBlock,
  Body,
  SmallHeading
} from "@/components/typography/typography.tsx"

export default function DataCleaningTutorial() {
  return (
    <article className="prose w-full max-w-3xl mx-auto text-left">
      <Kicker>Data Cleaning in Pandas</Kicker>
      <PageTitle>Data Cleaning in Pandas</PageTitle>
      <Subheading>
        Once your financial data is loaded into a DataFrame, the next step is almost
        always cleaning it. This tutorial walks through detecting, inspecting and
        cleaning common issues in financial CSV data using pandas.
      </Subheading>

      <SectionTitle>Intro</SectionTitle>
      <Body>
        Real-world data — especially financial data — is rarely perfect. Missing values,
        inconsistent date formats, extra whitespace, or duplicated rows can all cause
        problems when performing calculations or visualisations. In this tutorial you’ll
        learn how to detect, inspect, and clean these issues so you end up with an
        analysis-ready DataFrame.
      </Body>

      <SectionTitle>Setup</SectionTitle>
      <Lead>
        To follow along, have Python and pandas installed and the sample CSV in the same
        folder as the script.
      </Lead>
      <CodeBlock language="bash">{`pip install pandas`}</CodeBlock>

      <SectionTitle>What you'll need</SectionTitle>
      <Body>
        - Basic familiarity with DataFrames and pandas
        <br />
        - A working Python environment
        <br />
        - A sample CSV (e.g. aapl_prices.csv)
      </Body>

      <SectionTitle>1. Loading and inspecting the data</SectionTitle>
      <Body>
        Start by loading the CSV and taking a quick look:
      </Body>
      <CodeBlock language="python">
{`import pandas as pd

filename = "aapl_prices.csv"
df = pd.read_csv(filename)

print(df.head())
print(df.info())`}
      </CodeBlock>
      <Body>
        Check head() and info() to verify columns, types and missing values before proceeding.
      </Body>

      <SmallHeading>Why inspect first?</SmallHeading>
      <Body>
        Early inspection reveals issues such as dates parsed as strings or numeric values
        loaded as text; these are easy to correct once found.
      </Body>

      <SectionTitle>2. Parsing dates and setting index</SectionTitle>
      <Body>
        Convert the Date column and set it as the index for time series operations:
      </Body>
      <CodeBlock language="python">
{`df["Date"] = pd.to_datetime(df["Date"], errors="coerce")
df = df.set_index("Date")
print(df.head())`}
      </CodeBlock>

      <SectionTitle>3. Identifying missing values</SectionTitle>
      <Body>
        Check for missing or incomplete data:
      </Body>
      <CodeBlock language="python">{`print(df.isnull().sum())
print(df[df.isnull().any(axis=1)])`}</CodeBlock>

      <SectionTitle>4. Handling missing data</SectionTitle>
      <Body>
        Two common strategies: drop rows or fill values.
      </Body>
      <SmallHeading>Dropping rows</SmallHeading>
      <CodeBlock language="python">{`df = df.dropna()`}</CodeBlock>

      <SmallHeading>Filling values</SmallHeading>
      <CodeBlock language="python">
{`df["Close"] = df["Close"].fillna(method="ffill")  # forward fill
df["Volume"] = df["Volume"].fillna(0)`}
      </CodeBlock>

      <SectionTitle>5. Converting data types</SectionTitle>
      <Body>
        Convert numeric columns loaded as text:
      </Body>
      <CodeBlock language="python">
{`df["Open"] = pd.to_numeric(df["Open"], errors="coerce")
df["Close"] = pd.to_numeric(df["Close"], errors="coerce")`}
      </CodeBlock>

      <SectionTitle>6. Removing duplicates</SectionTitle>
      <Body>
        Remove duplicate rows or duplicate dates:
      </Body>
      <CodeBlock language="python">
{`print("Before:", len(df))
df = df.drop_duplicates()
print("After:", len(df))

# If duplicates by date:
df = df[~df.index.duplicated(keep="first")]`}
      </CodeBlock>

      <SectionTitle>7. Renaming and reordering columns</SectionTitle>
      <Body>
        Use shorter or clearer names and reorder columns for convenience:
      </Body>
      <CodeBlock language="python">
{`df = df.rename(columns={"Adj": "Adjusted", "Trans": "Transactions"})
df = df[["Code","Open","High","Low","Close","Volume"]]`}
      </CodeBlock>

      <SectionTitle>8. Detecting and handling outliers</SectionTitle>
      <Body>
        Check distributions and remove unrealistic values:
      </Body>
      <CodeBlock language="python">{`print(df["Close"].describe())
df = df[(df["Close"] > 0) & (df["Close"] < 10000)]`}</CodeBlock>

      <SectionTitle>9. Resampling and filling gaps</SectionTitle>
      <Body>
        To ensure continuous calendar days:
      </Body>
      <CodeBlock language="python">{`df = df.resample("D").ffill()`}</CodeBlock>

      <SectionTitle>10. Verifying clean data</SectionTitle>
      <Body>
        After cleaning, verify:
      </Body>
      <CodeBlock language="python">{`print(df.info())
print(df.head())
print(df.describe())`}</CodeBlock>

      <SectionTitle>11. Saving clean data</SectionTitle>
      <Body>
        Save the cleaned result for future analysis:
      </Body>
      <CodeBlock language="python">{`df.to_csv("aapl_prices_cleaned.csv", index=True)`}</CodeBlock>

      <SectionTitle>Summary</SectionTitle>
      <Body>
        You learned how to detect and fix missing, invalid or duplicate data, parse dates,
        convert types, remove duplicates, resample and export cleaned data — preparing
        your dataset for returns calculations or backtests.
      </Body>
    </article>
  )
}