import { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';

// Create the expense context
export const ExpenseContext = createContext();

// Create a custom hook to use the expense context
export const useExpenses = () => {
  return useContext(ExpenseContext);
};

export const ExpenseProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  
  // Load expenses and incomes from localStorage when the component mounts or user changes
  useEffect(() => {
    const loadData = () => {
      if (!currentUser) {
        setExpenses([]);
        setIncomes([]);
        setLoading(false);
        return;
      }
      
      const storedExpenses = localStorage.getItem(`expenses-${currentUser.id}`);
      if (storedExpenses) {
        setExpenses(JSON.parse(storedExpenses));
      } else {
        setExpenses([]);
      }
      
      const storedIncomes = localStorage.getItem(`incomes-${currentUser.id}`);
      if (storedIncomes) {
        setIncomes(JSON.parse(storedIncomes));
      } else {
        setIncomes([]);
      }
      setLoading(false);
    };
    
    loadData();
  }, [currentUser]);
  
  // Save expenses to localStorage whenever they change
  useEffect(() => {
    if (currentUser && !loading) {
      localStorage.setItem(`expenses-${currentUser.id}`, JSON.stringify(expenses));
    }
  }, [expenses, currentUser, loading]);
  
  // Save incomes to localStorage whenever they change
  useEffect(() => {
    if (currentUser && !loading) {
      localStorage.setItem(`incomes-${currentUser.id}`, JSON.stringify(incomes));
    }
  }, [incomes, currentUser, loading]);
  
  // Add a new expense
  const addExpense = (expense) => {
    const newExpense = {
      ...expense,
      id: Date.now().toString(),
      date: new Date().toISOString(),
      userId: currentUser.id
    };
    setExpenses([...expenses, newExpense]);
    return newExpense;
  };
  
  // Delete an expense
  const deleteExpense = (id) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };
  
  // Edit an expense
  const editExpense = (id, updatedExpense) => {
    setExpenses(expenses.map(expense => 
      expense.id === id ? { ...expense, ...updatedExpense } : expense
    ));
  };
  
  // Add a new income
  const addIncome = (income) => {
    const newIncome = {
      ...income,
      id: Date.now().toString(),
      date: new Date().toISOString(),
      userId: currentUser.id
    };
    setIncomes([...incomes, newIncome]);
    return newIncome;
  };
  
  // Delete an income
  const deleteIncome = (id) => {
    setIncomes(incomes.filter(income => income.id !== id));
  };
  
  // Edit an income
  const editIncome = (id, updatedIncome) => {
    setIncomes(incomes.map(income => 
      income.id === id ? { ...income, ...updatedIncome } : income
    ));
  };
  
  // Get expenses for different periods
  const getDailyExpenses = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= today;
    });
  };
  
  const getWeeklyExpenses = () => {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);
    
    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= weekStart;
    });
  };
  
  const getMonthlyExpenses = () => {
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    
    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= monthStart;
    });
  };
  
  // Get incomes for different periods
  const getDailyIncomes = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return incomes.filter(income => {
      const incomeDate = new Date(income.date);
      return incomeDate >= today;
    });
  };
  
  const getWeeklyIncomes = () => {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);
    
    return incomes.filter(income => {
      const incomeDate = new Date(income.date);
      return incomeDate >= weekStart;
    });
  };
  
  const getMonthlyIncomes = () => {
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    
    return incomes.filter(income => {
      const incomeDate = new Date(income.date);
      return incomeDate >= monthStart;
    });
  };
  
  // Calculate totals
  const calculateTotalIncome = (period = 'all') => {
    let incomesToCalculate;
    
    switch (period) {
      case 'daily':
        incomesToCalculate = getDailyIncomes();
        break;
      case 'weekly':
        incomesToCalculate = getWeeklyIncomes();
        break;
      case 'monthly':
        incomesToCalculate = getMonthlyIncomes();
        break;
      default:
        incomesToCalculate = incomes;
    }
    
    return incomesToCalculate.reduce((total, income) => total + income.amount, 0);
  };
  
  const value = {
    expenses,
    incomes,
    addExpense,
    deleteExpense,
    editExpense,
    addIncome,
    deleteIncome,
    editIncome,
    getDailyExpenses,
    getWeeklyExpenses,
    getMonthlyExpenses,
    getDailyIncomes,
    getWeeklyIncomes,
    getMonthlyIncomes,
    calculateTotalIncome,
    loading
  };
  
  return (
    <ExpenseContext.Provider value={value}>
      {!loading && children}
    </ExpenseContext.Provider>
  );
};