import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, ArrowRight, Loader2 } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' }); // API expects username, verifying
    // Based on backend, /login expects LoginRequest { usernameOrEmail, password }
    // Wait, backend AuthService `login` uses `LoginRequest` with `usernameOrEmail`

    const { login } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await login({ usernameOrEmail: formData.email, password: formData.password });
            navigate('/');
        } catch (err) {
            setError('Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4 transition-colors duration-300">
            <div className="bg-white dark:bg-gray-800 w-full max-w-md p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                <div className="text-center mb-8">
                    <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                        <Lock size={24} />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome Back</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Sign into manage your finances</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Username or Email</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                                placeholder="Enter your username or email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="password"
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-end">
                        <a href="#" className="text-sm font-medium text-primary hover:text-primary-light">Forgot Password?</a>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary hover:bg-primary-light text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : (
                            <>
                                Sign In
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
                    Don't have an account?{' '}
                    <Link to="/register" className="font-semibold text-primary hover:text-primary-light transition-colors">
                        Create Account
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
