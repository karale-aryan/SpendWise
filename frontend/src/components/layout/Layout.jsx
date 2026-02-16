import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import AIChatWidget from '../common/AIChatWidget';

const Layout = () => {
    return (
        <div className="flex h-screen bg-gray-50 dark:bg-dark-bg transition-colors duration-300">
            {/* Sidebar */}
            <div className="w-64 flex-shrink-0 hidden md:block z-20 shadow-xl shadow-gray-200/50 dark:shadow-none">
                <Sidebar />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden relative">
                <Navbar />
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 md:p-8 relative scroll-smooth">
                    <Outlet />
                </main>

                {/* AI Chat Widget */}
                <AIChatWidget />
            </div>
        </div>
    );
};

export default Layout;
