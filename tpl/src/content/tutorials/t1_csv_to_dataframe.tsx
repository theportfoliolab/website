import { Text } from "@/components/content/text"
import type { PostMeta } from "@/components/content/types"

// ─────────────────────────────────────────────
// Metadata (REQUIRED for routing)
// ─────────────────────────────────────────────
export const meta: PostMeta = {
    title: "How to Work With CSV Files and Pandas DataFrames in Python",
    description:
        "A beginner-friendly Python tutorial on CSV files and pandas DataFrames, including loading, exploring, modifying, and saving data.",
    date: "2025-02-12",
    tags: ["python", "pandas", "data cleaning", "csv"],
    type: "tutorial",
    slug: "python-csv-and-pandas-dataframes",
    nextInSeriesSlug: "clean-financial-data-in-pandas",
}

// ─────────────────────────────────────────────
// Tutorial Component
// ─────────────────────────────────────────────
export default function Tutorial() {
    return (
        <>
            <Text
                heading="Introduction"
                content={`A lot of Python work, especially in finance, begins with data stored in a table.
That table might contain prices, trading volumes, company information, economic data, or customer records.
One of the most common ways to store this kind of tabular data is in a Comma Separated Value (.csv) file.

A CSV file is useful for storing data, but by itself it is just text. To analyse it properly, we usually load it into a pandas DataFrame.
A DataFrame is a Python object designed to store tabular data in rows and columns, while also giving us convenient tools for inspecting, filtering, modifying, and saving that data.`}
            />

            <Text
                lead={`In practice, a CSV file is often the starting point, and the DataFrame is the object you actually work with.
Once your data is in a DataFrame, you can search through it, perform calculations, clean values, and prepare it for analysis or visualisation.`}
            />

            <Text
                heading="Setup"
                lead="To follow this tutorial, I will assume:"
                bullets={[
                    "You are comfortable with basic Python syntax and programming concepts",
                    "You know how to create and run a Python script from the terminal",
                    "You have pandas installed with pip install pandas",
                    "You have a CSV file available to experiment with",
                ]}
            />

            <Text
                heading="Explaining CSVs"
                content={`CSV stands for Comma Separated Value.
A CSV file stores data as plain text, where each line represents one row, and commas separate the values in that row.`}
                code={`05898,AWR584,6/12/1978
02785,BLH967,4/5/2001`}
            />

            <Text
                content={`In this example, there are 2 rows, and each row contains 3 values.
Each row should usually have the same number of values, so the table structure stays consistent.

One problem with raw CSV data is that values do not explain themselves.
You might recognise the last value as a date, but there is no way to know what the first two values mean unless you already know the source of the file.`}
            />

            <Text
                content={`For that reason, well-formed CSV files usually include a header row at the top.
The header row contains the column names, which describe the meaning of each value in the rows below it.`}
                code={`Customer ID,Vehicle Registration,Date of Birth`}
            />

            <Text
                content={`Now the structure is much clearer.
The first value in each row is a customer ID, the second is a vehicle registration, and the third is a date of birth.

A complete CSV with a header row might look like this:`}
                code={`Customer ID,Vehicle Registration,Date of Birth
05898,AWR584,6/12/1978
02785,BLH967,4/5/2001`}
            />

            <Text
                content={`Here is an example of a CSV containing daily AAPL price data.
Notice that the first row contains labels, and each later row contains one day's record.`}
                code={`Date,Code,Open,High,Low,Close,Volume,Value,Trans,Adj,Exchange,DataSource
01-Feb-2018,AAPL,0.4179,0.4216,0.4169,0.4194,189537940,7959426098,309149,0.25,NAS,USXE
02-Feb-2018,AAPL,0.415,0.417,0.4002,0.4012,347904496,14172890566,603830,0.25,NAS,USXE
05-Feb-2018,AAPL,0.3977,0.4097,0.39,0.3912,291049384,11673630072,528524,0.25,NAS,USXE
06-Feb-2018,AAPL,0.3871,0.4093,0.385,0.4076,273001160,10896333105,506752,0.25,NAS,USXE
07-Feb-2018,AAPL,0.4077,0.4085,0.3977,0.3988,209426552,8435900928,341979,0.25,NAS,USXE`}
            />

            <Text
                heading="Loading CSVs Into DataFrames"
                content={`Pandas provides the read_csv() function for loading CSV files into DataFrames.
This is one of the most common pandas functions you will use.`}
                code={`import pandas as pd

filename = "data.csv"
df = pd.read_csv(filename)`}
            />

            <Text
                content={`Let's break that down:

import pandas as pd
This imports the pandas library and gives it the shorter name pd, which is the standard convention in Python.

filename = "data.csv"
This stores the file path in a variable.
If your file is in the same folder as your script, the filename alone is enough.
Otherwise, you would use a relative or full path.

df = pd.read_csv(filename)
read_csv() is a pandas function that opens the CSV file and converts it into a DataFrame.
The argument filename tells pandas which file to load.
The result is assigned to the variable df, short for DataFrame.`}
            />

            <Text
                content={`By default, read_csv() assumes:
- the file is comma separated
- the first row contains column names
- each later row contains data

Those defaults match most normal CSV files, which is why a simple call to read_csv() often works immediately.`}
            />

            <Text
                heading="Exploring DataFrames"
                content={`Once the CSV is loaded, the first step is usually to inspect the DataFrame.
Pandas gives you methods and properties for quickly understanding what the data looks like.`}
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
df.info()`}
            />

            <Text
                content={`Here is what each one does:

df.head()
head() is a method that returns the first 5 rows by default.
This is useful for checking whether the file loaded correctly.

You can also pass a number as an argument, such as df.head(10), to preview more rows.

df.columns
columns is a property containing the DataFrame's column labels.
Because it is not a method, there are no brackets after it.

df.columns.tolist()
tolist() converts the column labels into a regular Python list, which prints more cleanly.

df.shape
shape is a property that returns a tuple in the form (number_of_rows, number_of_columns).

df.info()
info() prints a summary of the DataFrame, including:
- the column names
- how many non-null values each column contains
- the data type of each column

This is especially useful when checking for missing data or verifying whether numbers and dates were loaded as expected.`}
            />

            <Text
                heading="Accessing Data"
                content={`After inspecting the DataFrame, the next step is learning how to retrieve specific parts of it.
You can access entire columns, selected groups of columns, rows, or single cells.`}
                code={`import pandas as pd

filename = "data.csv"
df = pd.read_csv(filename)

print("\\nAccessing a single column:")
print(df["Close"])

print("\\nAccessing multiple columns:")
print(df[["Date", "Close"]])

print("\\nAccessing a row by label:")
print(df.loc[0])

print("\\nAccessing specific cells:")
print(df.loc[0, "Close"])
print(df.iloc[0, 4])`}
            />

            <Text
                content={`Let's go through these carefully.

df["Close"]
This selects one column by its label.
The result is usually a pandas Series, which is similar to a single column of data.

df[["Date", "Close"]]
This selects multiple columns.
Notice the double square brackets:
- the outer brackets are for DataFrame selection
- the inner list contains the column names to keep

The result is a new DataFrame containing only those columns.

df.loc[0]
loc means label-based location.
It is used for selecting rows and cells by their row label and column label.
In a default DataFrame, the first row label is usually 0.

df.loc[0, "Close"]
This accesses one individual value using the row label and column name.

df.iloc[0, 4]
iloc means integer-location.
It accesses data by numeric position instead of label.
So this means: row 0, column 4.

As a rule:
- use loc when you want to refer to row/column names
- use iloc when you want to refer to row/column positions`}
            />

            <Text
                heading="Selecting and Processing Data"
                content={`Once you can access parts of the DataFrame, you can start doing real work with it.
Common tasks include filtering rows, sorting values, and creating new columns from existing data.`}
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
                content={`Filtering:
df[df["Volume"] > 200000000]

This creates a boolean condition using df["Volume"] > 200000000.
For each row, pandas checks whether the condition is True or False.
Only rows where it is True are returned.

Sorting:
df.sort_values("Close", ascending=False)

sort_values() sorts the DataFrame by a chosen column.
The first argument, "Close", tells pandas which column to sort by.
The parameter ascending=False means highest values first.
If you used ascending=True instead, it would sort lowest to highest.

Creating a new column:
df["Range"] = df["High"] - df["Low"]

This creates a new column called Range.
Pandas subtracts the Low column from the High column row by row.
This is one of the most useful features of DataFrames: operations can be applied to whole columns at once.`}
            />

            <Text
                heading="Other Useful DataFrame Methods"
                content={`Pandas includes many more methods for cleaning and understanding data.
Here are a few especially useful ones for beginners:`}
                bullets={[
                    ".dropna()",
                    ".fillna(value)",
                    ".describe()",
                    ".value_counts()",
                    ".unique()",
                    ".nunique()",
                    ".sample()",
                    ".head(n) / .tail(n)",
                ]}
            />

            <Text
                content={`A quick explanation of each:

dropna()
Removes rows or columns containing missing values.
Useful when incomplete rows should not be included in your analysis.

fillna(value)
Replaces missing values with something else, such as 0 or "Unknown".

describe()
Returns summary statistics for numeric columns, such as count, mean, standard deviation, minimum, and maximum.

value_counts()
Counts how many times each value appears in a Series.
Very useful for category columns.

unique()
Returns the distinct values in a column.

nunique()
Returns the number of distinct values in a column.

sample()
Returns a random sample of rows.
Useful for quickly checking data without always looking at the top of the file.

head(n) and tail(n)
Return the first or last n rows, where n is a number you provide.`}
            />

            <Text
                heading="Saving Changes"
                content={`After cleaning or modifying your DataFrame, you will often want to save the result.
Pandas provides methods for exporting DataFrames back to files.`}
                code={`df.to_csv("new_data.csv", index=False)`}
            />

            <Text
                content={`to_csv() writes the DataFrame to a CSV file.

The first argument, "new_data.csv", is the output filename.

The parameter index=False tells pandas not to save the DataFrame's row index as an extra column.
This is usually what you want, because the index is often just 0, 1, 2, 3, and is not part of the real dataset.`}
            />

            <Text code={`df.to_excel("output.xlsx", index=False)`} />

            <Text
                content={`to_excel() works similarly, but saves the DataFrame in Excel format instead of CSV.
Again, index=False prevents the row index from being written as a separate column.`}
            />

            <Text code={`df[["Date", "Close", "Volume"]].to_csv("selected_data.csv", index=False)`} />

            <Text
                content={`You can also save only part of a DataFrame.
Here, the code first selects three columns, then writes just those columns to a new CSV file.`}
            />

            <Text code={`df.to_csv("data.csv", mode="a", header=False, index=False)`} />

            <Text
                content={`This version uses some extra parameters:

mode="a"
This means append mode.
Instead of overwriting the file, pandas adds the new rows to the end.

header=False
This tells pandas not to write the column names again.
That matters when appending to an existing CSV, because repeating the header row in the middle of a file would usually be a mistake.

index=False
As before, this prevents the row index from being written.`}
            />

            <Text
                heading="Best Practice"
                content={`When saving processed data, it is usually safer to write to a new file rather than overwrite the original.
That gives you a clean backup in case your script produces unexpected results.

As a beginner, a good workflow is:
1. load the raw CSV
2. inspect the DataFrame
3. clean or modify the data
4. save the result to a new file

That way, the original source data remains unchanged, and you can always go back and try again.`}
            />
        </>
    )
}
