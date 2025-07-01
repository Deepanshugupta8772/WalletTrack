export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
  recurring?: 'none' | 'weekly' | 'monthly' | 'yearly';
  nextDue?: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  type: 'income' | 'expense';
  budget?: number;
}

export interface Budget {
  id: string;
  categoryId: string;
  amount: number;
  period: 'monthly' | 'yearly';
  alertThreshold: number; // percentage
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  savings: number;
  budgetStatus: {
    categoryId: string;
    spent: number;
    budget: number;
    percentage: number;
  }[];
}