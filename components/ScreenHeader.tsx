import React from "react";
import { TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useThemeColors } from "../context/ThemeContext";
import { styles } from "./styles/aboutStyles";

interface ScreenHeaderProps {
  title: string;
  onBack: () => void;
}

export default function ScreenHeader({ title, onBack }: ScreenHeaderProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { gradientColors, headerTitleColor, backButtonBg } = useThemeColors();

  return (
    <LinearGradient
      colors={gradientColors}
      style={[styles.header, { paddingTop: insets.top + 16 }]}
    >
      <TouchableOpacity
        onPress={onBack}
        style={[styles.backButton, { backgroundColor: backButtonBg }]}
        activeOpacity={0.8}
      >
        <MaterialCommunityIcons
          name="arrow-left"
          size={22}
          color={theme.colors.onSurface}
        />
      </TouchableOpacity>
      <Text style={[styles.headerTitle, { color: headerTitleColor }]}>
        {title}
      </Text>
    </LinearGradient>
  );
}
