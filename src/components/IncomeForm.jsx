import React, { useState } from 'react';

const INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Investment',
  'Gift',
  'Refund',
  'Other'
];

const IncomeForm = ({ onSubmit, initialValues = null, isEditing = false }) => {
  const [description, setDescription] = useState(initialValues?.description || '');
  const [amount, setAmount] = useState(initialValues?.amount || '');
  const [category, setCategory] = useState(initialValues?.category || INCOME_CATEGORIES[0]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!description || !amount) {
      alert('Please fill in all fields');
      return;
    }
    
    // Create income object
    const incomeData = {
      description,
      amount: parseFloat(amount),
      category,
      ...(initialValues && { id: initialValues.id }),
      ...(initialValues && { date: initialValues.date })
    };
    
    // Submit the income
    onSubmit(incomeData);
    
    // Reset form if not editing
    if (!isEditing) {
      setDescription('');
      setAmount('');
      setCategory(INCOME_CATEGORIES[0]);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <input
          type="text"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          placeholder="Income description"
        />
      </div>
      
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
          Amount
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">$</span>
          </div>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="block w-full pl-7 pr-12 rounded-md border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            placeholder="0.00"
            min="0"
            step="0.01"
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          {INCOME_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
      
      <div>
        <button
          type="submit"
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          {isEditing ? 'Update' : 'Add'} Income
        </button>
      </div>
    </form>
  );
};

export default IncomeForm;