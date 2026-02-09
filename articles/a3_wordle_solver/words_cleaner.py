import pandas as pd

input_filename = "fullwords.txt"
output_filename = "fullwords.csv"

words = []

with open(input_filename, "r") as f:
    for line in f:
        parts = line.strip().split("|")
        for word in parts:
            w = word.strip().lower()
            if len(w) == 5 and w.isalpha():
                words.append(w)

df = pd.DataFrame(words, columns=["word"])
df = df.drop_duplicates()
df = df.sort_values("word")
df = df.reset_index(drop=True)

df.to_csv(output_filename, index = False)
