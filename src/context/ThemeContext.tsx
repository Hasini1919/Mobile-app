import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';

const THEME_KEY = '@streambox_theme';

export type ThemeMode = 'light' | 'dark' | 'system';

interface Theme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  card: string;
  text: string;
  textSecondary: string;
  border: string;
  error: string;
  success: string;
}

/* ------------------ OLD COLORS MERGED WITH NEW COLORS ------------------ */

const lightTheme: Theme = {
  primary: '#E50914',
  secondary: '#B20710',
  accent: '#831010',
  background: '#F3F4F6',
  surface: '#FFFFFF',
  card: '#F9FAFB',
  text: '#118826',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  error: '#EF4444',
  success: '#10B981',
};

const darkTheme: Theme = {
  primary: '#E50914',
  secondary: '#B20710',
  accent: '#FF1F2F',
  background: '#0a0a0a',
  surface: '#1a1a2e',
  card: '#16213e',
  text: '#F9FAFB',
  textSecondary: '#9CA3AF',
  border: '#374151',
  error: '#F87171',
  success: '#34D399',
};

/* ---------------------------------------------------------------------- */

interface ThemeContextType {
  theme: Theme;
  themeMode: ThemeMode;
  isDark: boolean;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeInternal] = useState<ThemeMode>('system');
  const [theme, setTheme] = useState<Theme>(systemColorScheme === 'dark' ? darkTheme : lightTheme);

  /* Load saved theme */
  useEffect(() => {
    loadThemeMode();
  }, []);

  /* Update theme when mode or system setting changes */
  useEffect(() => {
    updateTheme();
  }, [themeMode, systemColorScheme]);

  const loadThemeMode = async () => {
    try {
      const saved = await AsyncStorage.getItem(THEME_KEY);
      if (saved === 'light' || saved === 'dark' || saved === 'system') {
        setThemeModeInternal(saved);
      }
    } catch (err) {
      console.log('Error loading theme mode', err);
    }
  };

  const updateTheme = () => {
    if (themeMode === 'system') {
      setTheme(systemColorScheme === 'dark' ? darkTheme : lightTheme);
    } else {
      setTheme(themeMode === 'dark' ? darkTheme : lightTheme);
    }
  };

  const setThemeMode = async (mode: ThemeMode) => {
    try {
      await AsyncStorage.setItem(THEME_KEY, mode);
      setThemeModeInternal(mode);
    } catch (err) {
      console.log('Error saving theme mode', err);
    }
  };

  const isDark = themeMode === 'system'
    ? systemColorScheme === 'dark'
    : themeMode === 'dark';

  return (
    <ThemeContext.Provider value={{ theme, themeMode, isDark, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used inside ThemeProvider');
  }
  return ctx;
}
