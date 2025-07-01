import { useState, useEffect } from 'react';
import { Transaction, Category, FinancialSummary } from '../types';
import { calculateFinancialSummary, generateId, getNextRecurringDate } from '../utils';

const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: 'Salary', color: '#10B981', type: 'income' },
  { id: '2', name: 'Freelance', color: '#34D399', type: 'income' },
  { id: '3', name: 'Investment', color: '#6EE7B7', type: 'income' },
  { id: '4', name: 'Groceries', color: '#EF4444', type: 'expense', budget: 400 },
  { id: '5', name: 'Transportation', color: '#F87171', type: 'expense', budget: 200 },
  { id: '6', name: 'Entertainment', color: '#FCA5A5', type: 'expense', budget: 150 },
  { id: '7', name: 'Utilities', color: '#DC2626', type: 'expense', budget: 300 },
  { id: '8', name: 'Healthcare', color: '#B91C1C', type: 'expense', budget: 200 },
  { id: '9', name: 'Shopping', color: '#991B1B', type: 'expense', budget: 250 },
];

const SAMPLE_TRANSACTIONS: Transaction[] = [
  {
    id: generateId(),
    type: 'income',
    amount: 5000,
    category: 'Salary',
    description: 'Monthly salary',
    date: '2025-01-01',
    recurring: 'monthly',
  },
  {
    id: generateId(),
    type: 'expense',
    amount: 320,
    category: 'Groceries',
    description: 'Weekly grocery shopping',
    date: '2025-01-05',
  },
  {
    id: generateId(),
    type: 'expense',
    amount: 85,
    category: 'Transportation',
    description: 'Gas and parking',
    date: '2025-01-08',
  },
  {
    id: generateId(),
    type: 'income',
    amount: 800,
    category: 'Freelance',
    description: 'Web development project',
    date: '2025-01-10',
  },
  {
    id: generateId(),
    type: 'expense',
    amount: 45,
    category: 'Entertainment',
    description: 'Movie tickets',
    date: '2025-01-12',
  },
];

export const useFinances = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(SAMPLE_TRANSACTIONS);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [summary, setSummary] = useState<FinancialSummary>({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    savings: 0,
    budgetStatus: [],
  });

  useEffect(() => {
    const newSummary = calculateFinancialSummary(transactions, categories);
    setSummary(newSummary);
  }, [transactions, categories]);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: generateId(),
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    setTransactions(prev =>
      prev.map(t => (t.id === id ? { ...t, ...updates } : t))
    );
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...category,
      id: generateId(),
    };
    setCategories(prev => [...prev, newCategory]);
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories(prev =>
      prev.map(c => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  const processRecurringTransactions = () => {
    const today = new Date().toISOString().split('T')[0];
    const recurringTransactions = transactions.filter(
      t => t.recurring && t.recurring !== 'none' && t.nextDue && t.nextDue <= today
    );

    recurringTransactions.forEach(transaction => {
      const newTransaction: Transaction = {
        ...transaction,
        id: generateId(),
        date: today,
        nextDue: getNextRecurringDate(today, transaction.recurring!),
      };
      
      setTransactions(prev => [newTransaction, ...prev]);
      
      updateTransaction(transaction.id, {
        nextDue: getNextRecurringDate(today, transaction.recurring!),
      });
    });
  };

  return {
    transactions,
    categories,
    summary,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addCategory,
    updateCategory,
    deleteCategory,
    processRecurringTransactions,
  };
};