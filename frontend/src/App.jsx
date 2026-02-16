import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Layout from './components/layout/Layout';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AddExpense from './pages/AddExpense';
import Budget from './pages/Budget';
import Settings from './pages/Settings';
import Analytics from './pages/Analytics';
import Subscriptions from './pages/Subscriptions';
import Goals from './pages/Goals';

function App() {
    return (
        <Router>
            <AuthProvider>
                <ThemeProvider>
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        {/* Protected Routes wrapped in Layout */}
                        <Route element={<ProtectedRoute />}>
                            <Route element={<Layout />}>
                                <Route path="/" element={<Dashboard />} />
                                <Route path="/add-expense" element={<AddExpense />} />
                                <Route path="/budget" element={<Budget />} />
                                <Route path="/subscriptions" element={<Subscriptions />} />
                                <Route path="/goals" element={<Goals />} /> {/* Added Goals route */}
                                <Route path="/settings" element={<Settings />} />
                                <Route path="/analytics" element={<Analytics />} />
                            </Route>
                        </Route>

                        {/* Catch all */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </ThemeProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;
