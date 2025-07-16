import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useExpenses } from '../contexts/ExpenseContext';
import { formatExpensesForChart, calculateTotal } from '../utils/chartUtils';
import ExpenseForm from '../components/ExpenseForm';
import IncomeForm from '../components/IncomeForm';
import ExpenseList from '../components/ExpenseList';
import IncomeList from '../components/IncomeList';
import ExpenseChart from '../components/ExpenseChart';
import Header from '../components/Header';

const Dashboard = () => {
  const [period, setPeriod] = useState('daily');
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showAddIncome, setShowAddIncome] = useState(false);
  const { currentUser, signout } = useAuth();
  const {
    expenses,
    incomes,
    getDailyExpenses,
    getWeeklyExpenses,
    getMonthlyExpenses,
    getDailyIncomes,
    getWeeklyIncomes,
    getMonthlyIncomes,
    addExpense,
    deleteExpense,
    editExpense,
    addIncome,
    deleteIncome,
    editIncome,
    calculateTotalIncome
  } = useExpenses();
  const navigate = useNavigate();

  const conversionRate = 83.5; // USD to INR

  React.useEffect(() => {
    if (!currentUser) {
      navigate('/signin');
    }
  }, [currentUser, navigate]);

  const getExpensesByPeriod = () => {
    switch (period) {
      case 'daily':
        return getDailyExpenses();
      case 'weekly':
        return getWeeklyExpenses();
      case 'monthly':
        return getMonthlyExpenses();
      default:
        return expenses;
    }
  };

  const getIncomesByPeriod = () => {
    switch (period) {
      case 'daily':
        return getDailyIncomes();
      case 'weekly':
        return getWeeklyIncomes();
      case 'monthly':
        return getMonthlyIncomes();
      default:
        return incomes;
    }
  };

  const currentExpenses = getExpensesByPeriod();
  const currentIncomes = getIncomesByPeriod();
  const chartData = formatExpensesForChart(currentExpenses);
  const totalAmount = calculateTotal(currentExpenses);
  const totalIncome = calculateTotalIncome(period);
  const netBalance = totalIncome - totalAmount;

  const handleSignOut = async () => {
    try {
      await signout();
      navigate('/');
    } catch (error) {
      console.error('Failed to sign out', error);
    }
  };

  const handleAddExpense = (expense) => {
    addExpense(expense);
    setShowAddExpense(false);
  };

  const handleAddIncome = (income) => {
    addIncome(income);
    setShowAddIncome(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onSignOut={handleSignOut} userName={currentUser?.name} />

      <main className="container mx-auto p-4 pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Summary and Charts */}
          <div className="lg:col-span-2 space-y-6">
            {/* Period selector */}
            <div className="bg-white rounded-xl shadow p-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Financial Overview</h2>

              <div className="flex items-center justify-between mb-4">
                <div className="flex space-x-2">
                  {['daily', 'weekly', 'monthly'].map((p) => (
                    <button
                      key={p}
                      onClick={() => setPeriod(p)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium ${
                        period === p
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-500">Total Income</p>
                  <p className="text-xl font-bold text-green-600">
                    ₹{(Number(totalIncome) * conversionRate).toFixed(2)}
                  </p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-500">Total Expenses</p>
                  <p className="text-xl font-bold text-red-600">
                    ₹{(Number(totalAmount) * conversionRate).toFixed(2)}
                  </p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-500">Net Balance</p>
                  <p
                    className={`text-xl font-bold ${
                      netBalance >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    ₹{(Number(netBalance) * conversionRate).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="bg-white rounded-xl shadow p-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Expense Breakdown</h2>
              <div className="h-64">
                {chartData.length > 0 ? (
                  <ExpenseChart data={chartData} />
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-gray-500">No expenses found for this period.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right column - Income/Expense Forms and Lists */}
          <div className="space-y-6">
            {/* Add Income Button */}
            <div className="bg-white rounded-xl shadow p-4">
              <button
                onClick={() => setShowAddIncome(!showAddIncome)}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300"
              >
                {showAddIncome ? 'Cancel' : '+ Add New Income'}
              </button>

              {showAddIncome && (
                <div className="mt-4">
                  <IncomeForm onSubmit={handleAddIncome} />
                </div>
              )}
            </div>

            {/* Add Expense Button */}
            <div className="bg-white rounded-xl shadow p-4">
              <button
                onClick={() => setShowAddExpense(!showAddExpense)}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300"
              >
                {showAddExpense ? 'Cancel' : '+ Add New Expense'}
              </button>

              {showAddExpense && (
                <div className="mt-4">
                  <ExpenseForm onSubmit={handleAddExpense} />
                </div>
              )}
            </div>

            {/* Recent Incomes */}
            <div className="bg-white rounded-xl shadow p-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                {period.charAt(0).toUpperCase() + period.slice(1)} Incomes
              </h2>

              <IncomeList
                incomes={currentIncomes}
                onDelete={deleteIncome}
                onEdit={editIncome}
                currencySymbol="₹"
                conversionRate={conversionRate}
              />
            </div>

            {/* Recent Expenses */}
            <div className="bg-white rounded-xl shadow p-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                {period.charAt(0).toUpperCase() + period.slice(1)} Expenses
              </h2>

              <ExpenseList
                expenses={currentExpenses}
                onDelete={deleteExpense}
                onEdit={editExpense}
                currencySymbol="₹"
                conversionRate={conversionRate}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
