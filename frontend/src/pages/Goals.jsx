import React, { useState, useEffect } from 'react';
import { goalsAPI } from '../services/api';
import { Plus, Trash2, Target, TrendingUp, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Goals = () => {
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        targetAmount: '',
        currentAmount: '',
        deadline: ''
    });

    useEffect(() => {
        fetchGoals();
    }, []);

    const fetchGoals = async () => {
        try {
            const response = await goalsAPI.getAll();
            setGoals(response.data);
        } catch (error) {
            console.error('Failed to fetch goals', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await goalsAPI.create(formData);
            setShowModal(false);
            setFormData({ name: '', targetAmount: '', currentAmount: '', deadline: '' });
            fetchGoals();
        } catch (error) {
            console.error('Failed to create goal', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this goal?')) {
            try {
                await goalsAPI.delete(id);
                fetchGoals();
            } catch (error) {
                console.error('Failed to delete goal', error);
            }
        }
    };

    const handleAddMoney = async (goal) => {
        const amount = prompt('Enter amount to add:');
        if (amount && !isNaN(amount)) {
            try {
                const updatedGoal = {
                    ...goal,
                    currentAmount: goal.currentAmount + parseFloat(amount)
                };
                await goalsAPI.update(goal.id, updatedGoal);
                fetchGoals();
            } catch (error) {
                console.error('Failed to update goal', error);
            }
        }
    };

    const calculateProgress = (current, target) => {
        return Math.min((current / target) * 100, 100);
    };

    if (loading) return <div className="p-8 text-center">Loading goals...</div>;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Savings Goals</h1>
                    <p className="text-gray-500 dark:text-gray-400">Track your financial targets</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30"
                >
                    <Plus size={20} />
                    <span>New Goal</span>
                </motion.button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                    {goals.map((goal) => (
                        <motion.div
                            key={goal.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            whileHover={{ y: -5 }}
                            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                                    <Target size={24} />
                                </div>
                                <button
                                    onClick={() => handleDelete(goal.id)}
                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>

                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">{goal.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                Target: ₹{goal.targetAmount.toLocaleString()}
                                {goal.deadline && ` • by ${goal.deadline}`}
                            </p>

                            <div className="mb-4">
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="font-medium text-gray-700 dark:text-gray-300">₹{goal.currentAmount.toLocaleString()}</span>
                                    <span className="text-gray-500">{Math.round(calculateProgress(goal.currentAmount, goal.targetAmount))}%</span>
                                </div>
                                <div className="h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${calculateProgress(goal.currentAmount, goal.targetAmount)}%` }}
                                        transition={{ duration: 1, ease: "easeOut" }}
                                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                                    ></motion.div>
                                </div>
                            </div>

                            <motion.button
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleAddMoney(goal)}
                                className="w-full py-2 flex items-center justify-center gap-2 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                                <DollarSign size={16} />
                                Add Money
                            </motion.button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl"
                        >
                            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Create New Goal</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Goal Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Target Amount (₹)</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                        value={formData.targetAmount}
                                        onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Starting Amount (₹)</label>
                                    <input
                                        type="number"
                                        className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                        value={formData.currentAmount}
                                        onChange={(e) => setFormData({ ...formData, currentAmount: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Target Date</label>
                                    <input
                                        type="date"
                                        className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                        value={formData.deadline}
                                        onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                                    />
                                </div>
                                <div className="flex gap-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors"
                                    >
                                        Create Goal
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default Goals;
