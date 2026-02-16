import React, { useState, useEffect } from 'react';
import { budgetAPI } from '../services/api';
import { Target, AlertTriangle, CheckCircle, Save, Loader2, Trash2, IndianRupee } from 'lucide-react';
import clsx from 'clsx';

const Budget = () => {
    const [budgetData, setBudgetData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [newLimit, setNewLimit] = useState('');

    const fetchBudget = async () => {
        try {
            const response = await budgetAPI.getCurrent();
            setBudgetData(response.data);
            setNewLimit(response.data.monthlyLimit);
        } catch (error) {
            console.error("Failed to fetch budget", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBudget();
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setUpdating(true);
        try {
            await budgetAPI.set({ monthlyLimit: parseFloat(newLimit) });
            await fetchBudget(); // Refresh data
        } catch (error) {
            console.error("Failed to update budget", error);
        } finally {
            setUpdating(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this monthly budget? This will remove your spending limits for the current month.')) {
            setUpdating(true);
            try {
                await budgetAPI.delete(budgetData.month, budgetData.year);
                setBudgetData(null);
                setNewLimit('');
                // Optionally reload to show "No Budget Set" state or just clear
                window.location.reload();
            } catch (err) {
                console.error('Failed to delete budget', err);
                setUpdating(false);
            }
        }
    };

    if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-primary" /></div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Budget Management</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Set and track your monthly spending limits.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Budget Status Card */}
                <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-primary/10 text-primary rounded-xl">
                            <Target size={32} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Current Status</h2>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">Month of {new Date().toLocaleString('default', { month: 'long' })}</p>
                        </div>
                    </div>

                    {budgetData ? (
                        <div className="space-y-6">
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Spent</p>
                                    <p className="text-3xl font-bold text-gray-900 dark:text-white">₹{budgetData.totalSpent?.toFixed(2) || '0.00'}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Budget Limit</p>
                                    <p className="text-xl font-semibold text-gray-700 dark:text-gray-300">₹{budgetData.monthlyLimit?.toFixed(2) || '0.00'}</p>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm font-medium">
                                    <span>Progress</span>
                                    <span className={clsx(budgetData.exceeded ? 'text-red-500' : 'text-primary')}>
                                        {budgetData.usagePercentage?.toFixed(1) || '0.0'}%
                                    </span>
                                </div>
                                <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className={clsx(
                                            "h-full rounded-full transition-all duration-500",
                                            budgetData.exceeded ? "bg-red-500" : "bg-primary"
                                        )}
                                        style={{ width: `${Math.min(budgetData.usagePercentage || 0, 100)}%` }}
                                    ></div>
                                </div>
                            </div>

                            {/* Alerts */}
                            {budgetData.exceeded ? (
                                <div className="flex items-start gap-3 p-4 bg-red-50 text-red-700 rounded-xl border border-red-100">
                                    <AlertTriangle className="shrink-0 mt-0.5" size={20} />
                                    <div>
                                        <p className="font-semibold">Budget Exceeded!</p>
                                        <p className="text-sm opacity-90">You have overspent by ₹{Math.abs(budgetData.remainingAmount).toFixed(2)} this month.</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-start gap-3 p-4 bg-green-50 text-green-700 rounded-xl border border-green-100">
                                    <CheckCircle className="shrink-0 mt-0.5" size={20} />
                                    <div>
                                        <p className="font-semibold">On Track</p>
                                        <p className="text-sm opacity-90">You have ₹{budgetData.remainingAmount?.toFixed(2)} remaining for this month.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="py-10 text-center text-gray-500">
                            <p>No budget set for this month.</p>
                            <p className="text-sm mt-2">Set a limit to start tracking.</p>
                        </div>
                    )}
                </div>

                {/* Update Form */}
                <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 h-fit transition-colors duration-300">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">{budgetData ? 'Update Monthly Budget' : 'Set Monthly Budget'}</h2>
                    <form onSubmit={handleUpdate} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Monthly Limit</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    <IndianRupee size={20} />
                                </div>
                                <input
                                    type="number"
                                    step="0.01"
                                    required
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all text-lg font-semibold text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                                    value={newLimit}
                                    placeholder="e.g. 5000"
                                    onChange={(e) => setNewLimit(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-xl text-blue-700 text-sm border border-blue-100">
                            <p>Changing your budget will update your financial health score and analytics immediately.</p>
                        </div>

                        <div className="flex gap-4">
                            <button
                                type="submit"
                                disabled={updating}
                                className="flex-1 bg-primary hover:bg-primary-light text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                            >
                                {updating ? <Loader2 className="animate-spin" size={20} /> : (
                                    <>
                                        <Save size={20} />
                                        Save
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    {budgetData && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={updating}
                                className="w-full text-red-500 hover:text-red-700 hover:bg-red-50 font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                <Trash2 size={18} />
                                <span>Delete Monthly Budget</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Budget;
