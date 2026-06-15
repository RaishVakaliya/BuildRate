import React, { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

type ThemePreference = "light" | "dark" | "system";

interface ThemeContextValue {
  preference: ThemePreference;
  setPreference: (pref: ThemePreference) => void;
  resolvedScheme: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextValue>({
  preference: "system",
  setPreference: () => {},
  resolvedScheme: "light",
});

const STORAGE_KEY = "@buildrate_theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>("system");

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (stored === "light" || stored === "dark" || stored === "system") {
        setPreferenceState(stored);
      }
    });
  }, []);

  const setPreference = async (pref: ThemePreference) => {
    setPreferenceState(pref);
    await AsyncStorage.setItem(STORAGE_KEY, pref);
  };

  const resolvedScheme: "light" | "dark" =
    preference === "system" ? (systemScheme ?? "light") : preference;

  return (
    <ThemeContext.Provider
      value={{ preference, setPreference, resolvedScheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  return useContext(ThemeContext);
}

export function useThemeColors() {
  const { resolvedScheme } = useAppTheme();
  const isDark = resolvedScheme === "dark";

  return {
    isDark,
    gradientColors: isDark
      ? (["#2E1B2C", "#0F172A"] as const)
      : (["#D2E9FC", "#F5F7FA"] as const),
    primaryBlue: isDark ? "#4F8EF7" : "#1A56DB",
    headerTitleColor: isDark ? "#FFFFFF" : "#1E3A8A",
    backButtonBg: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.05)",
    aboutCardBg: isDark ? "rgba(79, 142, 247, 0.08)" : "rgba(26, 86, 219, 0.05)",
    aboutCardBorder: isDark ? "rgba(79, 142, 247, 0.2)" : "rgba(26, 86, 219, 0.15)",
  };
}
