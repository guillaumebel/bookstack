import type { PaletteMode } from "@mui/material/styles";
import { ThemeProvider } from "@mui/material/styles";
import React, { createContext, useContext, useEffect, useState } from "react";
import { createAppTheme } from "../theme";

interface ThemeContextType {
  mode: PaletteMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useThemeMode = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeMode must be used within a ThemeContextProvider");
  }
  return context;
};

interface ThemeContextProviderProps {
  children: React.ReactNode;
}

export const ThemeContextProvider: React.FC<ThemeContextProviderProps> = ({
  children,
}) => {
  // Get initial theme from localStorage or default to light
  const [mode, setMode] = useState<PaletteMode>(() => {
    const saved = localStorage.getItem("themeMode");
    return (saved as PaletteMode) || "light";
  });

  // Save theme preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("themeMode", mode);
  }, [mode]);

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  const theme = createAppTheme(mode);

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
};
