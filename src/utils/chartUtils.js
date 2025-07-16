// Helper function to group expenses by category
export const groupExpensesByCategory = (expenses) => {
  return expenses.reduce((acc, expense) => {
    const category = expense.category || 'Other';
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += parseFloat(expense.amount);
    return acc;
  }, {});
};

// Format expenses for charts (pie chart, donut chart)
export const formatExpensesForChart = (expenses) => {
  const groupedExpenses = groupExpensesByCategory(expenses);
  
  // Convert to array of objects for chart libraries
  const chartData = Object.keys(groupedExpenses).map(category => ({
    category,
    amount: groupedExpenses[category],
    color: getCategoryColor(category)
  }));
  
  return chartData;
};

// Get a consistent color for each expense category
export const getCategoryColor = (category) => {
  const colorMap = {
    'Food': '#FF6384',
    'Transportation': '#36A2EB',
    'Housing': '#FFCE56',
    'Utilities': '#4BC0C0',
    'Entertainment': '#9966FF',
    'Healthcare': '#FF9F40',
    'Shopping': '#8AC926',
    'Education': '#1982C4',
    'Personal': '#6A4C93',
    'Other': '#C9CBA3'
  };
  
  return colorMap[category] || '#808080'; // Default gray for unknown categories
};

// Format date to readable string
export const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

// Calculate total of expenses
export const calculateTotal = (expenses) => {
  return expenses.reduce((total, expense) => total + parseFloat(expense.amount), 0).toFixed(2);
};