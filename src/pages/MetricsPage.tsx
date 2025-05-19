import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { format } from 'date-fns';

interface Transaction {
  date_proc: string;
  amount_proc: number;
  category_proc: string;
}

const MetricsPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    // TODO: Replace with actual API call to get transactions
    // For now, we'll use mock data
    const mockTransactions: Transaction[] = [
      { date_proc: '2024-03-20', amount_proc: -50, category_proc: 'Groceries' },
      { date_proc: '2024-03-19', amount_proc: -30, category_proc: 'Dining' },
      // Add more mock data as needed
    ];
    setTransactions(mockTransactions);
    
    // Extract unique categories
    const uniqueCategories = Array.from(new Set(mockTransactions.map(t => t.category_proc)));
    setCategories(uniqueCategories);
  }, []);

  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

  const filteredTransactions = transactions.filter(t => 
    selectedCategories.length === 0 || selectedCategories.includes(t.category_proc)
  );

  const spentToday = filteredTransactions
    .filter(t => format(new Date(t.date_proc), 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd'))
    .reduce((sum, t) => sum + Math.abs(t.amount_proc), 0);

  const spentThisMonth = filteredTransactions
    .filter(t => new Date(t.date_proc) >= startOfMonth)
    .reduce((sum, t) => sum + Math.abs(t.amount_proc), 0);

  const spentLastMonth = filteredTransactions
    .filter(t => new Date(t.date_proc) >= startOfLastMonth && new Date(t.date_proc) <= endOfLastMonth)
    .reduce((sum, t) => sum + Math.abs(t.amount_proc), 0);

  return (
    <Box sx={{ pb: 7 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Financial Metrics
      </Typography>

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Categories</InputLabel>
        <Select
          multiple
          value={selectedCategories}
          onChange={(e) => setSelectedCategories(e.target.value as string[])}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
        >
          {categories.map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Spent Today
              </Typography>
              <Typography variant="h4">
                ${spentToday.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Spent This Month
              </Typography>
              <Typography variant="h4">
                ${spentThisMonth.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Spent Last Month
              </Typography>
              <Typography variant="h4">
                ${spentLastMonth.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MetricsPage; 