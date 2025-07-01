import { Transaction, Category, FinancialSummary } from '../types';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const getCurrentMonth = (): string => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

export const getMonthName = (monthString: string): string => {
  const [year, month] = monthString.split('-');
  return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  });
};

export const calculateFinancialSummary = (
  transactions: Transaction[],
  categories: Category[]
): FinancialSummary => {
  const currentMonth = getCurrentMonth();
  const monthlyTransactions = transactions.filter(t => 
    t.date.startsWith(currentMonth)
  );

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyIncome = monthlyTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyExpenses = monthlyTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const budgetStatus = categories
    .filter(c => c.budget && c.budget > 0)
    .map(category => {
      const spent = monthlyTransactions
        .filter(t => t.category === category.name && t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      
      return {
        categoryId: category.id,
        spent,
        budget: category.budget!,
        percentage: (spent / category.budget!) * 100,
      };
    });

  return {
    totalIncome,
    totalExpenses,
    balance: totalIncome - totalExpenses,
    monthlyIncome,
    monthlyExpenses,
    savings: monthlyIncome - monthlyExpenses,
    budgetStatus,
  };
};

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const getNextRecurringDate = (lastDate: string, frequency: string): string => {
  const date = new Date(lastDate);
  
  switch (frequency) {
    case 'weekly':
      date.setDate(date.getDate() + 7);
      break;
    case 'monthly':
      date.setMonth(date.getMonth() + 1);
      break;
    case 'yearly':
      date.setFullYear(date.getFullYear() + 1);
      break;
    default:
      return lastDate;
  }
  
  return date.toISOString().split('T')[0];
};