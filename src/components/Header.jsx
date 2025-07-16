import React from 'react';
import { Link } from 'react-router-dom';

const Header = ({ onSignOut, userName }) => {
  return (
    <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-10">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/dashboard" className="text-xl font-bold text-indigo-600">
            ExpenseTracker
          </Link>
          
          <div className="flex items-center gap-4">
            <span className="text-gray-700">
              Hello, {userName || 'User'}
            </span>
            <Link
              to="/profile"
              className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-4 py-1.5 rounded-lg text-sm font-medium transition duration-300"
            >
              Profile
            </Link>
            <button
              onClick={onSignOut}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-1.5 rounded-lg text-sm font-medium transition duration-300"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;