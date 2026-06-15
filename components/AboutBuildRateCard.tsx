import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Text, useTheme } from "react-native-paper";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import { useThemeColors } from "../context/ThemeContext";

export default function AboutBuildRateCard() {
  const theme = useTheme();
  const router = useRouter();
  const { primaryBlue, aboutCardBg, aboutCardBorder } = useThemeColors();

  return (
    <View
      style={{
        borderRadius: 16,
        backgroundColor: aboutCardBg,
        borderColor: aboutCardBorder,
        borderWidth: 1,
        paddingHorizontal: 16,
        paddingVertical: 14,
        marginTop: 14,
      }}
    >
      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingVertical: 4,
        }}
        onPress={() => router.push("/about" as any)}
        activeOpacity={0.85}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
          <MaterialCommunityIcons
            name="information-outline"
            size={22}
            color={primaryBlue}
          />
          <View>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: theme.colors.onSurface,
              }}
            >
              About BuildRate
            </Text>
            <Text
              style={{
                fontSize: 11,
                color: theme.colors.onSurfaceVariant,
                marginTop: 2,
              }}
            >
              About Us, Privacy Notice, Terms
            </Text>
          </View>
        </View>
        <MaterialCommunityIcons
          name="chevron-right"
          size={20}
          color={theme.colors.onSurfaceVariant}
        />
      </TouchableOpacity>
    </View>
  );
}
