import streamlit as st
import pandas as pd
import math
from pathlib import Path
import gspread
from oauth2client.service_account import ServiceAccountCredentials
from datetime import datetime

# --- Connect to Google Sheets ---
scope = ["https://spreadsheets.google.com/feeds", "https://www.googleapis.com/auth/drive"]
creds = ServiceAccountCredentials.from_json_keyfile_name("key.json", scope)
client = gspread.authorize(creds)


sheet = client.open("Money").worksheet("iOS_automation")
data = sheet.get_all_records()

df = pd.DataFrame(data)

df['date_proc'] = pd.to_datetime(df['Date Combined'], errors='coerce')
df['eomonth_proc'] = pd.to_datetime(df['Eo Month'], errors='coerce')
df['amount_proc'] = pd.to_numeric(df['Amount2'], errors='coerce')
df['category_proc'] = df['Category'].fillna('Uncategorized')
df['account_proc'] = df['Account'].fillna('Unknown')
df['desc_proc'] = df['Description'].fillna('No Description')

df = df.drop(columns=['Date Combined', 'Eo Month', 'Amount2', 'Category',
                       'Account', 'Description','Date','Amount','Description','Account','Category','date','Month','year'])

# # Check for errors in 'Date' and 'Amount' columns
# date_errors = df['Date'].isna().sum()
# amount_errors = df['Amount'].isna().sum()

print(df.info())


