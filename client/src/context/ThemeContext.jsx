// client/src/context/ThemeContext.jsx

import React, { createContext, useState, useEffect, useContext } from 'react';

// 1. Get the saved theme or default to 'light'
const getInitialTheme = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const storedPrefs = window.localStorage.getItem('theme');
    if (typeof storedPrefs === 'string') {
      return storedPrefs;
    }

    // Check for user's OS preference
    const userMedia = window.matchMedia('(prefers-color-scheme: dark)');
    if (userMedia.matches) {
      return 'dark';
    }
  }
  return 'light'; // default
};

// 2. Create the context
export const ThemeContext = createContext();

// 3. Create the Provider component
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(getInitialTheme);

  // 4. This function applies the theme to the <html> tag
  const applyTheme = (theme) => {
    const root = window.document.documentElement;
    const isDark = theme === 'dark';

    root.classList.remove(isDark ? 'light' : 'dark');
    root.classList.add(theme);
    
    window.localStorage.setItem('theme', theme);
  };

  // 5. This is the toggle function we'll use
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // 6. Any time the 'theme' state changes, apply it
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// 7. Create a custom hook to easily use the context
export const useTheme = () => useContext(ThemeContext);