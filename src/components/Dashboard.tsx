import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, PiggyBank, AlertTriangle } from 'lucide-react';
import { FinancialSummary } from '../types';
import { formatCurrency } from '../utils';

interface DashboardProps {
  summary: FinancialSummary;
}

const Dashboard: React.FC<DashboardProps> = ({ summary }) => {
  const savingsRate = summary.monthlyIncome > 0 
    ? (summary.savings / summary.monthlyIncome) * 100 
    : 0;

  const overBudgetCategories = summary.budgetStatus.filter(b => b.percentage > 100);
  const nearLimitCategories = summary.budgetStatus.filter(b => b.percentage > 80 && b.percentage <= 100);

  return (
    <div className="space-y-6">
      {/* Alert Section */}
      {(overBudgetCategories.length > 0 || nearLimitCategories.length > 0) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
            <h3 className="text-sm font-medium text-yellow-800">Budget Alerts</h3>
          </div>
          <div className="text-sm text-yellow-700">
            {overBudgetCategories.length > 0 && (
              <p className="mb-1">
                {overBudgetCategories.length} categor{overBudgetCategories.length === 1 ? 'y is' : 'ies are'} over budget
              </p>
            )}
            {nearLimitCategories.length > 0 && (
              <p>
                {nearLimitCategories.length} categor{nearLimitCategories.length === 1 ? 'y is' : 'ies are'} approaching budget limit
              </p>
            )}
          </div>
        </div>
      )}

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Balance</p>
              <p className={`text-2xl font-bold ${summary.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(summary.balance)}
              </p>
            </div>
            <div className={`p-3 rounded-full ${summary.balance >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
              <DollarSign className={`h-6 w-6 ${summary.balance >= 0 ? 'text-green-600' : 'text-red-600'}`} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Income</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(summary.monthlyIncome)}
              </p>
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Expenses</p>
              <p className="text-2xl font-bold text-red-600">
                {formatCurrency(summary.monthlyExpenses)}
              </p>
            </div>
            <div className="p-3 rounded-full bg-red-100">
              <TrendingDown className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Savings</p>
              <p className={`text-2xl font-bold ${summary.savings >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                {formatCurrency(summary.savings)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {savingsRate.toFixed(1)}% of income
              </p>
            </div>
            <div className={`p-3 rounded-full ${summary.savings >= 0 ? 'bg-blue-100' : 'bg-red-100'}`}>
              <PiggyBank className={`h-6 w-6 ${summary.savings >= 0 ? 'text-blue-600' : 'text-red-600'}`} />
            </div>
          </div>
        </div>
      </div>

      {/* Budget Progress */}
      {summary.budgetStatus.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Budget Overview</h3>
          <div className="space-y-4">
            {summary.budgetStatus.map((budget, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Category {budget.categoryId}</span>
                  <span className="text-sm text-gray-600">
                    {formatCurrency(budget.spent)} / {formatCurrency(budget.budget)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      budget.percentage > 100 
                        ? 'bg-red-500' 
                        : budget.percentage > 80 
                        ? 'bg-yellow-500' 
                        : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span className={`text-xs font-medium ${
                    budget.percentage > 100 
                      ? 'text-red-600' 
                      : budget.percentage > 80 
                      ? 'text-yellow-600' 
                      : 'text-green-600'
                  }`}>
                    {budget.percentage.toFixed(1)}% used
                  </span>
                  {budget.percentage > 100 && (
                    <span className="text-xs text-red-600">
                      {formatCurrency(budget.spent - budget.budget)} over budget
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;