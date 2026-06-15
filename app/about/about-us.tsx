import React from "react";
import { View, ScrollView } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useThemeColors } from "../../context/ThemeContext";
import ScreenHeader from "../../components/ScreenHeader";
import { styles } from "../../components/styles/aboutStyles";

export default function AboutUsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { primaryBlue } = useThemeColors();

  return (
    <View style={[styles.flex, { backgroundColor: theme.colors.background }]}>
      <ScreenHeader title="About Us" onBack={() => router.back()} />

      <ScrollView
        style={styles.detailScrollView}
        contentContainerStyle={[
          styles.detailScrollContent,
          { paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.detailCard,
            {
              backgroundColor: theme.colors.surface,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.06,
              shadowRadius: 4,
              elevation: 1,
            },
          ]}
        >
          <Text
            style={[
              styles.sectionTitle,
              { color: primaryBlue, marginTop: 0 },
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
            style={[styles.sectionTitle, { color: primaryBlue }]}
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
            style={[styles.sectionTitle, { color: primaryBlue }]}
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
                Real-time Rate Comparison:{" "}
              </Text>
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
                Verified Suppliers:{" "}
              </Text>
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
                Seamless Communication:{" "}
              </Text>
              Get direct phone, email, and WhatsApp access to suppliers
              alongside direct Google Maps warehouse locations.
            </Text>
          </View>

          <Text
            style={[styles.sectionTitle, { color: primaryBlue }]}
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
        </View>
      </ScrollView>
    </View>
  );
}
