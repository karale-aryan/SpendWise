import React, { useEffect, useState } from 'react';
import { analyticsAPI } from '../services/api';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import { Loader2, TrendingUp, TrendingDown, IndianRupee, PieChart as PieChartIcon } from 'lucide-react';

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#6366F1'];

const Analytics = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await analyticsAPI.get();
                setData(response.data);
            } catch (err) {
                console.error("Failed to fetch analytics", err);
                setError("Failed to load analytics data.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="animate-spin text-primary" size={48} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 text-center bg-red-50 dark:bg-red-900/10 rounded-3xl border border-red-100 dark:border-red-900/20">
                <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
            </div>
        );
    }

    if (!data) return null;

    // Transform Monthly Trend Map to Array for Recharts
    const trendData = Object.entries(data.monthlyTrend).map(([name, amount]) => ({
        name,
        amount
    })).reverse(); // API returns descending order, charts usually left-to-right ascending

    // Transform Category Breakdown Map to Array
    const categoryData = Object.entries(data.categoryBreakdown).map(([name, value]) => ({
        name,
        value
    }));

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Financial Analytics</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Deep dive into your spending habits.</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Spent (Last 6 Months)</p>
                            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                                ₹{data.totalSpent?.toLocaleString()}
                            </h3>
                        </div>
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl">
                            <IndianRupee size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Month-over-Month</p>
                            <div className="flex items-center gap-2 mt-1">
                                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                                    {Math.abs(data.monthOverMonthChange)?.toFixed(1)}%
                                </h3>
                                <span className={`flex items-center text-sm font-medium px-2 py-0.5 rounded-lg ${data.monthOverMonthChange > 0
                                        ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                                        : 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                                    }`}>
                                    {data.monthOverMonthChange > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                                    {data.monthOverMonthChange > 0 ? 'Increase' : 'Decrease'}
                                </span>
                            </div>
                        </div>
                        <div className={`p-3 rounded-xl ${data.monthOverMonthChange > 0
                                ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                                : 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                            }`}>
                            {data.monthOverMonthChange > 0 ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Spending Trend Chart */}
                <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Spending Trend</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trendData}>
                                <defs>
                                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" className="dark:stroke-gray-700" />
                                <XAxis
                                    dataKey="name"
                                    tickLine={false}
                                    axisLine={false}
                                    tick={{ fill: '#6B7280', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis
                                    tickLine={false}
                                    axisLine={false}
                                    tick={{ fill: '#6B7280', fontSize: 12 }}
                                    tickFormatter={(value) => `₹${value / 1000}k`}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                    formatter={(value) => [`₹${value}`, 'Spent']}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="amount"
                                    stroke="#10B981"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorAmount)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Category Distribution Chart */}
                <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Category Breakdown</h3>
                    <div className="h-80 flex items-center justify-center">
                        {categoryData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={categoryData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {categoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                        formatter={(value) => [`₹${value}`, 'Spent']}
                                    />
                                    <Legend
                                        verticalAlign="bottom"
                                        height={36}
                                        iconType="circle"
                                        formatter={(value) => <span className="text-gray-600 dark:text-gray-400 text-sm ml-1">{value}</span>}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="text-center text-gray-400 dark:text-gray-500">
                                <PieChartIcon size={48} className="mx-auto mb-2 opacity-50" />
                                <p>No expense data available</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
