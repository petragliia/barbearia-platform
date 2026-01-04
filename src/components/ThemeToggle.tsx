"use client";

import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { setTheme } from '@/utils/theme';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
    const [isDark, setIsDark] = useState(true);

    useEffect(() => {
        // Check initial theme from cookie or classList
        const themeCookie = document.cookie.split('; ').find(row => row.startsWith('theme='));
        const isDarkCookie = themeCookie ? themeCookie.split('=')[1] === 'dark' : true; // Default to dark if no cookie
        setIsDark(isDarkCookie);

        // Also sync with classList just in case
        if (document.documentElement.classList.contains('dark')) {
            setIsDark(true);
        } else {
            setIsDark(false);
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = isDark ? 'light' : 'dark';
        setTheme(newTheme);
        setIsDark(!isDark);
    };

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="text-slate-400 hover:text-white hover:bg-slate-800 rounded-full w-10 h-10"
            title={isDark ? "Mudar para tema claro" : "Mudar para tema escuro"}
        >
            {isDark ? <Moon size={20} /> : <Sun size={20} />}
        </Button>
    );
}
