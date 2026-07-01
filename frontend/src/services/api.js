import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
    baseURL: '/api', // Proxy handles request to http://localhost:8080
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to inject the JWT token
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

// Add a response interceptor to handle auth errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 403) {
            // Token invalid or expired
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const authAPI = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (data) => api.post('/auth/register', data),
};

export const expenseAPI = {
    getAll: () => api.get('/expenses'),
    create: (data) => api.post('/expenses', data),
    update: (id, data) => api.put(`/expenses/${id}`, data),
    delete: (id) => api.delete(`/expenses/${id}`),
};

export const budgetAPI = {
    get: (month, year) => api.get(`/budgets/${month}/${year}`),
    getCurrent: () => api.get('/budgets/current'),
    set: (data) => api.post('/budgets', data),
};

export const dashboardAPI = {
    get: () => api.get('/dashboard'),
};

export const aiAPI = {
    analyze: () => api.post('/ai/analyze'),
    chat: (data) => api.post('/ai/chat', data),
};

export const goalsAPI = {
    getAll: () => api.get('/goals'),
    create: (data) => api.post('/goals', data),
    update: (id, data) => api.put(`/goals/${id}`, data),
    delete: (id) => api.delete(`/goals/${id}`),
};

export const userAPI = {
    getProfile: () => api.get('/users/me'),
    updateProfile: (data) => api.put('/users/me', data),
};

export const analyticsAPI = {
    get: () => api.get('/analytics'),
};

export const recurringExpenseAPI = {
    getAll: () => api.get('/recurring-expenses'),
    add: (data) => api.post('/recurring-expenses', data),
    delete: (id) => api.delete(`/recurring-expenses/${id}`),
};

export default api;
