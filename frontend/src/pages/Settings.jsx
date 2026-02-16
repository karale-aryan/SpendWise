import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';
import { User, Mail, Lock, Save, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';

const Settings = () => {
    const { user, updateUser } = useAuth();
    const [formData, setFormData] = useState({
        username: user?.username || '',
        email: user?.email || '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null); // { type: 'success' | 'error', text: '' }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            // Only send fields that have values (password is optional)
            const payload = {
                username: formData.username,
                email: formData.email,
                password: formData.password || undefined
            };

            await userAPI.updateProfile(payload);
            updateUser({ username: formData.username, email: formData.email }); // Update context
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setFormData(prev => ({ ...prev, password: '' })); // Clear password field

            // Note: Ideally we should update the AuthContext user state here
            // But for now, the changes will reflect on next reload/login if critical
        } catch (error) {
            console.error("Failed to update profile", error);
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update profile. Username or Email might be taken.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Account Settings</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your profile and security preferences.</p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                <form onSubmit={handleSubmit} className="space-y-6">

                    {message && (
                        <div className={`p-4 rounded-xl flex items-start gap-3 border ${message.type === 'success'
                            ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-100 dark:border-green-800'
                            : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-100 dark:border-red-800'
                            }`}>
                            {message.type === 'success' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
                            <p className="font-medium text-sm mt-0.5">{message.text}</p>
                        </div>
                    )}

                    <div className="space-y-6">
                        <div className="pb-4 border-b border-gray-100 dark:border-gray-700">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Profile Details</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Update your public information.</p>
                        </div>

                        {/* Username */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Username</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    <User size={20} />
                                </div>
                                <input
                                    type="text"
                                    required
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all text-gray-900 dark:text-white"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    <Mail size={20} />
                                </div>
                                <input
                                    type="email"
                                    required
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all text-gray-900 dark:text-white"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6 pt-6">
                        <div className="pb-4 border-b border-gray-100 dark:border-gray-700">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Security</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Manage your password.</p>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">New Password (Optional)</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    <Lock size={20} />
                                </div>
                                <input
                                    type="password"
                                    placeholder="Leave blank to keep current password"
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-100 dark:border-gray-700 flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-primary hover:bg-primary-light text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-primary/30 transition-all flex items-center gap-2 disabled:opacity-70"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : (
                                <>
                                    <Save size={20} />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default Settings;
