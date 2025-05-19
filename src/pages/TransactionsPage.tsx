import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';

interface Transaction {
  date_proc: string;
  amount_proc: number;
  category_proc: string;
  desc_proc: string;
}

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    // TODO: Replace with actual API call to get transactions
    // For now, we'll use mock data
    const mockTransactions: Transaction[] = [
      { date_proc: '2024-03-20', amount_proc: -50, category_proc: 'Groceries', desc_proc: 'Walmart' },
      { date_proc: '2024-03-19', amount_proc: -30, category_proc: 'Dining', desc_proc: 'Chipotle' },
      // Add more mock data as needed
    ];
    setTransactions(mockTransactions);
    setFilteredTransactions(mockTransactions);
    
    // Extract unique categories
    const uniqueCategories = Array.from(new Set(mockTransactions.map(t => t.category_proc)));
    setCategories(uniqueCategories);
  }, []);

  useEffect(() => {
    let filtered = [...transactions];

    if (selectedCategory) {
      filtered = filtered.filter(t => t.category_proc === selectedCategory);
    }

    if (startDate) {
      filtered = filtered.filter(t => new Date(t.date_proc) >= startDate);
    }

    if (endDate) {
      filtered = filtered.filter(t => new Date(t.date_proc) <= endDate);
    }

    setFilteredTransactions(filtered);
  }, [transactions, selectedCategory, startDate, endDate]);

  return (
    <Box sx={{ pb: 7 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Transactions
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={selectedCategory}
                label="Category"
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                slotProps={{ textField: { sx: { minWidth: 200 } } }}
              />
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                slotProps={{ textField: { sx: { minWidth: 200 } } }}
              />
            </LocalizationProvider>
          </Box>
        </CardContent>
      </Card>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Category</TableCell>
              <TableCell align="right">Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTransactions.map((transaction, index) => (
              <TableRow key={index}>
                <TableCell>{format(new Date(transaction.date_proc), 'MMM dd, yyyy')}</TableCell>
                <TableCell>{transaction.desc_proc}</TableCell>
                <TableCell>{transaction.category_proc}</TableCell>
                <TableCell align="right" sx={{ color: transaction.amount_proc < 0 ? 'error.main' : 'success.main' }}>
                  ${Math.abs(transaction.amount_proc).toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TransactionsPage; 