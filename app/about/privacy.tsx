import React from "react";
import { View, ScrollView } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useThemeColors } from "../../context/ThemeContext";
import ScreenHeader from "../../components/ScreenHeader";
import { styles } from "../../components/styles/aboutStyles";

export default function PrivacyNoticeScreen() {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { primaryBlue } = useThemeColors();

  return (
    <View style={[styles.flex, { backgroundColor: theme.colors.background }]}>
      <ScreenHeader title="Privacy Notice" onBack={() => router.back()} />

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
            Privacy Policy
          </Text>
          <Text
            style={[styles.paragraph, { color: theme.colors.onSurfaceVariant }]}
          >
            Last Updated: June 15, 2026
            {"\n\n"}
            At BuildRate, we value and respect your privacy. This Privacy Notice
            explains how we collect, use, and share information when you use our
            mobile application.
          </Text>

          <Text style={[styles.sectionTitle, { color: primaryBlue }]}>
            1. Information We Collect
          </Text>
          <Text
            style={[styles.paragraph, { color: theme.colors.onSurfaceVariant }]}
          >
            We collect information that you provide to us directly:
          </Text>

          <View style={styles.bulletRow}>
            <Text style={[styles.bullet, { color: theme.colors.primary }]}>•</Text>
            <Text
              style={[styles.bulletText, { color: theme.colors.onSurfaceVariant }]}
            >
              <Text style={{ fontWeight: "bold", color: theme.colors.onSurface }}>
                Account Information:{" "}
              </Text>
              When you create or update an account, we collect your username, email address,
              phone number, password, and profile image preference.
            </Text>
          </View>

          <View style={styles.bulletRow}>
            <Text style={[styles.bullet, { color: theme.colors.primary }]}>•</Text>
            <Text
              style={[styles.bulletText, { color: theme.colors.onSurfaceVariant }]}
            >
              <Text style={{ fontWeight: "bold", color: theme.colors.onSurface }}>
                Supplier Information:{" "}
              </Text>
              If you register as a supplier, we collect your business name, warehouse/office
              addresses, Google Map URLs, city, dealing categories, and GST registration numbers.
            </Text>
          </View>

          <Text style={[styles.sectionTitle, { color: primaryBlue }]}>
            2. How We Use Information
          </Text>
          <Text
            style={[styles.paragraph, { color: theme.colors.onSurfaceVariant }]}
          >
            We use the collected information for the following purposes:
          </Text>

          <View style={styles.bulletRow}>
            <Text style={[styles.bullet, { color: theme.colors.primary }]}>•</Text>
            <Text
              style={[styles.bulletText, { color: theme.colors.onSurfaceVariant }]}
            >
              To provide, support, and keep the comparison directory up-to-date.
            </Text>
          </View>

          <View style={styles.bulletRow}>
            <Text style={[styles.bullet, { color: theme.colors.primary }]}>•</Text>
            <Text
              style={[styles.bulletText, { color: theme.colors.onSurfaceVariant }]}
            >
              To permit communication between builders and suppliers via direct call, email,
              or WhatsApp.
            </Text>
          </View>

          <View style={styles.bulletRow}>
            <Text style={[styles.bullet, { color: theme.colors.primary }]}>•</Text>
            <Text
              style={[styles.bulletText, { color: theme.colors.onSurfaceVariant }]}
            >
              To improve app performance, customize user experience, and secure accounts.
            </Text>
          </View>

          <Text style={[styles.sectionTitle, { color: primaryBlue }]}>
            3. Information Sharing
          </Text>
          <Text
            style={[styles.paragraph, { color: theme.colors.onSurfaceVariant }]}
          >
            We do not sell your personal information. As part of our service:
            {"\n"}- Supplier business profile, catalogs, phone numbers, and addresses are
            made visible to the public to facilitate transaction connections.
            {"\n"}- We may share information with law enforcement when required by legal
            obligations.
          </Text>

          <Text style={[styles.sectionTitle, { color: primaryBlue }]}>
            4. Data Security & Storage
          </Text>
          <Text
            style={[styles.paragraph, { color: theme.colors.onSurfaceVariant }]}
          >
            Your information is stored securely in our database services. We use industry
            standard measures to protect personal data from unauthorized access, disclosure,
            alteration, or loss. However, no internet transmission is 100% secure.
          </Text>

          <Text style={[styles.sectionTitle, { color: primaryBlue }]}>
            5. Contact Us
          </Text>
          <Text
            style={[styles.paragraph, { color: theme.colors.onSurfaceVariant }]}
          >
            If you have questions about this Privacy Notice, please contact our privacy
            compliance desk at support@buildrate.com.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
