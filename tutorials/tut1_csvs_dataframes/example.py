import pandas as pd

filename = "data.csv"
df = pd.read_csv(filename)

print("\nAccessing a single column:")
print(df["Close"]) # Use the column label as defined in the first line of the CSV

print("\nAccessing multiple columns:")
print(df[["Date", "Close"]])

print("\nAccessing rows:")
print(df.loc[0])      # Use zero based indexing 

print("\nAccessing specific cells:")
print(df.loc[0, "Close"])   # Returns the value  of the "Close" column for row 0
print(df.iloc[0, 5])        # Returns the value  of the 5th column for row 0