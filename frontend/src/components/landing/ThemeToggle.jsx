import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = ({
    iconColor,
    backgroundColor,
    size = 40,
    className = '',
}) => {
    const { theme, toggleTheme } = useTheme();

    const isDark = theme === 'dark';
    const resolvedIconColor = iconColor ?? (isDark ? '#F8FAFC' : '#0F172A');
    const resolvedBg = backgroundColor ?? (isDark ? 'rgba(248,250,252,0.08)' : 'rgba(15,23,42,0.06)');

    return (
        <button
            type="button"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            onClick={toggleTheme}
            className={`inline-flex items-center justify-center rounded-full border transition-all duration-200 hover:scale-105 active:scale-95 ${className}`}
            style={{
                width: size,
                height: size,
                borderColor: isDark ? 'rgba(248,250,252,0.2)' : 'rgba(15,23,42,0.15)',
                background: resolvedBg,
                color: resolvedIconColor,
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}
        >
            {isDark ? (
                <Moon size={size * 0.45} color={resolvedIconColor} />
            ) : (
                <Sun size={size * 0.45} color={resolvedIconColor} />
            )}
        </button>
    );
};

export default ThemeToggle;
