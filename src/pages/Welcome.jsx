import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Welcome = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // If user is already logged in, redirect to dashboard
  React.useEffect(() => {
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full animate-in fade-in duration-700">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-600 mb-2">Welcome to ExpenseTracker</h1>
          <p className="text-gray-600">Take control of your finances with our simple expense tracking solution.</p>
        </div>
        
        <div className="space-y-4">
          <div className="bg-indigo-50 p-4 rounded-lg">
            <h2 className="text-lg font-medium text-indigo-700 mb-2">Track Your Expenses</h2>
            <p className="text-sm text-gray-600">Log and categorize your expenses to understand your spending habits.</p>
          </div>
          
          <div className="bg-indigo-50 p-4 rounded-lg">
            <h2 className="text-lg font-medium text-indigo-700 mb-2">Visualize Your Data</h2>
            <p className="text-sm text-gray-600">See charts and graphs of your daily, weekly, and monthly expenses.</p>
          </div>
          
          <div className="bg-indigo-50 p-4 rounded-lg">
            <h2 className="text-lg font-medium text-indigo-700 mb-2">Make Better Decisions</h2>
            <p className="text-sm text-gray-600">Use insights to make informed financial decisions and save money.</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <button 
            onClick={() => navigate('/signin')}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300"
          >
            Sign In
          </button>
          <button 
            onClick={() => navigate('/signup')}
            className="flex-1 bg-white hover:bg-gray-50 text-indigo-600 font-medium py-2 px-4 rounded-lg border border-indigo-600 transition duration-300"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;