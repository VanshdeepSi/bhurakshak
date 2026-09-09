import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('bhurakshak_theme') || 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark', 'tactical');
    root.classList.add(theme);
    localStorage.setItem('bhurakshak_theme', theme);

    if (theme === 'light') {
      document.body.classList.add('light-mode');
      document.body.style.backgroundColor = '#f8fafc';
      document.body.style.color = '#0f172a';
    } else if (theme === 'tactical') {
      document.body.classList.remove('light-mode');
      document.body.style.backgroundColor = '#060a08';
      document.body.style.color = '#34d399';
    } else {
      document.body.classList.remove('light-mode');
      document.body.style.backgroundColor = '#111317';
      document.body.style.color = '#e2e2e8';
    }
  }, [theme]);

  const toggleTheme = (newTheme) => {
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme: toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
