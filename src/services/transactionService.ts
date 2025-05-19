import axios from 'axios';

export interface Transaction {
  date_proc: string;
  amount_proc: number;
  category_proc: string;
  desc_proc: string;
  account_proc: string;
}

class TransactionService {
  private baseUrl: string;

  constructor() {
    // TODO: Replace with your actual API endpoint
    this.baseUrl = '/api';
  }

  async getTransactions(): Promise<Transaction[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/transactions`);
      return response.data;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }
  }

  async getTransactionsByDateRange(startDate: Date, endDate: Date): Promise<Transaction[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/transactions`, {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching transactions by date range:', error);
      return [];
    }
  }

  async getTransactionsByCategory(category: string): Promise<Transaction[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/transactions`, {
        params: {
          category,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching transactions by category:', error);
      return [];
    }
  }
}

export const transactionService = new TransactionService(); 