import axios from 'axios';

// Backend URL from Vercel Environment Variables
const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// Create axios instance
const api = axios.create({
    baseURL: `${API_BASE_URL}/api`,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
            localStorage.removeItem('token');

            if (
                window.location.pathname !== '/login' &&
                window.location.pathname !== '/register'
            ) {
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

// ===========================
// Authentication
// ===========================
export const authAPI = {
    login: (credentials) =>
        api.post('/auth/login', credentials),

    register: (data) =>
        api.post('/auth/register', data),
};

// ===========================
// Expenses
// ===========================
export const expenseAPI = {
    getAll: () => api.get('/expenses'),

    create: (data) =>
        api.post('/expenses', data),

    update: (id, data) =>
        api.put(`/expenses/${id}`, data),

    delete: (id) =>
        api.delete(`/expenses/${id}`),
};

// ===========================
// Budget
// ===========================
export const budgetAPI = {
    get: (month, year) =>
        api.get(`/budgets/${month}/${year}`),

    getCurrent: () =>
        api.get('/budgets/current'),

    set: (data) =>
        api.post('/budgets', data),
};

// ===========================
// Dashboard
// ===========================
export const dashboardAPI = {
    get: () => api.get('/dashboard'),
};

// ===========================
// AI
// ===========================
export const aiAPI = {
    analyze: () => api.post('/ai/analyze'),

    chat: (data) =>
        api.post('/ai/chat', data),
};

// ===========================
// Goals
// ===========================
export const goalsAPI = {
    getAll: () => api.get('/goals'),

    create: (data) =>
        api.post('/goals', data),

    update: (id, data) =>
        api.put(`/goals/${id}`, data),

    delete: (id) =>
        api.delete(`/goals/${id}`),
};

// ===========================
// User
// ===========================
export const userAPI = {
    getProfile: () => api.get('/users/me'),

    updateProfile: (data) =>
        api.put('/users/me', data),
};

// ===========================
// Analytics
// ===========================
export const analyticsAPI = {
    get: () => api.get('/analytics'),
};

// ===========================
// Recurring Expenses
// ===========================
export const recurringExpenseAPI = {
    getAll: () => api.get('/recurring-expenses'),

    add: (data) =>
        api.post('/recurring-expenses', data),

    delete: (id) =>
        api.delete(`/recurring-expenses/${id}`),
};

export default api;