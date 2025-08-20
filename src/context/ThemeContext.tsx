"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import type { ThemeContextType } from "../types"

interface Theme {
  colors: {
    primary: string
    secondary: string
    background: string
    surface: string
    text: string
    textSecondary: string
    border: string
    header: string
    headerText: string
    card: string
    success: string
    error: string
    warning: string
  }
  statusBar: "dark" | "light"
}

const lightTheme: Theme = {
  colors: {
    primary: "#007AFF",
    secondary: "#5856D6",
    background: "#FFFFFF",
    surface: "#F2F2F7",
    text: "#000000",
    textSecondary: "#8E8E93",
    border: "#C6C6C8",
    header: "#FFFFFF",
    headerText: "#000000",
    card: "#FFFFFF",
    success: "#34C759",
    error: "#FF3B30",
    warning: "#FF9500",
  },
  statusBar: "dark",
}

const darkTheme: Theme = {
  colors: {
    primary: "#0A84FF",
    secondary: "#5E5CE6",
    background: "#000000",
    surface: "#1C1C1E",
    text: "#FFFFFF",
    textSecondary: "#8E8E93",
    border: "#38383A",
    header: "#1C1C1E",
    headerText: "#FFFFFF",
    card: "#2C2C2E",
    success: "#30D158",
    error: "#FF453A",
    warning: "#FF9F0A",
  },
  statusBar: "light",
}

interface ExtendedThemeContextType extends ThemeContextType {
  theme: Theme
}

const ThemeContext = createContext<ExtendedThemeContextType | undefined>(undefined)

interface ThemeProviderProps {
  children: ReactNode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDark, setIsDark] = useState<boolean>(false)

  useEffect(() => {
    loadTheme()
  }, [])

  const loadTheme = async (): Promise<void> => {
    try {
      const savedTheme = await AsyncStorage.getItem("theme")
      if (savedTheme !== null) {
        setIsDark(savedTheme === "dark")
      }
    } catch (error) {
      console.error("Error loading theme:", error)
    }
  }

  const toggleTheme = async (): Promise<void> => {
    try {
      const newTheme = !isDark
      setIsDark(newTheme)
      await AsyncStorage.setItem("theme", newTheme ? "dark" : "light")
    } catch (error) {
      console.error("Error saving theme:", error)
    }
  }

  const theme = isDark ? darkTheme : lightTheme

  const contextValue: ExtendedThemeContextType = {
    isDark,
    toggleTheme,
    colors: theme.colors,
    theme,
  }

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>
}

export const useTheme = (): ExtendedThemeContextType => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
