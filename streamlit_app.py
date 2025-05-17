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
df['date_proc'] = pd.to_datetime(df['Date Combined'], errors='coerce')
df['amount_proc'] = pd.to_numeric(df['Amount2'], errors='coerce')
df['category_proc'] = df['Category'].fillna('Uncategorized')
df['account_proc'] = df['Account'].fillna('Unknown')
df['desc_proc'] = df['Description'].fillna('No Description')

print(df.info())

# # Check for errors in 'Date' and 'Amount' columns
# date_errors = df['Date'].isna().sum()
# amount_errors = df['Amount'].isna().sum()

# # Print the number of errors
# print(f"Rows with invalid dates: {date_errors}")
# print(f"Rows with invalid amounts: {amount_errors}")


# # --- Data Cleanup ---
# df['Date'] = pd.to_datetime(df['Date'])
# df['Amount'] = pd.to_numeric(df['Amount'])

# # Optional: Add 'Exclude' column if not present
# if 'Exclude' not in df.columns:
#     df['Exclude'] = False

# # --- Filters ---
# st.title("📊 My Finance Dashboard")

# # Month filter
# months = df['Date'].dt.strftime('%Y-%m').unique()
# selected_month = st.selectbox("Select Month", sorted(months, reverse=True))
# month_df = df[df['Date'].dt.strftime('%Y-%m') == selected_month]

# # Exclude filter
# filtered_df = month_df[month_df['Exclude'] != True]

# # --- Summary Metrics ---
# total_income = filtered_df[filtered_df['Amount'] > 0]['Amount'].sum()
# total_expenses = filtered_df[filtered_df['Amount'] < 0]['Amount'].sum()
# net = total_income + total_expenses

# col1, col2, col3 = st.columns(3)
# col1.metric("💰 Income", f"${total_income:,.2f}")
# col2.metric("💸 Expenses", f"${abs(total_expenses):,.2f}")
# col3.metric("🧾 Net", f"${net:,.2f}")

# # --- Transactions Table ---
# st.subheader("Transactions")
# st.dataframe(filtered_df[['Date', 'Description', 'Amount', 'Category', 'Account']])



"""

# Set the title and favicon that appear in the Browser's tab bar.
st.set_page_config(
    page_title='GDP dashboard',
    page_icon=':earth_americas:', # This is an emoji shortcode. Could be a URL too.
)

# -----------------------------------------------------------------------------
# Declare some useful functions.

@st.cache_data
def get_gdp_data():
    #Grab GDP data from a CSV file.

    # This uses caching to avoid having to read the file every time. If we were
    # reading from an HTTP endpoint instead of a file, it's a good idea to set
    # a maximum age to the cache with the TTL argument: @st.cache_data(ttl='1d')
    

    # Instead of a CSV on disk, you could read from an HTTP endpoint here too.
    DATA_FILENAME = Path(__file__).parent/'data/gdp_data.csv'
    raw_gdp_df = pd.read_csv(DATA_FILENAME)

    MIN_YEAR = 1960
    MAX_YEAR = 2022

    # The data above has columns like:
    # - Country Name
    # - Country Code
    # - [Stuff I don't care about]
    # - GDP for 1960
    # - GDP for 1961
    # - GDP for 1962
    # - ...
    # - GDP for 2022
    #
    # ...but I want this instead:
    # - Country Name
    # - Country Code
    # - Year
    # - GDP
    #
    # So let's pivot all those year-columns into two: Year and GDP
    gdp_df = raw_gdp_df.melt(
        ['Country Code'],
        [str(x) for x in range(MIN_YEAR, MAX_YEAR + 1)],
        'Year',
        'GDP',
    )

    # Convert years from string to integers
    gdp_df['Year'] = pd.to_numeric(gdp_df['Year'])

    return gdp_df

gdp_df = get_gdp_data()

# -----------------------------------------------------------------------------
# Draw the actual page

# Set the title that appears at the top of the page.
'''
# :earth_americas: GDP dashboard

Browse GDP data from the [World Bank Open Data](https://data.worldbank.org/) website. As you'll
notice, the data only goes to 2022 right now, and datapoints for certain years are often missing.
But it's otherwise a great (and did I mention _free_?) source of data.
'''

# Add some spacing
''
''

min_value = gdp_df['Year'].min()
max_value = gdp_df['Year'].max()

from_year, to_year = st.slider(
    'Which years are you interested in?',
    min_value=min_value,
    max_value=max_value,
    value=[min_value, max_value])

countries = gdp_df['Country Code'].unique()

if not len(countries):
    st.warning("Select at least one country")

selected_countries = st.multiselect(
    'Which countries would you like to view?',
    countries,
    ['DEU', 'FRA', 'GBR', 'BRA', 'MEX', 'JPN'])

''
''
''

# Filter the data
filtered_gdp_df = gdp_df[
    (gdp_df['Country Code'].isin(selected_countries))
    & (gdp_df['Year'] <= to_year)
    & (from_year <= gdp_df['Year'])
]

st.header('GDP over time', divider='gray')

''

st.line_chart(
    filtered_gdp_df,
    x='Year',
    y='GDP',
    color='Country Code',
)

''
''


first_year = gdp_df[gdp_df['Year'] == from_year]
last_year = gdp_df[gdp_df['Year'] == to_year]

st.header(f'GDP in {to_year}', divider='gray')

''

cols = st.columns(4)

for i, country in enumerate(selected_countries):
    col = cols[i % len(cols)]

    with col:
        first_gdp = first_year[first_year['Country Code'] == country]['GDP'].iat[0] / 1000000000
        last_gdp = last_year[last_year['Country Code'] == country]['GDP'].iat[0] / 1000000000

        if math.isnan(first_gdp):
            growth = 'n/a'
            delta_color = 'off'
        else:
            growth = f'{last_gdp / first_gdp:,.2f}x'
            delta_color = 'normal'

        st.metric(
            label=f'{country} GDP',
            value=f'{last_gdp:,.0f}B',
            delta=growth,
            delta_color=delta_color
        )


"""