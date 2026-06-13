import { createContext, ReactNode, useContext, useState } from 'react';

// 1. Определяем палитры цветов
export const Colors = {
  light: {
    background: '#FFFFFF',
    text: '#333333',
    textSecondary: '#666666',
    card: '#FFFFFF',
    iconBg: '#F0F0F0',
    border: '#E0E0E0',
    tabBar: '#000066',
    tabBarInactive: 'white',
    tabBarActive: '#00D4FF',
  },
  dark: {
    background: '#121212',
    text: '#FFFFFF',
    textSecondary: '#AAAAAA',
    card: '#1E1E1E',
    iconBg: '#333333',
    border: '#333333',
    tabBar: '#050505',
    tabBarInactive: '#666666',
    tabBarActive: '#00D4FF',
  }
};

// 2. Создаем контекст
type ThemeContextType = {
  isDarkMode: boolean;
  toggleTheme: () => void;
  colors: typeof Colors.light;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  const colors = isDarkMode ? Colors.dark : Colors.light;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

// 3. Хук для удобного использования в компонентах
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};