import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext();

const getInitialTheme = () => {
    if (typeof window === 'undefined') return 'light';
    const saved = localStorage.getItem('theme');
    return saved === 'dark' || saved === 'light' ? saved : 'light';
};

const applyThemeClass = (theme) => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    root.style.colorScheme = theme;
};

export const ThemeProvider = ({ children }) => {
    const [theme, setThemeState] = useState(() => {
        const initial = getInitialTheme();
        applyThemeClass(initial);
        return initial;
    });

    const setTheme = useCallback((next) => {
        setThemeState(next === 'dark' ? 'dark' : 'light');
    }, []);

    useEffect(() => {
        applyThemeClass(theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = useCallback(() => {
        setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
    }, []);

    return (
        <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
