import React from "react";
import { View, ScrollView, TouchableOpacity, Image } from "react-native";
import { Text, Surface, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import { useAppTheme } from "../../context/ThemeContext";
import { styles } from "../../components/styles/aboutStyles";

export default function AboutScreen() {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { resolvedScheme } = useAppTheme();
  const isDark = resolvedScheme === "dark";

  const gradientColors = isDark
    ? (["#2E1B2C", "#0F172A"] as const)
    : (["#D2E9FC", "#F5F7FA"] as const);

  const menuItems = [
    {
      title: "About Us",
      icon: "information-outline",
      route: "/about/about-us" as const,
    },
    {
      title: "Privacy Notice",
      icon: "shield-lock-outline",
      route: "/about/privacy" as const,
    },
    {
      title: "Terms of Service",
      icon: "file-document-outline",
      route: "/about/terms" as const,
    },
  ];

  return (
    <View style={[styles.flex, { backgroundColor: theme.colors.background }]}>
      <LinearGradient
        colors={gradientColors}
        style={[styles.header, { paddingTop: insets.top + 16 }]}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={[
            styles.backButton,
            {
              backgroundColor: isDark
                ? "rgba(255, 255, 255, 0.08)"
                : "rgba(0, 0, 0, 0.05)",
            },
          ]}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={22}
            color={theme.colors.onSurface}
          />
        </TouchableOpacity>
        <Text
          style={[
            styles.headerTitle,
            { color: isDark ? "#FFFFFF" : "#1E3A8A" },
          ]}
        >
          About BuildRate
        </Text>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Surface
          style={[styles.logoCard, { backgroundColor: theme.colors.surface }]}
          elevation={1}
        >
          <Image
            source={require("../../assets/CustomSplashScreenImage.png")}
            style={styles.logoImage}
            alt="BuildRate Logo"
          />
          <Text
            style={[styles.appName, { color: isDark ? "#FFFFFF" : "#1E3A8A" }]}
          >
            BuildRate
          </Text>
          <Text
            style={[
              styles.versionText,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            App Version 1.0.0
          </Text>
        </Surface>

        <Surface
          style={[styles.menuCard, { backgroundColor: theme.colors.surface }]}
          elevation={1}
        >
          {menuItems.map((item, index) => (
            <React.Fragment key={item.title}>
              {index > 0 && (
                <View
                  style={[
                    styles.divider,
                    { backgroundColor: theme.colors.onSurface },
                  ]}
                />
              )}
              <TouchableOpacity
                onPress={() => router.push(item.route as any)}
                style={styles.menuItem}
                activeOpacity={0.7}
              >
                <View style={styles.menuItemLeft}>
                  <MaterialCommunityIcons
                    name={item.icon as any}
                    size={22}
                    color={isDark ? "#4F8EF7" : "#1A56DB"}
                  />
                  <Text
                    style={[
                      styles.menuItemText,
                      { color: theme.colors.onSurface },
                    ]}
                  >
                    {item.title}
                  </Text>
                </View>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={20}
                  color={theme.colors.onSurfaceVariant}
                />
              </TouchableOpacity>
            </React.Fragment>
          ))}
        </Surface>

        <View style={styles.footer}>
          <Text
            style={[
              styles.footerText,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            © 2026 BuildRate. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
