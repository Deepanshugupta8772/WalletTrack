import React from 'react';
import { Transaction, Category } from '../types';
import { formatCurrency, getCurrentMonth } from '../utils';

interface ChartsProps {
  transactions: Transaction[];
  categories: Category[];
}

const Charts: React.FC<ChartsProps> = ({ transactions, categories }) => {
  const currentMonth = getCurrentMonth();
  const monthlyTransactions = transactions.filter(t => t.date.startsWith(currentMonth));

  // Category breakdown for current month
  const categoryData = categories.map(category => {
    const categoryTransactions = monthlyTransactions.filter(
      t => t.category === category.name && t.type === category.type
    );
    const total = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);
    return {
      name: category.name,
      amount: total,
      color: category.color,
      type: category.type,
    };
  }).filter(item => item.amount > 0);

  const totalExpenses = categoryData
    .filter(item => item.type === 'expense')
    .reduce((sum, item) => sum + item.amount, 0);

  const totalIncome = categoryData
    .filter(item => item.type === 'income')
    .reduce((sum, item) => sum + item.amount, 0);

  // Monthly trends (last 6 months)
  const monthlyTrends = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    const monthTransactions = transactions.filter(t => t.date.startsWith(monthKey));
    const income = monthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = monthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    monthlyTrends.push({
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      income,
      expenses,
    });
  }

  const maxAmount = Math.max(...monthlyTrends.flatMap(m => [m.income, m.expenses]));

  return (
    <div className="space-y-6">
      {/* Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense Breakdown */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Expenses by Category</h3>
          {totalExpenses > 0 ? (
            <div className="space-y-4">
              {categoryData
                .filter(item => item.type === 'expense')
                .sort((a, b) => b.amount - a.amount)
                .map((item, index) => {
                  const percentage = (item.amount / totalExpenses) * 100;
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-sm font-medium text-gray-700">{item.name}</span>
                        </div>
                        <span className="text-sm text-gray-600">{formatCurrency(item.amount)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full transition-all duration-500"
                          style={{ 
                            width: `${percentage}%`,
                            backgroundColor: item.color 
                          }}
                        />
                      </div>
                      <div className="text-xs text-gray-500">
                        {percentage.toFixed(1)}% of total expenses
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No expenses this month</p>
          )}
        </div>

        {/* Income Breakdown */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Income by Category</h3>
          {totalIncome > 0 ? (
            <div className="space-y-4">
              {categoryData
                .filter(item => item.type === 'income')
                .sort((a, b) => b.amount - a.amount)
                .map((item, index) => {
                  const percentage = (item.amount / totalIncome) * 100;
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-sm font-medium text-gray-700">{item.name}</span>
                        </div>
                        <span className="text-sm text-gray-600">{formatCurrency(item.amount)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full transition-all duration-500"
                          style={{ 
                            width: `${percentage}%`,
                            backgroundColor: item.color 
                          }}
                        />
                      </div>
                      <div className="text-xs text-gray-500">
                        {percentage.toFixed(1)}% of total income
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No income this month</p>
          )}
        </div>
      </div>

      {/* Monthly Trends */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">6-Month Trend</h3>
        <div className="h-64 flex items-end justify-between space-x-2">
          {monthlyTrends.map((month, index) => (
            <div key={index} className="flex-1 flex flex-col items-center space-y-2">
              <div className="w-full flex flex-col items-center space-y-1">
                {/* Income bar */}
                <div 
                  className="w-full bg-green-500 rounded-t transition-all duration-500 min-h-[4px]"
                  style={{ 
                    height: `${maxAmount > 0 ? (month.income / maxAmount) * 200 : 4}px`
                  }}
                  title={`Income: ${formatCurrency(month.income)}`}
                />
                {/* Expense bar */}
                <div 
                  className="w-full bg-red-500 rounded-b transition-all duration-500 min-h-[4px]"
                  style={{ 
                    height: `${maxAmount > 0 ? (month.expenses / maxAmount) * 200 : 4}px`
                  }}
                  title={`Expenses: ${formatCurrency(month.expenses)}`}
                />
              </div>
              <span className="text-xs text-gray-600 font-medium">{month.month}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-center space-x-6 mt-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-sm text-gray-600">Income</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span className="text-sm text-gray-600">Expenses</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Charts;