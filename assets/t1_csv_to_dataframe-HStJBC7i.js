import{n as e,t}from"./index-CnW3HpS-.js";import{n,t as r}from"./section-BJoOzQzf.js";var i=e(t(),1);function a({code:e,className:t}){return(0,i.jsx)(`pre`,{className:t??`code_block`,children:(0,i.jsx)(`code`,{children:e})})}const o={title:`Working With CSVs and DataFrames in Python`,description:`A tutorial introducing CSV files and DataFrames in Python using pandas. Covers loading, exploring, selecting, modifying, and saving data.`,date:`2025-02-12`,tags:[`python`,`pandas`,`data cleaning`,`csv`],type:`tutorial`,slug:`t1_csv_to_dataframe`};function s(){return(0,i.jsxs)(n,{children:[(0,i.jsxs)(r,{title:`Intro`,children:[(0,i.jsx)(`p`,{children:`Financial analysis using Python usually involves some kind of series, and running some kind of computation on that series. When approaching the task, you are likely to encounter Comma Separated Value (.csv) files. These files can hold value for tables.`}),(0,i.jsx)(`p`,{children:`But alone, a table is not much help to us. We need some kind of way to look through the table, process the data, and perform computations on it's values. This is where Dataframes come in: A Dataframe is a computer object which once loaded, stores all the data of the .csv file in a much more useful way. This is the starting point for your technical analysis in Python.`})]}),(0,i.jsxs)(r,{title:`Setup`,children:[(0,i.jsx)(`p`,{children:`To start, I will assume:`}),(0,i.jsxs)(`ul`,{className:`list-disc ml-6`,children:[(0,i.jsx)(`li`,{children:`You are familiar with basic object oriented programming coding concepts`}),(0,i.jsx)(`li`,{children:`You are familiar with Git, that is, you can fetch a repository`}),(0,i.jsx)(`li`,{children:`You are familiar with Python development, that is, you can create and run a script, using the terminal`}),(0,i.jsx)(`li`,{children:`You will also need to have the Pandas library installed (pip install pandas).`})]})]}),(0,i.jsxs)(r,{title:`Explaining CSVs`,children:[(0,i.jsx)(`p`,{children:`First, let's learn a little bit about CSVs.`}),(0,i.jsx)(`p`,{children:`Lines represent a "row" of data, values are separated with a comma in between each value.`}),(0,i.jsx)(`p`,{children:`Example:`}),(0,i.jsx)(a,{code:`05898, AWR584, 6/12/1978
02785, BLH967, 4/5/2001`}),(0,i.jsx)(`p`,{children:`Here we see 2 entries, with 3 values associated with each entry. Each entry (line in the file) should have the same number of values (rows, or number of commas)`}),(0,i.jsx)(`p`,{children:`You might recognise the last value in this series as a calendar date. But what if you don't know what the other 2 columns represent? Unfortunately, there's no real way of knowing, unless you can find the source or make deductions yourself.`}),(0,i.jsx)(`p`,{children:`Therefore, it's good practice to include labels in a CSV. You can do this by reserving the first line of the file for a series of data labels:`}),(0,i.jsx)(`p`,{children:`Example:`}),(0,i.jsx)(a,{code:`Customer ID, Vehicle Registration, Date of Birth`}),(0,i.jsx)(`p`,{children:`Now we can see that the first value in each line is that entries Customer ID, the second is their Vehicle rego, and the last entry is Date of Birth. You may sometimes find CSVs which do not contain this line, and just start right away with data.`}),(0,i.jsx)(`p`,{children:`To make a well formed CSV:`}),(0,i.jsx)(a,{code:`Customer ID, Vehicle Registration, Date of Birth
05898, AWR584, 6/12/1978
02785, BLH967, 4/5/2001`}),(0,i.jsx)(`p`,{children:`Here's an example .csv of an AAPL daily price record:`}),(0,i.jsx)(a,{code:`Date,Code,Open,High,Low,Close,Volume,Value,Trans,Adj,Exchange,DataSource
01-Feb-2018,AAPL,0.4179,0.4216,0.4169,0.4194,189537940,7959426098,309149,0.25,NAS,USXE
02-Feb-2018,AAPL,0.415,0.417,0.4002,0.4012,347904496,14172890566,603830,0.25,NAS,USXE
05-Feb-2018,AAPL,0.3977,0.4097,0.39,0.3912,291049384,11673630072,528524,0.25,NAS,USXE
06-Feb-2018,AAPL,0.3871,0.4093,0.385,0.4076,273001160,10896333105,506752,0.25,NAS,USXE
07-Feb-2018,AAPL,0.4077,0.4085,0.3977,0.3988,209426552,8435900928,341979,0.25,NAS,USXE`})]}),(0,i.jsxs)(r,{title:`Loading CSVs Into DataFrames`,children:[(0,i.jsx)(`p`,{children:`Opening the CSV and creating the dataframe can be done in two lines of code:`}),(0,i.jsx)(a,{code:`import pandas as pd

filename = "data.csv"
df = pd.read_csv(filename)`}),(0,i.jsx)(`p`,{children:`Create graphic explaining each part... (left verbatim as requested)`})]}),(0,i.jsxs)(r,{title:`Exploring DataFrames`,children:[(0,i.jsx)(`p`,{children:`The new dataframe has many useful methods and properties, some of which I will explain here:`}),(0,i.jsxs)(`ul`,{className:`list-disc ml-6`,children:[(0,i.jsx)(`li`,{children:`.head()`}),(0,i.jsx)(`li`,{children:`.shape`}),(0,i.jsx)(`li`,{children:`.columns`}),(0,i.jsx)(`li`,{children:`.info()`})]}),(0,i.jsx)(a,{code:`import pandas as pd

filename = "data.csv"
df = pd.read_csv(filename)

print("\\nPreview of data:")
print(df.head())

print("\\nColumn names:")
print(df.columns.tolist())

print("\\nShape (rows, columns):")
print(df.shape)

print("\\nData types and memory info:")
print(df.info())`})]}),(0,i.jsxs)(r,{title:`Accessing Data`,children:[(0,i.jsx)(`p`,{children:`Once your data is loaded into a dataframe, you can access specific columns, rows, or individual cells…`}),(0,i.jsx)(a,{code:`import pandas as pd

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
print(df.iloc[0, 4])`})]}),(0,i.jsxs)(r,{title:`Selecting and Processing Data`,children:[(0,i.jsx)(`p`,{children:`Once you know how to access specific parts of a DataFrame, you can start filtering, sorting, and modifying your data…`}),(0,i.jsx)(a,{code:`import pandas as pd

filename = "data.csv"
df = pd.read_csv(filename)

print("\\nFiltering rows where Volume > 200000000:")
print(df[df["Volume"] > 200000000])

print("\\nSorting data by Close price (descending):")
print(df.sort_values("Close", ascending=False).head())

print("\\nCreating a new column for daily range (High - Low):")
df["Range"] = df["High"] - df["Low"]
print(df[["Date", "High", "Low", "Range"]].head())`})]}),(0,i.jsx)(r,{title:`Other Useful Stuff`,children:(0,i.jsxs)(`ul`,{className:`list-disc ml-6`,children:[(0,i.jsx)(`li`,{children:`.dropna()`}),(0,i.jsx)(`li`,{children:`.fillna(value)`}),(0,i.jsx)(`li`,{children:`.describe()`}),(0,i.jsx)(`li`,{children:`.value_counts()`}),(0,i.jsx)(`li`,{children:`.unique()`}),(0,i.jsx)(`li`,{children:`.nunique()`}),(0,i.jsx)(`li`,{children:`.sample()`}),(0,i.jsx)(`li`,{children:`.head(n) / .tail(n)`})]})}),(0,i.jsxs)(r,{title:`Saving Changes`,children:[(0,i.jsx)(`p`,{children:`Once you’ve finished processing or cleaning your data, you’ll often want to save…`}),(0,i.jsx)(a,{code:`df.to_csv("new_data.csv", index=False)`}),(0,i.jsx)(a,{code:`df.to_excel("output.xlsx", index=False)`}),(0,i.jsx)(a,{code:`df[["Date", "Close", "Volume"]].to_csv("selected_data.csv", index=False)`}),(0,i.jsx)(a,{code:`df.to_csv("data.csv", mode="a", header=False, index=False)`}),(0,i.jsxs)(`p`,{children:[`Best Practice:`,(0,i.jsx)(`br`,{}),`Keep a backup…`]})]})]})}export{s as default,o as meta};