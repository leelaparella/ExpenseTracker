import React, { useState } from 'react';
import { formatDate } from '../utils/chartUtils';
import ExpenseForm from './ExpenseForm';

const ExpenseList = ({ expenses, onDelete, onEdit, currencySymbol = '₹', conversionRate = 83.5 }) => {
  const [editingId, setEditingId] = useState(null);

  const handleEdit = (expense) => {
    setEditingId(expense.id);
  };

  const handleUpdate = (updatedValues) => {
    onEdit(editingId, updatedValues);
    setEditingId(null);
  };

  if (expenses.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-gray-500">No expenses recorded yet.</p>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto max-h-96">
      <ul className="space-y-3">
        {expenses.map((expense) => (
          <li key={expense.id} className="border-b border-gray-100 pb-3 last:border-0">
            {editingId === expense.id ? (
              <ExpenseForm
                initialValues={expense}
                onSubmit={handleUpdate}
                isEditing={true}
              />
            ) : (
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-800">{expense.description}</p>
                  <div className="flex items-center mt-1">
                    <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-md mr-2">
                      {expense.category}
                    </span>
                    <span className="text-xs text-gray-500">{formatDate(expense.date)}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="font-bold text-indigo-600">
                    {currencySymbol}
                    {(parseFloat(expense.amount) * conversionRate).toFixed(2)}
                  </span>
                  <div className="flex space-x-1 mt-1">
                    <button
                      onClick={() => handleEdit(expense)}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(expense.id)}
                      className="text-xs text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExpenseList;
