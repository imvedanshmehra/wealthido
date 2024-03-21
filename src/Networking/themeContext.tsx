import React, { ReactNode, createContext, useEffect, useState } from "react";
import StorageService from "../StorageService";

interface ThemeContextType {
  theme: any;
  isDarkMode: boolean;
  setThemePreference: (newTheme: string) => void;
  toggleDarkMode: () => void;
  resetSwitch: () => void;
  toggleTheme: () => void,
}

interface ThemeProviderProps {
  children: ReactNode;
 
}

export const ThemeContext = createContext<ThemeContextType | any>(Object);

export const ThemeProvider = ({ children}: ThemeProviderProps) => {
  const [theme, setTheme] = useState<string>('light');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    loadThemePreference();
    loadDarkModePreference();
  }, []);

  
  const loadThemePreference = async () => {
    try {
      const storedTheme = await StorageService.getIsDark();
      if (storedTheme) {
        setTheme(storedTheme);
      }
    } catch (error) {
      console.error("Error loading theme preference", error);
    }
  };

  const loadDarkModePreference = async () => {
    try {
      const storedDarkMode = await StorageService.getIsSwitch();
      if (storedDarkMode) {
        setIsDarkMode(storedDarkMode === "true");
      }
    } catch (error) {
      console.error("Error loading dark mode preference", error);
    }
  };

  const resetSwitch = () => {
    setIsDarkMode(false);
  };

  const toggleDarkMode = async () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    await StorageService.setIsSwitch(newDarkMode.toString());
  };

  const setThemePreference = async (newTheme: string) => {
    try {
      await StorageService.setIsDark(newTheme);
      setTheme(newTheme);
    } catch (error) {
      console.error("Error setting theme preference", error);
    }
  };
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setThemePreference(newTheme);
  };

  const contextValue: ThemeContextType = {
    theme,
    setThemePreference,
    isDarkMode,
    toggleDarkMode,
    resetSwitch,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};
