import React, { useEffect, useState } from 'react';
import { dashboardAPI, aiAPI, expenseAPI } from '../services/api';
import SummaryCard from '../components/common/SummaryCard';
import { Wallet, TrendingDown, Target, Activity, Brain, Plus, ArrowRight, Trash2, Pencil } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [data, setData] = useState(null);
    const [aiAnalysis, setAiAnalysis] = useState(null);
    const [recentExpenses, setRecentExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [aiLoading, setAiLoading] = useState(false);
    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            const [dashboardRes, expensesRes] = await Promise.all([
                dashboardAPI.get(),
                expenseAPI.getAll()
            ]);
            setData(dashboardRes.data);

            // Process recent expenses
            const sorted = expensesRes.data.sort((a, b) => new Date(b.date) - new Date(a.date));
            setRecentExpenses(sorted.slice(0, 5));

        } catch (error) {
            console.error("Error fetching dashboard data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchAIAnalysis = async () => {
        setAiLoading(true);
        try {
            const response = await aiAPI.analyze();
            setAiAnalysis(response.data);
        } catch (error) {
            console.error("AI Analysis failed", error);
        } finally {
            setAiLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this expense?")) {
            try {
                await expenseAPI.delete(id);
                // Refresh data
                fetchData();
            } catch (error) {
                console.error("Failed to delete expense", error);
            }
        }
    };

    if (loading) {
        return (
            <div className="flex h-[calc(100vh-100px)] items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    // Charts Data Preparation
    const categoryData = data?.categoryBreakdown
        ? Object.entries(data.categoryBreakdown).map(([name, value]) => ({ name, value }))
        : [];

    const COLORS = ['#1B4332', '#2D6A4F', '#40916C', '#52B788', '#74C69D', '#95D5B2'];

    // Dummy monthly data for demo
    const monthlyData = [
        { name: 'Jan', amount: 1200 },
        { name: 'Feb', amount: data?.totalMonthlySpending || 0 },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Financial Overview</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Track your spending and save more.</p>
                </div>
                <Link to="/add-expense" className="bg-primary hover:bg-primary-light text-white px-5 py-2.5 rounded-xl shadow-lg shadow-primary/20 flex items-center gap-2 transition-all">
                    <Plus size={20} />
                    Add Expense
                </Link>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <SummaryCard
                    title="Total Monthly Spending"
                    value={`₹${data?.totalMonthlySpending?.toFixed(2) || '0.00'}`}
                    icon={TrendingDown}
                    color="primary"
                />
                <SummaryCard
                    title="Monthly Budget"
                    value={`₹${data?.monthlyBudget?.toFixed(2) || '0.00'}`}
                    icon={Target}
                    color="secondary"
                />
                <SummaryCard
                    title="Remaining Budget"
                    value={`₹${data?.remainingAmount?.toFixed(2) || '0.00'}`}
                    icon={Wallet}
                    color={data?.remainingAmount < 0 ? 'red' : 'accent'}
                />
                <SummaryCard
                    title="Financial Health Score"
                    value={`${data?.financialHealthScore || 0}/100`}
                    icon={Activity}
                    color="blue"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Charts Column */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Main Chart */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Spending Analysis</h3>
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={monthlyData}>
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                    <YAxis axisLine={false} tickLine={false} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Bar dataKey="amount" fill="#1B4332" radius={[4, 4, 0, 0]} barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Recent Transactions */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Recent Transactions</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left text-sm text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-gray-700">
                                        <th className="pb-3 font-medium">Description</th>
                                        <th className="pb-3 font-medium">Category</th>
                                        <th className="pb-3 font-medium">Date</th>
                                        <th className="pb-3 font-medium text-right">Amount</th>
                                        <th className="pb-3 font-medium text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {recentExpenses.length > 0 ? recentExpenses.map((expense) => (
                                        <tr key={expense.id} className="group border-b border-gray-50 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                                            <td className="py-4 font-medium text-gray-900 dark:text-white">{expense.description}</td>
                                            <td className="py-4 text-gray-500 dark:text-gray-400">
                                                <span className="px-2.5 py-1 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg text-xs font-medium border border-gray-100 dark:border-gray-600">
                                                    {expense.category}
                                                </span>
                                            </td>
                                            <td className="py-4 text-gray-500 dark:text-gray-400 text-sm">{expense.date}</td>
                                            <td className="py-4 text-gray-900 dark:text-white font-bold text-right group-hover:text-primary transition-colors">
                                                ₹{expense.amount.toFixed(2)}
                                            </td>
                                            <td className="py-4 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => navigate(`/edit-expense/${expense.id}`)}
                                                        className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Pencil size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(expense.id)}
                                                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="5" className="text-center py-8 text-gray-400">No recent transactions</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar Column */}
                <div className="space-y-8">
                    {/* AI Advisor Card */}
                    <div className="relative overflow-hidden bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-sm border-2 border-primary/10">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Brain size={120} />
                        </div>
                        <div className="flex items-center gap-3 mb-4 text-primary">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Brain size={24} />
                            </div>
                            <h3 className="font-bold text-lg">AI Financial Advisor</h3>
                        </div>

                        {!aiAnalysis ? (
                            <div className="text-center py-6">
                                <p className="text-gray-500 mb-4 text-sm">Get personalized insights and spending recommendations powered by AI.</p>
                                <button
                                    onClick={fetchAIAnalysis}
                                    disabled={aiLoading}
                                    className="w-full bg-white border border-gray-200 hover:border-primary text-gray-700 hover:text-primary font-medium py-2.5 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
                                >
                                    {aiLoading ? <span className="animate-pulse">Analyzing...</span> : 'Analyze My Spending'}
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4 relative z-10">
                                <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-100">
                                    <p className="text-sm text-gray-600 italic">"{aiAnalysis.summary}"</p>
                                </div>

                                <div>
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Recommendations</p>
                                    <ul className="space-y-2">
                                        {aiAnalysis.recommendations.map((rec, idx) => (
                                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                                                <ArrowRight size={14} className="mt-1 text-primary shrink-0" />
                                                {rec}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {aiAnalysis.nextMonthPrediction && (
                                    <div className="pt-4 border-t border-gray-100">
                                        <p className="text-xs text-gray-400 mb-1">Prediction</p>
                                        <p className="text-sm font-medium text-primary">{aiAnalysis.nextMonthPrediction}</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Category Breakdown */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-6">Spending by Category</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={categoryData}
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {categoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-4">
                            {categoryData.map((entry, index) => (
                                <div key={index} className="flex items-center gap-2 text-xs text-gray-600">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                    <span className="truncate">{entry.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
