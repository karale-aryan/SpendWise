import React, { useState, useEffect } from 'react';
import { expenseAPI } from '../services/api';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, IndianRupee, Tag, FileText, Calendar, Loader2, Pencil } from 'lucide-react';

const AddExpense = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        amount: '',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
    });
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEditMode);

    // Common expense categories
    const categories = [
        'Food', 'Transport', 'Utilities', 'Entertainment',
        'Shopping', 'Health', 'Rent', 'Education', 'Other'
    ];

    useEffect(() => {
        if (isEditMode) {
            setFetching(true);
            const fetchExpense = async () => {
                try {
                    const response = await expenseAPI.getAll(); // Assuming no getById yet, filtering from all
                    const expense = response.data.find(e => e.id === parseInt(id));
                    if (expense) {
                        setFormData({
                            amount: expense.amount,
                            category: expense.category,
                            description: expense.description,
                            date: expense.date
                        });
                    } else {
                        // Handle not found (maybe redirect)
                        console.error("Expense not found");
                    }
                } catch (error) {
                    console.error("Failed to fetch expense details", error);
                } finally {
                    setFetching(false);
                }
            };
            fetchExpense();
        } else {
            // Reset form when switching to Add mode
            setFormData({
                amount: '',
                category: '',
                description: '',
                date: new Date().toISOString().split('T')[0]
            });
            setFetching(false);
        }
    }, [id, isEditMode]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                ...formData,
                amount: parseFloat(formData.amount)
            };

            if (isEditMode) {
                await expenseAPI.update(id, payload);
            } else {
                await expenseAPI.create(payload);
            }
            navigate('/');
        } catch (error) {
            console.error("Failed to save expense", error);
            // Could add toast notification here
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="animate-spin text-primary" size={32} />
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{isEditMode ? 'Edit Expense' : 'Add New Expense'}</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">{isEditMode ? 'Update your transaction details' : 'Keep track of your spending habits.'}</p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Amount */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Amount</label>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                <IndianRupee size={20} />
                            </div>
                            <input
                                type="number"
                                step="0.01"
                                required
                                className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all text-lg font-semibold text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                                placeholder="0.00"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    <Tag size={20} />
                                </div>
                                <select
                                    required
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all appearance-none text-gray-900 dark:text-white"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                >
                                    <option value="" disabled>Select category</option>
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    <Calendar size={20} />
                                </div>
                                <input
                                    type="date"
                                    required
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all text-gray-900 dark:text-white"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                        <div className="relative">
                            <div className="absolute left-4 top-4 text-gray-400">
                                <FileText size={20} />
                            </div>
                            <textarea
                                required
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all min-h-[120px] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                                placeholder="What was this expense for?"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary hover:bg-primary-light text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : (
                                <>
                                    {isEditMode ? <Pencil size={20} /> : <Plus size={24} />}
                                    {isEditMode ? 'Update Expense' : 'Save Expense'}
                                </>
                            )}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default AddExpense;
