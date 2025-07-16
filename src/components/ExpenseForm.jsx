import React, { useState, useEffect } from 'react';

const ExpenseForm = ({ onSubmit, initialValues = {}, isEditing = false }) => {
  const [description, setDescription] = useState(initialValues.description || '');
  const [amount, setAmount] = useState(initialValues.amount || '');
  const [category, setCategory] = useState(initialValues.category || 'Food');
  const [isListening, setIsListening] = useState(false);
  const [voiceInputField, setVoiceInputField] = useState(null);
  
  // SpeechRecognition setup
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;
  
  useEffect(() => {
    if (recognition) {
      recognition.continuous = false;
      recognition.lang = 'en-US';
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        
        // Determine which field to update based on current focus
        if (voiceInputField === 'description') {
          setDescription(transcript);
        } else if (voiceInputField === 'amount') {
          // Try to extract a number from the transcript
          const numberMatch = transcript.match(/\d+(\.\d+)?/);
          if (numberMatch) {
            setAmount(numberMatch[0]);
          }
        }
        
        setIsListening(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
    }
  }, [recognition, voiceInputField]);
  
  const categories = [
    'Food', 
    'Transportation', 
    'Housing', 
    'Utilities', 
    'Entertainment', 
    'Healthcare', 
    'Shopping', 
    'Education', 
    'Personal', 
    'Other'
  ];
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!description || !amount) return;
    
    onSubmit({
      description,
      amount: parseFloat(amount),
      category
    });
    
    // Reset form if not editing
    if (!isEditing) {
      setDescription('');
      setAmount('');
      setCategory('Food');
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <div className="flex">
          <input
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-l-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="What did you spend on?"
            required
          />
          <button
            type="button"
            onClick={() => {
              if (recognition) {
                setVoiceInputField('description');
                setIsListening(true);
                recognition.start();
              } else {
                alert('Speech recognition is not supported in your browser.');
              }
            }}
            className={`px-3 rounded-r-lg border-y border-r border-gray-300 
              ${isListening && voiceInputField === 'description' 
                ? 'bg-red-100 text-red-600' 
                : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
          >
            {isListening && voiceInputField === 'description' 
              ? <span className="animate-pulse">●</span> 
              : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                </svg>
            }
          </button>
        </div>
      </div>
      
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
          Amount ($)
        </label>
        <div className="flex">
          <input
            id="amount"
            type="number"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-l-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="0.00"
            required
          />
          <button
            type="button"
            onClick={() => {
              if (recognition) {
                setVoiceInputField('amount');
                setIsListening(true);
                recognition.start();
              } else {
                alert('Speech recognition is not supported in your browser.');
              }
            }}
            className={`px-3 rounded-r-lg border-y border-r border-gray-300 
              ${isListening && voiceInputField === 'amount' 
                ? 'bg-red-100 text-red-600' 
                : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
          >
            {isListening && voiceInputField === 'amount' 
              ? <span className="animate-pulse">●</span> 
              : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                </svg>
            }
          </button>
        </div>
      </div>
      
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
          Category
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
      
      <div>
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300"
        >
          {isEditing ? 'Update Expense' : 'Add Expense'}
        </button>
      </div>
    </form>
  );
};

export default ExpenseForm;