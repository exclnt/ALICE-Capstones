import React from 'react';

interface ThemeContextType {
  theme: string;
  toggleTheme: () => void;
}

export const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = React.use(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
