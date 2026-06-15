import React from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";
import { Text, Surface, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import { useAppTheme } from "../../context/ThemeContext";
import { styles } from "../../components/styles/aboutStyles";

export default function AboutUsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { resolvedScheme } = useAppTheme();
  const isDark = resolvedScheme === "dark";

  const gradientColors = isDark
    ? (["#2E1B2C", "#0F172A"] as const)
    : (["#D2E9FC", "#F5F7FA"] as const);

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
          About Us
        </Text>
      </LinearGradient>

      <ScrollView
        style={styles.detailScrollView}
        contentContainerStyle={[
          styles.detailScrollContent,
          { paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Surface
          style={[styles.detailCard, { backgroundColor: theme.colors.surface }]}
          elevation={1}
        >
          <Text
            style={[
              styles.sectionTitle,
              { color: isDark ? "#4F8EF7" : "#1A56DB", marginTop: 0 },
            ]}
          >
            Welcome to BuildRate
          </Text>
          <Text
            style={[styles.paragraph, { color: theme.colors.onSurfaceVariant }]}
          >
            BuildRate is a premier construction material comparison platform
            designed to empower builders, contractors, developers, and
            homeowners. Our goal is to bring transparency, efficiency, and
            competitiveness to the procurement of construction materials.
          </Text>

          <Text
            style={[
              styles.sectionTitle,
              { color: isDark ? "#4F8EF7" : "#1A56DB" },
            ]}
          >
            Our Mission
          </Text>
          <Text
            style={[styles.paragraph, { color: theme.colors.onSurfaceVariant }]}
          >
            We aim to simplify the process of checking and comparing rates for
            essential building materials. By connecting verified local suppliers
            with buyers, we ensure you always find the best rates without
            compromising on quality or spending hours making phone calls.
          </Text>

          <Text
            style={[
              styles.sectionTitle,
              { color: isDark ? "#4F8EF7" : "#1A56DB" },
            ]}
          >
            Key Features
          </Text>

          <View style={styles.bulletRow}>
            <Text style={[styles.bullet, { color: theme.colors.primary }]}>
              •
            </Text>
            <Text
              style={[
                styles.bulletText,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              <Text
                style={{ fontWeight: "bold", color: theme.colors.onSurface }}
              >
                Real-time Rate Comparison:
              </Text>{" "}
              Compare prices across multiple categories (Cement, Steel, RMC,
              Sand, Aggregate, Bricks) dynamically.
            </Text>
          </View>

          <View style={styles.bulletRow}>
            <Text style={[styles.bullet, { color: theme.colors.primary }]}>
              •
            </Text>
            <Text
              style={[
                styles.bulletText,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              <Text
                style={{ fontWeight: "bold", color: theme.colors.onSurface }}
              >
                Verified Suppliers:
              </Text>{" "}
              Connect only with trust-validated local suppliers who keep their
              lists accurate and detailed.
            </Text>
          </View>

          <View style={styles.bulletRow}>
            <Text style={[styles.bullet, { color: theme.colors.primary }]}>
              •
            </Text>
            <Text
              style={[
                styles.bulletText,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              <Text
                style={{ fontWeight: "bold", color: theme.colors.onSurface }}
              >
                Seamless Communication:
              </Text>{" "}
              Get direct phone, email, and WhatsApp access to suppliers
              alongside direct Google Maps warehouse locations.
            </Text>
          </View>

          <Text
            style={[
              styles.sectionTitle,
              { color: isDark ? "#4F8EF7" : "#1A56DB" },
            ]}
          >
            Why Choose Us?
          </Text>
          <Text
            style={[styles.paragraph, { color: theme.colors.onSurfaceVariant }]}
          >
            We build tools that save you time and money. Our interface is
            optimized for speed, works in both dark and light modes, and
            respects your privacy. Whether you are running a large-scale project
            or just getting started, BuildRate is here to support you.
          </Text>
        </Surface>
      </ScrollView>
    </View>
  );
}
