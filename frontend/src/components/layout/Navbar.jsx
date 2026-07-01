import React from 'react';
import { Search, Bell, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
    const { user } = useAuth();

    return (
        <header className="h-20 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between px-8 ml-64 sticky top-0 z-10 transition-colors duration-300">
            <div className="flex items-center gap-4 w-96">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search transactions..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 focus:outline-none text-sm"
                    />
                </div>
            </div>

            <div className="flex items-center gap-6">
                <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <Bell size={24} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{user?.username || 'User'}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Free Plan</p>
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-tr from-primary to-accent rounded-full flex items-center justify-center text-white font-bold shadow-md">
                        {user?.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
