import React, { useState } from "react";
import { View, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { Text, Searchbar, useTheme, Surface } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { COLORS } from "../../constants/theme";
import { useAppTheme } from "../../context/ThemeContext";

const CATEGORIES = [
  { id: "1", label: "Cement", icon: "circle-outline", color: "#6B7280" },
  { id: "2", label: "Steel", icon: "nail", color: "#4B5563" },
  { id: "3", label: "RMC", icon: "truck-cargo-container", color: "#7C3AED" },
  { id: "4", label: "Sand", icon: "wave", color: "#D97706" },
  { id: "5", label: "Aggregate", icon: "terrain", color: "#92400E" },
  { id: "6", label: "Bricks", icon: "wall", color: "#B91C1C" },
];

const TRENDING_PRICES = [
  {
    id: "1",
    material: "OPC 53 Cement",
    brand: "UltraTech",
    price: 380,
    unit: "bag",
    change: -2.5,
    suppliers: 12,
    city: "Surat",
  },
  {
    id: "2",
    material: "TMT Steel Bar",
    brand: "TATA Tiscon",
    price: 58500,
    unit: "MT",
    change: +1.8,
    suppliers: 8,
    city: "Surat",
  },
  {
    id: "3",
    material: "River Sand",
    brand: "Local",
    price: 1800,
    unit: "brass",
    change: 0,
    suppliers: 15,
    city: "Surat",
  },
  {
    id: "4",
    material: "Red Clay Brick",
    brand: "Standard",
    price: 7200,
    unit: "1000 pcs",
    change: -1.2,
    suppliers: 20,
    city: "Surat",
  },
];

const TOP_SUPPLIERS = [
  {
    id: "1",
    name: "Ravi Building Materials",
    rating: 4.8,
    materials: 24,
    city: "Surat",
    verified: true,
  },
  {
    id: "2",
    name: "Gujarat Cement Hub",
    rating: 4.6,
    materials: 15,
    city: "Surat",
    verified: true,
  },
  {
    id: "3",
    name: "Modi Steel Centre",
    rating: 4.5,
    materials: 8,
    city: "Surat",
    verified: false,
  },
];

function StatCard({
  value,
  label,
  icon,
  color,
}: {
  value: string;
  label: string;
  icon: string;
  color: string;
}) {
  return (
    <Surface
      style={[styles.statCard, { borderLeftColor: color }]}
      elevation={1}
    >
      <MaterialCommunityIcons name={icon as any} size={22} color={color} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Surface>
  );
}

function PriceChangeTag({ change }: { change: number }) {
  if (change === 0)
    return (
      <View style={[styles.changeTag, { backgroundColor: "#F3F4F6" }]}>
        <Text style={[styles.changeText, { color: "#6B7280" }]}>Stable</Text>
      </View>
    );

  const up = change > 0;
  return (
    <View
      style={[
        styles.changeTag,
        { backgroundColor: up ? COLORS.errorLight : COLORS.successLight },
      ]}
    >
      <MaterialCommunityIcons
        name={up ? "trending-up" : "trending-down"}
        size={12}
        color={up ? COLORS.error : COLORS.success}
      />
      <Text
        style={[
          styles.changeText,
          { color: up ? COLORS.error : COLORS.success },
        ]}
      >
        {Math.abs(change)}%
      </Text>
    </View>
  );
}

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("Ahmedabad");
  const theme = useTheme();
  const { resolvedScheme } = useAppTheme();
  const insets = useSafeAreaInsets();

  const isDark = resolvedScheme === "dark";
  const gradientColors = isDark
    ? (["#1E293B", "#111827"] as const)
    : (["#E6F2FF", "#F5F7FA"] as const);

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <LinearGradient
        colors={gradientColors}
        style={[
          styles.header,
          {
            paddingTop: insets.top + 16,
          },
        ]}
      >
        <View style={styles.headerTop}>
          <View>
            <Text
              style={[
                styles.headerTitle,
                { color: isDark ? "#FFFFFF" : "#1E3A8A" },
              ]}
            >
              RateGuru
            </Text>
            <Text
              style={[
                styles.headerSubtitle,
                {
                  color: isDark
                    ? "rgba(255,255,255,0.6)"
                    : "rgba(71, 85, 105, 0.8)",
                },
              ]}
            >
              Construction Price Platform
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.locationBadge,
              {
                backgroundColor: isDark
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(26, 86, 219, 0.08)",
                borderColor: isDark
                  ? "rgba(255,255,255,0.15)"
                  : "rgba(26, 86, 219, 0.15)",
                borderWidth: 1,
              },
            ]}
          >
            <MaterialCommunityIcons
              name="map-marker"
              size={14}
              color={isDark ? "#FFF" : "#1E3A8A"}
            />
            <Text
              style={[
                styles.locationText,
                { color: isDark ? "#FFF" : "#1E3A8A" },
              ]}
            >
              {selectedCity}
            </Text>
            <MaterialCommunityIcons
              name="chevron-down"
              size={14}
              color={isDark ? "#FFF" : "#1E3A8A"}
            />
          </TouchableOpacity>
        </View>

        <Searchbar
          placeholder="Search cement, steel, sand..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={[
            styles.searchBar,
            {
              backgroundColor: isDark ? "#334155" : "#FFFFFF",
              borderWidth: isDark ? 0 : 1,
              borderColor: "#E2E8F0",
            },
          ]}
          inputStyle={[
            styles.searchInput,
            { color: isDark ? "#F8FAFC" : "#0F172A" },
          ]}
          iconColor={isDark ? "#94A3B8" : "#1E3A8A"}
          placeholderTextColor={isDark ? "#94A3B8" : "#94A3B8"}
          elevation={isDark ? 0 : 1}
        />
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        <View
          style={[
            styles.contentSheet,
            { backgroundColor: theme.colors.background },
          ]}
        >
          <View style={styles.sheetHandle} />

          <View style={styles.statsRow}>
            <StatCard
              value="180+"
              label="Suppliers"
              icon="store"
              color={COLORS.primary}
            />
            <StatCard
              value="9"
              label="Categories"
              icon="package-variant"
              color={COLORS.secondary}
            />
            <StatCard
              value="Daily"
              label="Updates"
              icon="refresh"
              color={COLORS.success}
            />
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text
                style={[
                  styles.sectionTitle,
                  { color: theme.colors.onBackground },
                ]}
              >
                Browse by Category
              </Text>
              <TouchableOpacity>
                <Text style={[styles.seeAll, { color: theme.colors.primary }]}>
                  See All
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoryScroll}
            >
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.categoryItem,
                    { backgroundColor: theme.colors.surface },
                  ]}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.categoryIcon,
                      { backgroundColor: cat.color + "18" },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={cat.icon as any}
                      size={24}
                      color={cat.color}
                    />
                  </View>
                  <Text
                    style={[
                      styles.categoryLabel,
                      { color: theme.colors.onSurface },
                    ]}
                  >
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text
                style={[
                  styles.sectionTitle,
                  { color: theme.colors.onBackground },
                ]}
              >
                Today's Prices
              </Text>
              <View style={styles.updatedBadge}>
                <View style={styles.liveDot} />
                <Text style={styles.updatedText}>Live</Text>
              </View>
            </View>

            {TRENDING_PRICES.map((item) => (
              <TouchableOpacity key={item.id} activeOpacity={0.8}>
                <Surface
                  style={[
                    styles.priceCard,
                    { backgroundColor: theme.colors.surface },
                  ]}
                  elevation={1}
                >
                  <View style={styles.priceCardLeft}>
                    <Text
                      style={[
                        styles.materialName,
                        { color: theme.colors.onSurface },
                      ]}
                    >
                      {item.material}
                    </Text>
                    <Text
                      style={[
                        styles.brandName,
                        { color: theme.colors.onSurfaceVariant },
                      ]}
                    >
                      {item.brand}
                    </Text>
                    <View style={styles.supplierCount}>
                      <MaterialCommunityIcons
                        name="store-outline"
                        size={12}
                        color={theme.colors.onSurfaceVariant}
                      />
                      <Text
                        style={[
                          styles.supplierText,
                          { color: theme.colors.onSurfaceVariant },
                        ]}
                      >
                        {item.suppliers} suppliers
                      </Text>
                    </View>
                  </View>
                  <View style={styles.priceCardRight}>
                    <PriceChangeTag change={item.change} />
                    <Text
                      style={[
                        styles.priceValue,
                        { color: theme.colors.primary },
                      ]}
                    >
                      ₹{item.price.toLocaleString("en-IN")}
                    </Text>
                    <Text
                      style={[
                        styles.priceUnit,
                        { color: theme.colors.onSurfaceVariant },
                      ]}
                    >
                      /{item.unit}
                    </Text>
                  </View>
                </Surface>
              </TouchableOpacity>
            ))}
          </View>

          <View style={[styles.section, styles.lastSection]}>
            <View style={styles.sectionHeader}>
              <Text
                style={[
                  styles.sectionTitle,
                  { color: theme.colors.onBackground },
                ]}
              >
                Top Suppliers
              </Text>
              <TouchableOpacity>
                <Text style={[styles.seeAll, { color: theme.colors.primary }]}>
                  See All
                </Text>
              </TouchableOpacity>
            </View>

            {TOP_SUPPLIERS.map((supplier) => (
              <TouchableOpacity key={supplier.id} activeOpacity={0.8}>
                <Surface
                  style={[
                    styles.supplierCard,
                    { backgroundColor: theme.colors.surface },
                  ]}
                  elevation={1}
                >
                  <View
                    style={[
                      styles.supplierAvatar,
                      { backgroundColor: COLORS.primaryLight },
                    ]}
                  >
                    <Text
                      style={[
                        styles.supplierInitial,
                        { color: COLORS.primary },
                      ]}
                    >
                      {supplier.name.charAt(0)}
                    </Text>
                  </View>
                  <View style={styles.supplierInfo}>
                    <View style={styles.supplierNameRow}>
                      <Text
                        style={[
                          styles.supplierName,
                          { color: theme.colors.onSurface },
                        ]}
                      >
                        {supplier.name}
                      </Text>
                      {supplier.verified && (
                        <MaterialCommunityIcons
                          name="check-decagram"
                          size={16}
                          color={COLORS.primary}
                        />
                      )}
                    </View>
                    <View style={styles.supplierMeta}>
                      <MaterialCommunityIcons
                        name="star"
                        size={12}
                        color="#F59E0B"
                      />
                      <Text
                        style={[
                          styles.supplierMetaText,
                          { color: theme.colors.onSurfaceVariant },
                        ]}
                      >
                        {supplier.rating} · {supplier.materials} materials ·{" "}
                        {supplier.city}
                      </Text>
                    </View>
                  </View>
                  <MaterialCommunityIcons
                    name="chevron-right"
                    size={20}
                    color={theme.colors.onSurfaceVariant}
                  />
                </Surface>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 24 },

  header: {
    paddingHorizontal: 20,
    paddingBottom: 36,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  headerGreeting: { fontSize: 13, fontWeight: "600" },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.5,
    marginVertical: 2,
  },
  headerSubtitle: { fontSize: 12, fontWeight: "500" },
  locationBadge: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 4,
    marginTop: 4,
  },
  locationText: { fontSize: 13, fontWeight: "600" },

  searchBar: {
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    elevation: 0,
  },
  searchInput: { fontSize: 14 },

  scrollView: {
    marginTop: -20,
    backgroundColor: "transparent",
  },

  contentSheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 12,
    flex: 1,
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E2E8F0",
    alignSelf: "center",
    marginBottom: 16,
  },

  statsRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 8,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 12,
    borderLeftWidth: 3,
    gap: 2,
  },
  statValue: {
    fontSize: 15,
    fontWeight: "800",
    color: "#111827",
    marginTop: 4,
  },
  statLabel: { fontSize: 10, color: "#6B7280", fontWeight: "500" },

  section: { paddingHorizontal: 16, marginTop: 24 },
  lastSection: { marginBottom: 8 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  sectionTitle: { fontSize: 17, fontWeight: "700", letterSpacing: -0.3 },
  seeAll: { fontSize: 13, fontWeight: "600" },
  updatedBadge: { flexDirection: "row", alignItems: "center", gap: 5 },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.success,
  },
  updatedText: { fontSize: 12, color: COLORS.success, fontWeight: "600" },

  categoryScroll: { marginHorizontal: -16, paddingHorizontal: 16 },
  categoryItem: {
    alignItems: "center",
    marginRight: 12,
    padding: 12,
    borderRadius: 14,
    width: 80,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  categoryLabel: {
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 14,
  },

  priceCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
  },
  priceCardLeft: { flex: 1 },
  materialName: { fontSize: 14, fontWeight: "700", marginBottom: 2 },
  brandName: { fontSize: 12, marginBottom: 4 },
  supplierCount: { flexDirection: "row", alignItems: "center", gap: 4 },
  supplierText: { fontSize: 11 },
  priceCardRight: { alignItems: "flex-end", gap: 4 },
  priceValue: { fontSize: 18, fontWeight: "800" },
  priceUnit: { fontSize: 11 },
  changeTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  changeText: { fontSize: 11, fontWeight: "700" },

  supplierCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
    gap: 12,
  },
  supplierAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  supplierInitial: { fontSize: 18, fontWeight: "800" },
  supplierInfo: { flex: 1 },
  supplierNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 3,
  },
  supplierName: { fontSize: 14, fontWeight: "700" },
  supplierMeta: { flexDirection: "row", alignItems: "center", gap: 4 },
  supplierMetaText: { fontSize: 12 },
});
