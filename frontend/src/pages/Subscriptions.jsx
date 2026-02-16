import React, { useEffect, useState } from 'react';
import { recurringExpenseAPI } from '../services/api';
import { Plus, Trash2, Calendar, DollarSign, RefreshCw, Loader2, X } from 'lucide-react';

const Subscriptions = () => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        description: '',
        amount: '',
        category: 'Subscription',
        frequency: 'MONTHLY',
        startDate: new Date().toISOString().split('T')[0],
        nextDueDate: new Date().toISOString().split('T')[0]
    });

    const fetchSubscriptions = async () => {
        try {
            const response = await recurringExpenseAPI.getAll();
            setSubscriptions(response.data);
        } catch (error) {
            console.error("Failed to fetch subscriptions", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubscriptions();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to cancel this subscription?')) {
            try {
                await recurringExpenseAPI.delete(id);
                setSubscriptions(prev => prev.filter(sub => sub.id !== id));
            } catch (error) {
                console.error("Failed to delete subscription", error);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await recurringExpenseAPI.add(formData);
            setIsModalOpen(false);
            setFormData({
                description: '',
                amount: '',
                category: 'Subscription',
                frequency: 'MONTHLY',
                startDate: new Date().toISOString().split('T')[0],
                nextDueDate: new Date().toISOString().split('T')[0]
            });
            fetchSubscriptions();
        } catch (error) {
            console.error("Failed to add subscription", error);
        }
    };

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="animate-spin text-primary" size={48} />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Subscriptions</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your recurring expenses.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-primary hover:bg-primary-light text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-primary/30 transition-all flex items-center gap-2"
                >
                    <Plus size={20} />
                    Add New
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subscriptions.length > 0 ? (
                    subscriptions.map((sub) => (
                        <div key={sub.id} className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300 relative group">
                            <button
                                onClick={() => handleDelete(sub.id)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                            >
                                <Trash2 size={20} />
                            </button>

                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-xl">
                                    <RefreshCw size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white text-lg">{sub.description}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{sub.category}</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500 dark:text-gray-400">Amount</span>
                                    <span className="font-bold text-gray-900 dark:text-white text-lg">₹{sub.amount.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500 dark:text-gray-400">Frequency</span>
                                    <span className="font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-lg text-xs">
                                        {sub.frequency}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500 dark:text-gray-400">Next Due</span>
                                    <span className="font-medium text-gray-700 dark:text-gray-300">
                                        {new Date(sub.nextDueDate).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-12 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700">
                        <RefreshCw size={48} className="mx-auto mb-4 opacity-50" />
                        <p>No subscriptions found. Add one to get started!</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Add Subscription</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none dark:text-white"
                                    placeholder="Netflix, Spotify, etc."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">₹</span>
                                        <input
                                            type="number"
                                            step="0.01"
                                            required
                                            className="w-full pl-8 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none dark:text-white"
                                            placeholder="0.00"
                                            value={formData.amount}
                                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Frequency</label>
                                    <select
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none dark:text-white"
                                        value={formData.frequency}
                                        onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                                    >
                                        <option value="WEEKLY">Weekly</option>
                                        <option value="MONTHLY">Monthly</option>
                                        <option value="YEARLY">Yearly</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
                                    <input
                                        type="date"
                                        required
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none dark:text-white"
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Next Due</label>
                                    <input
                                        type="date"
                                        required
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none dark:text-white"
                                        value={formData.nextDueDate}
                                        onChange={(e) => setFormData({ ...formData, nextDueDate: e.target.value })}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-primary hover:bg-primary-light text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary/30 transition-all mt-4"
                            >
                                Save Subscription
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Subscriptions;
