import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Wallet, PieChart, LogOut, Moon, Sun, Settings, Calendar, Target, CreditCard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import clsx from 'clsx';

const Sidebar = () => {
    const { logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
        { icon: Wallet, label: 'Budget', path: '/budget' },
        { icon: CreditCard, label: 'Add Expense', path: '/add-expense' },
        { icon: Calendar, label: 'Subscriptions', path: '/subscriptions' },
        { icon: Target, label: 'Goals', path: '/goals' },
        { icon: PieChart, label: 'Analytics', path: '/analytics' },
    ];

    return (
        <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-100 dark:border-gray-700 flex flex-col h-screen fixed left-0 top-0 z-10 hidden md:flex transition-colors duration-300">
            <div className="p-6">
                <div className="flex items-center gap-2 text-primary dark:text-primary-accent font-bold text-2xl">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
                        S
                    </div>
                    SpendWise
                </div>
            </div>

            <nav className="flex-1 px-4 space-y-2 mt-4">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            clsx(
                                'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium',
                                isActive
                                    ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-accent'
                                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200'
                            )
                        }
                    >
                        <item.icon size={20} />
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-gray-100 dark:border-gray-700 space-y-2">
                <button
                    onClick={toggleTheme}
                    className="flex items-center gap-3 px-4 py-3 w-full text-left text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-all"
                >
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </button>

                <NavLink
                    to="/settings"
                    className={({ isActive }) => clsx(
                        "flex items-center gap-3 px-4 py-3 w-full text-left rounded-xl transition-all",
                        isActive
                            ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                            : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                    )}
                >
                    <Settings size={20} />
                    Settings
                </NavLink>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                >
                    <LogOut size={20} />
                    Logout
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
