import React, { useState } from 'react';
import IncomeForm from './IncomeForm';

const IncomeList = ({ incomes = [], onDelete, onEdit, currencySymbol = '₹', conversionRate = 83.5 }) => {
  const [editingId, setEditingId] = useState(null);

  const handleEdit = (income) => {
    if (editingId === income.id) {
      setEditingId(null);
    } else {
      setEditingId(income.id);
    }
  };

  const handleUpdate = (updatedIncome) => {
    onEdit(updatedIncome.id, updatedIncome);
    setEditingId(null);
  };

  if (incomes.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-gray-500">No income entries found for this period.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {incomes.map((income) => (
        <div
          key={income.id}
          className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50"
        >
          {editingId === income.id ? (
            <IncomeForm
              onSubmit={handleUpdate}
              initialValues={income}
              isEditing={true}
            />
          ) : (
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">{income.description}</h3>
                  <p className="text-xs text-gray-500">{income.category}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(income.date).toLocaleDateString()}
                  </p>
                </div>
                <p className="text-sm font-semibold text-green-600">
                  +{currencySymbol}{(income.amount * conversionRate).toFixed(2)}
                </p>
              </div>

              <div className="mt-2 flex space-x-2 justify-end">
                <button
                  onClick={() => handleEdit(income)}
                  className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 py-1 px-2 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(income.id)}
                  className="text-xs bg-red-100 hover:bg-red-200 text-red-700 py-1 px-2 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default IncomeList;
