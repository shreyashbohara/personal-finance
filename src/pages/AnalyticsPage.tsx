import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Paper,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';

interface Transaction {
  date_proc: string;
  amount_proc: number;
  category_proc: string;
  desc_proc: string;
}

const AnalyticsPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    // TODO: Replace with actual API call to get transactions
    // For now, we'll use mock data
    const mockTransactions: Transaction[] = [
      { date_proc: '2024-03-20', amount_proc: -50, category_proc: 'Groceries', desc_proc: 'Walmart' },
      { date_proc: '2024-03-19', amount_proc: -30, category_proc: 'Dining', desc_proc: 'Chipotle' },
      // Add more mock data as needed
    ];
    setTransactions(mockTransactions);
  }, []);

  // Calculate top spending categories
  const categorySpending = transactions.reduce((acc, t) => {
    const category = t.category_proc;
    acc[category] = (acc[category] || 0) + Math.abs(t.amount_proc);
    return acc;
  }, {} as Record<string, number>);

  const topCategories = Object.entries(categorySpending)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([category, amount]) => ({
      category,
      amount,
    }));

  // Calculate top merchants
  const merchantSpending = transactions.reduce((acc, t) => {
    const merchant = t.desc_proc;
    acc[merchant] = (acc[merchant] || 0) + Math.abs(t.amount_proc);
    return acc;
  }, {} as Record<string, number>);

  const topMerchants = Object.entries(merchantSpending)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([merchant, amount]) => ({
      merchant,
      amount,
    }));

  // Calculate monthly trends
  const currentMonth = new Date();
  const lastMonth = subMonths(currentMonth, 1);

  const monthlyData = [
    {
      month: format(currentMonth, 'MMM yyyy'),
      current: transactions
        .filter(t => new Date(t.date_proc) >= startOfMonth(currentMonth))
        .reduce((sum, t) => sum + Math.abs(t.amount_proc), 0),
      last: transactions
        .filter(t => new Date(t.date_proc) >= startOfMonth(lastMonth) && new Date(t.date_proc) <= endOfMonth(lastMonth))
        .reduce((sum, t) => sum + Math.abs(t.amount_proc), 0),
    },
  ];

  return (
    <Box sx={{ pb: 7 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Spending Analytics
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Top Spending Categories
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topCategories}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="amount" fill="#1976d2" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Top Spending Merchants
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topMerchants}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="merchant" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="amount" fill="#dc004e" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Monthly Spending Comparison
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="current" stroke="#1976d2" name="Current Month" />
                  <Line type="monotone" dataKey="last" stroke="#dc004e" name="Last Month" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AnalyticsPage; 