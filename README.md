# Personal Finance Dashboard

A modern, mobile-friendly web application for tracking and analyzing personal finances. The dashboard provides insights into spending patterns, transaction history, and financial metrics.

## Features

- **Metrics Dashboard**: View daily, monthly, and historical spending metrics
- **Spending Analytics**: Analyze top spending categories and merchants
- **Transaction History**: Filter and search through transaction history
- **Mobile-Friendly**: Optimized for use on iPhone and other mobile devices

## Tech Stack

- Frontend: React with TypeScript, Material-UI
- Backend: Vercel Serverless Functions
- Data Source: Google Sheets
- Charts: Recharts

## Deployment Instructions

### Prerequisites

- GitHub account
- Vercel account (free tier available)
- Google Cloud Platform account with Google Sheets API enabled
- Google Sheets API credentials

### Setup Steps

1. Fork this repository to your GitHub account

2. Create a Vercel account at https://vercel.com

3. Connect your GitHub repository to Vercel:
   - Go to Vercel dashboard
   - Click "New Project"
   - Import your forked repository
   - Click "Deploy"

4. Configure Environment Variables in Vercel:
   - Go to your project settings in Vercel
   - Navigate to "Environment Variables"
   - Add the following variables:
     - `GOOGLE_CREDENTIALS`: Your Google Sheets API credentials (as JSON string)
     - `SPREADSHEET_ID`: Your Google Sheets ID

5. Deploy your application:
   - Vercel will automatically deploy your application
   - You'll get a URL like `https://your-app.vercel.app`

## Development

- Frontend code is in the `src` directory
- API endpoints are in the `api` directory
- The application uses serverless functions for the backend

## Security Notes

- Your Google Sheets credentials are stored securely in Vercel's environment variables
- The application only has read-only access to your Google Sheets
- All API endpoints are protected by CORS

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT
