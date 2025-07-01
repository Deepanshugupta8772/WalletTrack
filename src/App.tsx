import React, { useState } from 'react';
import { Wallet, Plus, BarChart3, List, Settings } from 'lucide-react';
import { useFinances } from './hooks/useFinances';
import Dashboard from './components/Dashboard';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import Charts from './components/Charts';

function App() {
  const {
    transactions,
    categories,
    summary,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  } = useFinances();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'transactions' | 'charts' | 'settings'>('dashboard');
  const [isTransactionFormOpen, setIsTransactionFormOpen] = useState(false);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Wallet },
    { id: 'transactions', label: 'Transactions', icon: List },
    { id: 'charts', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Wallet className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">WalletTrack</h1>
                <p className="text-sm text-gray-500">Personal Finance Tracker</p>
              </div>
            </div>

            <button
              onClick={() => setIsTransactionFormOpen(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Transaction
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && <Dashboard summary={summary} />}
        
        {activeTab === 'transactions' && (
          <TransactionList
            transactions={transactions}
            categories={categories}
            onUpdateTransaction={updateTransaction}
            onDeleteTransaction={deleteTransaction}
          />
        )}
        
        {activeTab === 'charts' && (
          <Charts transactions={transactions} categories={categories} />
        )}
        
        {activeTab === 'settings' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Settings</h2>
            <p className="text-gray-600">Settings panel coming soon. This will include category management, budget configuration, and account preferences.</p>
          </div>
        )}
      </main>

      {/* Transaction Form Modal */}
      <TransactionForm
        categories={categories}
        onAddTransaction={addTransaction}
        isOpen={isTransactionFormOpen}
        onClose={() => setIsTransactionFormOpen(false)}
      />
    </div>
  );
}

export default App;