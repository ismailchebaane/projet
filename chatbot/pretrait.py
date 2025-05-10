import pandas as pd

# Load your dataset
df = pd.read_csv("data/Dataset.csv", encoding="cp1252")

# Drop unwanted columns
columns_to_drop = ["nom d'équipement", "ID Technique"]
df = df.drop(columns=columns_to_drop)

# Clean and normalize column names (optional but helps with consistency)
df.columns = (
    df.columns
    .str.strip()
    .str.replace("\n", " ", regex=False)
    .str.replace(r"[^\w\s]", "", regex=True)
    .str.replace(" +", " ", regex=True)
    .str.lower()
    .str.replace(" ", "_")
)

# Preview cleaned dataframe
print(df.head())

# Save cleaned dataset (optional)
#df.to_csv("data/cleaned_dataset.csv", index=False, encoding="utf-8")
