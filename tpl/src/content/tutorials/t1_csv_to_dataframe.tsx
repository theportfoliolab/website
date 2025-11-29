import Body from "@/components/content/body"
import { Text } from "@/components/content/text.tsx"
import type { PostMeta } from "@/components/content/types"

// ─────────────────────────────────────────────
// Metadata (REQUIRED for routing)
// ─────────────────────────────────────────────
export const meta: PostMeta = {
    title: "Working With CSVs and DataFrames in Python",
    description:
        "A tutorial introducing CSV files and DataFrames in Python using pandas. Covers loading, exploring, selecting, modifying, and saving data.",
    date: "2025-02-12",
    tags: ["python", "pandas", "data cleaning", "csv"],
    type: "tutorial",
    slug: "t1_csv_to_dataframe"
}

// ─────────────────────────────────────────────
// Tutorial Component
// ─────────────────────────────────────────────
export default function Tutorial() {
    return (
        <Body>

            <Text
                title="Introduction"
                content={`Financial analysis using Python usually involves some kind of series,
and running some kind of computation on that series. When approaching the task, 
you are likely to encounter Comma Separated Value (.csv) files. These files can hold value for tables.But alone, a table is not much help to us. We need some kind of way to look through the table,
process the data, and perform computations on its values.`}
            />

            <Text
                lead={`This is where Dataframes come in:
                    A Dataframe is a computer object which once loaded, stores all the data of the .csv file in a much
                    more useful way. This is the starting point for your technical analysis in Python.`}
            />

            <Text
                title="Setup"
                lead="To start, I will assume:"
                bullets={[
                    "You are familiar with basic object oriented programming coding concepts",
                    "You are familiar with Git, that is, you can fetch a repository",
                    "You are familiar with Python development, that is, you can create and run a script, using the terminal",
                    "You will also need to have the Pandas library installed (pip install pandas)."
                ]}
            />

            <Text
                title="Explaining CSVs"
                content={`First, let's learn a little bit about CSVs.

Lines represent a "row" of data, values are separated with a comma in between each value.`}
                code={`05898, AWR584, 6/12/1978
02785, BLH967, 4/5/2001`}
            />

            <Text
                content={`Here we see 2 entries, with 3 values associated with each entry. Each entry 
(line in the file) should have the same number of values (rows, or number of commas).

You might recognise the last value in this series as a calendar date. But what if you don't know 
what the other 2 columns represent? Unfortunately, there's no real way of knowing, unless you can 
find the source or make deductions yourself.

Therefore, it's good practice to include labels in a CSV. You can do this by reserving the first 
line of the file for a series of data labels:`}
                code={`Customer ID, Vehicle Registration, Date of Birth`}
            />

            <Text
                content={`Now we can see that the first value in each line is that entry's Customer ID, 
the second is their Vehicle rego, and the last entry is Date of Birth. You may sometimes find CSVs 
which do not contain this line, and just start right away with data.

To make a well formed CSV:`}
                code={`Customer ID, Vehicle Registration, Date of Birth
05898, AWR584, 6/12/1978
02785, BLH967, 4/5/2001`}
            />

            <Text
                content={`Here's an example .csv of an AAPL daily price record:`}
                code={`Date,Code,Open,High,Low,Close,Volume,Value,Trans,Adj,Exchange,DataSource
01-Feb-2018,AAPL,0.4179,0.4216,0.4169,0.4194,189537940,7959426098,309149,0.25,NAS,USXE
02-Feb-2018,AAPL,0.415,0.417,0.4002,0.4012,347904496,14172890566,603830,0.25,NAS,USXE
05-Feb-2018,AAPL,0.3977,0.4097,0.39,0.3912,291049384,11673630072,528524,0.25,NAS,USXE
06-Feb-2018,AAPL,0.3871,0.4093,0.385,0.4076,273001160,10896333105,506752,0.25,NAS,USXE
07-Feb-2018,AAPL,0.4077,0.4085,0.3977,0.3988,209426552,8435900928,341979,0.25,NAS,USXE`}
            />

            <Text
                title="Loading CSVs Into DataFrames"
                content={`Opening the CSV and creating the dataframe can be done in two lines of code:`}
                code={`import pandas as pd

filename = "data.csv"
df = pd.read_csv(filename)`}
            />

            <Text
                content={`Create graphic explaining each part... (left verbatim as requested)`}
            />

            <Text
                title="Exploring DataFrames"
                content={`The new dataframe has many useful methods and properties, some of which I will explain here:`}
                bullets={[".head()", ".shape", ".columns", ".info()"]}
                code={`import pandas as pd

filename = "data.csv"
df = pd.read_csv(filename)

print("\\nPreview of data:")
print(df.head())

print("\\nColumn names:")
print(df.columns.tolist())

print("\\nShape (rows, columns):")
print(df.shape)

print("\\nData types and memory info:")
print(df.info())`}
            />

            <Text
                title="Accessing Data"
                content={`Once your data is loaded into a dataframe, you can access specific columns, rows, or individual cells…`}
                code={`import pandas as pd

filename = "data.csv"
df = pd.read_csv(filename)

print("\\nAccessing a single column:")
print(df["Close"])

print("\\nAccessing multiple columns:")
print(df[["Date", "Close"]])

print("\\nAccessing rows:")
print(df.loc[0])

print("\\nAccessing specific cells:")
print(df.loc[0, "Close"])
print(df.iloc[0, 4])`}
            />

            <Text
                title="Selecting and Processing Data"
                content={`Once you know how to access specific parts of a DataFrame, you can start filtering, sorting, and modifying your data…`}
                code={`import pandas as pd

filename = "data.csv"
df = pd.read_csv(filename)

print("\\nFiltering rows where Volume > 200000000:")
print(df[df["Volume"] > 200000000])

print("\\nSorting data by Close price (descending):")
print(df.sort_values("Close", ascending=False).head())

print("\\nCreating a new column for daily range (High - Low):")
df["Range"] = df["High"] - df["Low"]
print(df[["Date", "High", "Low", "Range"]].head())`}
            />

            <Text
                title="Other Useful Stuff"
                bullets={[
                    ".dropna()",
                    ".fillna(value)",
                    ".describe()",
                    ".value_counts()",
                    ".unique()",
                    ".nunique()",
                    ".sample()",
                    ".head(n) / .tail(n)"
                ]}
            />

            <Text
                title="Saving Changes"
                content={`Once you’ve finished processing or cleaning your data, you’ll often want to save…`}
                code={`df.to_csv("new_data.csv", index=False)`}
            />

            <Text code={`df.to_excel("output.xlsx", index=False)`} />

            <Text code={`df[["Date", "Close", "Volume"]].to_csv("selected_data.csv", index=False)`} />

            <Text code={`df.to_csv("data.csv", mode="a", header=False, index=False)`} />

            <Text
                content={`Best Practice:\nKeep a backup…`}
            />

        </Body>
    )
}
