import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI, userAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        try {
            const response = await userAPI.getProfile();
            setUser(response.data);
        } catch (error) {
            console.error('Failed to fetch user', error);
            // If fetch fails (e.g. 401), maybe logout?
            // logout(); 
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
            fetchUser();
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (credentials) => {
        try {
            const response = await authAPI.login(credentials);
            const data = response.data;
            const jwtToken = data.token || data.accessToken;

            localStorage.setItem('token', jwtToken);
            setToken(jwtToken);

            // Set user from response initially
            setUser({ username: data.username, email: data.email, roles: data.roles });

            return true;
        } catch (error) {
            console.error('Login failed', error);
            throw error;
        }
    };

    const register = async (userData) => {
        try {
            const response = await authAPI.register(userData);
            const data = response.data;
            const jwtToken = data.token || data.accessToken;

            localStorage.setItem('token', jwtToken);
            setToken(jwtToken);

            setUser({ username: data.username, email: data.email, roles: data.roles });

            return true;
        } catch (error) {
            console.error('Registration failed', error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    const updateUser = (userData) => {
        setUser(prev => ({ ...prev, ...userData }));
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, updateUser, loading }}>
            {loading ? (
                <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
