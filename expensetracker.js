const form = document.getElementById('expense-form');
const expenseList = document.getElementById('filtered-list');
const filteredTotal = document.getElementById('filtered-total');
const filterBtn = document.getElementById('filter-btn');

let expenses = [];

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('expense-name').value;
  const amount = parseFloat(document.getElementById('expense-amount').value);
  const date = document.getElementById('expense-date').value;

  if (!name || isNaN(amount) || amount <= 0 || !date) {
    alert('Please enter valid values');
    return;
  }

  expenses.push({ name, amount, date });

  form.reset();
  alert('Expense added!');
});

filterBtn.addEventListener('click', function () {
  const startDate = document.getElementById('start-date').value;
  const endDate = document.getElementById('end-date').value;

  if (!startDate || !endDate) {
    alert('Please select both start and end dates');
    return;
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  end.setHours(23, 59, 59); // Include full end date

  const filteredExpenses = expenses.filter(exp => {
    const expenseDate = new Date(exp.date);
    return expenseDate >= start && expenseDate <= end;
  });

  // Display filtered expenses
  expenseList.innerHTML = '';
  let total = 0;

  filteredExpenses.forEach(exp => {
    const li = document.createElement('li');
    li.textContent = `${exp.date} - ${exp.name}: ₹${exp.amount.toFixed(2)}`;
    expenseList.appendChild(li);
    total += exp.amount;
  });

  filteredTotal.textContent = total.toFixed(2);
});
