import React from "react";
import { View, ScrollView, TouchableOpacity, Image } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import { useThemeColors } from "../../context/ThemeContext";
import ScreenHeader from "../../components/ScreenHeader";
import { styles } from "../../components/styles/aboutStyles";

export default function AboutScreen() {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { primaryBlue } = useThemeColors();

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

  const cardShadow = {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  };

  return (
    <View style={[styles.flex, { backgroundColor: theme.colors.background }]}>
      <ScreenHeader title="About BuildRate" onBack={() => router.back()} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.logoCard,
            { backgroundColor: theme.colors.surface },
            cardShadow,
          ]}
        >
          <Image
            source={require("../../assets/CustomSplashScreenImage.png")}
            style={styles.logoImage}
            alt="BuildRate Logo"
          />
          <Text style={[styles.appName, { color: primaryBlue }]}>
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
        </View>

        <View
          style={[
            styles.menuCard,
            { backgroundColor: theme.colors.surface },
            cardShadow,
          ]}
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
                    color={primaryBlue}
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
        </View>

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
