// ThemeContext - manages light/dark (night) mode globally
// Persists choice to localStorage so it survives reloads
import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext(null);

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
}

export function ThemeProvider({ children }) {
  // Default to dark/night mode — better for outdoor screen visibility
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('kashta-theme') || 'night';
  });

  // Apply the theme attribute on <html> so CSS variables switch
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('kashta-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((t) => (t === 'night' ? 'day' : 'night'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
