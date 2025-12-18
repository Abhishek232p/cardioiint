
import React from 'react';
import { APP_NAME } from '../constants';

interface NavbarProps {
  username?: string;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ username, onLogout }) => {
  return (
    <nav className="bg-white border-b border-gray-200 fixed w-full z-30 top-0">
      <div className="px-4 py-3 lg:px-6 flex items-center justify-between">
        <div className="flex items-center justify-start">
          <div className="flex items-center text-red-600 font-bold text-2xl mr-4">
            <svg className="w-8 h-8 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
            </svg>
            {APP_NAME}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-700 hidden sm:inline-block">Welcome, <span className="text-gray-900 font-bold">{username}</span></span>
          <button 
            onClick={onLogout}
            className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 text-center"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
