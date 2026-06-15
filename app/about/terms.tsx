import React from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";
import { Text, Surface, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import { useAppTheme } from "../../context/ThemeContext";
import { styles } from "../../components/styles/aboutStyles";

export default function TermsScreen() {
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
          Terms of Service
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
            Terms of Service
          </Text>
          <Text
            style={[styles.paragraph, { color: theme.colors.onSurfaceVariant }]}
          >
            Last Updated: June 15, 2026
            {"\n\n"}
            By accessing or using the BuildRate application, you agree to be bound
            by these Terms of Service. Please read them carefully.
          </Text>

          <Text
            style={[
              styles.sectionTitle,
              { color: isDark ? "#4F8EF7" : "#1A56DB" },
            ]}
          >
            1. General Terms
          </Text>
          <Text
            style={[styles.paragraph, { color: theme.colors.onSurfaceVariant }]}
          >
            These terms govern your access and use of the BuildRate platform.
            BuildRate provides a price index directory for building materials. By using the app,
            you represent that you are at least 18 years of age and possess the legal capacity to
            enter into these terms.
          </Text>

          <Text
            style={[
              styles.sectionTitle,
              { color: isDark ? "#4F8EF7" : "#1A56DB" },
            ]}
          >
            2. Supplier Registration Process
          </Text>
          <Text
            style={[styles.paragraph, { color: theme.colors.onSurfaceVariant }]}
          >
            To become a registered and verified supplier on BuildRate, you must submit a request
            by filling out our official Google Form. You must provide valid business details,
            GST registration details, contact numbers, and warehouse address information.
            Our admin team will review and verify your submitted business credentials. Upon
            successful verification, you will be registered as a verified supplier in the app.
          </Text>

          <Text
            style={[
              styles.sectionTitle,
              { color: isDark ? "#4F8EF7" : "#1A56DB" },
            ]}
          >
            3. Supplier Acceptance
          </Text>
          <Text
            style={[styles.paragraph, { color: theme.colors.onSurfaceVariant }]}
          >
            Upon registration, suppliers agree and accept to:
            {"\n\n"}
            - Maintain up-to-date and accurate material prices and stock statuses.
            {"\n"}- List genuine, quality materials matching standard industry brands.
            {"\n"}- Act professionally and handle inquiries from builders and buyers honestly.
          </Text>

          <Text
            style={[
              styles.sectionTitle,
              { color: isDark ? "#4F8EF7" : "#1A56DB" },
            ]}
          >
            4. Prohibited Use
          </Text>
          <Text
            style={[styles.paragraph, { color: theme.colors.onSurfaceVariant }]}
          >
            Users and suppliers are strictly prohibited from:
            {"\n\n"}
            - Listing fraudulent, intentionally misleading, or placeholder material rates.
            {"\n"}- Impersonating other businesses, suppliers, or admins.
            {"\n"}- Using automated scripts, scrapers, or bots to crawl or copy data from the application.
            {"\n"}- Using the platform to distribute spam, promotions, or any unauthorized marketing content.
          </Text>

          <Text
            style={[
              styles.sectionTitle,
              { color: isDark ? "#4F8EF7" : "#1A56DB" },
            ]}
          >
            5. Rate Accuracy Disclaimer
          </Text>
          <Text
            style={[styles.paragraph, { color: theme.colors.onSurfaceVariant }]}
          >
            BuildRate acts solely as a price comparison directory and search index.
            We do not sell construction materials directly. We make no warranty that:
            {"\n"}- The prices displayed are always 100% correct or up-to-date.
            {"\n"}- The materials provided by suppliers are free of defects or fit for a specific purpose.
            {"\n\n"}
            Users are advised to confirm pricing and terms directly with the suppliers
            prior to purchasing or booking orders.
          </Text>

          <Text
            style={[
              styles.sectionTitle,
              { color: isDark ? "#4F8EF7" : "#1A56DB" },
            ]}
          >
            6. Limitation of Liability
          </Text>
          <Text
            style={[styles.paragraph, { color: theme.colors.onSurfaceVariant }]}
          >
            BuildRate shall not be liable for any indirect, incidental, special,
            consequential, or punitive damages resulting from your use of the application,
            material quality discrepancies, or pricing disputes between builders
            and suppliers.
          </Text>

          <Text
            style={[
              styles.sectionTitle,
              { color: isDark ? "#4F8EF7" : "#1A56DB" },
            ]}
          >
            7. Termination
          </Text>
          <Text
            style={[styles.paragraph, { color: theme.colors.onSurfaceVariant }]}
          >
            We reserve the right to suspend or terminate accounts that violate
            these terms, engage in spam, publish fraudulent data, or pose a security risk.
          </Text>
        </Surface>
      </ScrollView>
    </View>
  );
}
