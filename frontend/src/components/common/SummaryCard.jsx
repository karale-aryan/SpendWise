import React from 'react';
import clsx from 'clsx';

const SummaryCard = ({ title, value, icon: Icon, trend, trendValue, color = 'primary' }) => {
    const colorStyles = {
        primary: 'bg-primary/10 text-primary',
        secondary: 'bg-secondary/10 text-secondary',
        accent: 'bg-accent/10 text-green-600',
        red: 'bg-red-50 text-red-600',
        blue: 'bg-blue-50 text-blue-600',
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-all hover:shadow-md duration-300">
            <div className="flex justify-between items-start mb-4">
                <div className={clsx('p-3 rounded-xl', colorStyles[color])}>
                    <Icon size={24} />
                </div>
                {trend && (
                    <div className={clsx(
                        'flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full',
                        trend === 'up' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                    )}>
                        <span>{trend === 'up' ? '+' : ''}{trendValue}</span>
                    </div>
                )}
            </div>
            <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{value}</h3>
            </div>
        </div>
    );
};

export default SummaryCard;
