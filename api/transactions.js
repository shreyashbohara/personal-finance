const { google } = require('googleapis');

// Google Sheets setup
const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS),
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

const sheets = google.sheets({ version: 'v4', auth });
const spreadsheetId = process.env.SPREADSHEET_ID;
const range = 'iOS_automation!A:Z';

// Helper function to process the data
const processData = (rows) => {
  if (!rows || rows.length === 0) return [];

  const headers = rows[0];
  return rows.slice(1).map(row => {
    const transaction = {};
    headers.forEach((header, index) => {
      let value = row[index];
      
      // Process date
      if (header === 'Date Combined') {
        transaction.date_proc = value;
      }
      // Process amount
      else if (header === 'Amount2') {
        transaction.amount_proc = parseFloat(value) || 0;
      }
      // Process category
      else if (header === 'Category') {
        transaction.category_proc = value || 'Uncategorized';
      }
      // Process description
      else if (header === 'Description') {
        transaction.desc_proc = value || 'No Description';
      }
      // Process account
      else if (header === 'Account') {
        transaction.account_proc = value || 'Unknown';
      }
    });
    return transaction;
  });
};

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { startDate, endDate, category } = req.query;
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    let transactions = processData(response.data.values);

    // Apply filters if provided
    if (startDate) {
      transactions = transactions.filter(t => new Date(t.date_proc) >= new Date(startDate));
    }
    if (endDate) {
      transactions = transactions.filter(t => new Date(t.date_proc) <= new Date(endDate));
    }
    if (category) {
      transactions = transactions.filter(t => t.category_proc === category);
    }

    res.json(transactions);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
}; 