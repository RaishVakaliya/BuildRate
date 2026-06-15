import React, { useState, useMemo } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
  Keyboard,
  Image,
} from "react-native";
import { styles } from "../../components/styles/homeStyles";
import {
  Text,
  Searchbar,
  useTheme,
  ActivityIndicator,
  Snackbar,
} from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { COLORS } from "../../constants/theme";
import { useAppTheme } from "../../context/ThemeContext";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useRouter } from "expo-router";

const CATEGORIES = [
  { id: "1", label: "Cement", icon: "circle-outline", color: "#6B7280" },
  { id: "2", label: "Steel", icon: "nail", color: "#4B5563" },
  { id: "3", label: "RMC", icon: "truck-cargo-container", color: "#7C3AED" },
  { id: "4", label: "Sand", icon: "wave", color: "#D97706" },
  { id: "5", label: "Aggregate", icon: "terrain", color: "#92400E" },
  { id: "6", label: "Bricks", icon: "wall", color: "#B91C1C" },
];

function StatCard({
  value,
  label,
  icon,
  color,
  onPress,
  loading,
}: {
  value: string;
  label: string;
  icon: string;
  color: string;
  onPress?: () => void;
  loading?: boolean;
}) {
  const theme = useTheme();
  const CardComponent = onPress ? TouchableOpacity : View;

  return (
    <CardComponent
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.7}
      style={[
        styles.statCard,
        {
          backgroundColor: theme.colors.surface,
          borderLeftColor: color,
        },
      ]}
    >
      {loading ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            minHeight: 48,
          }}
        >
          <ActivityIndicator size="small" color={color} />
        </View>
      ) : (
        <>
          <MaterialCommunityIcons name={icon as any} size={22} color={color} />
          <Text style={[styles.statValue, { color: theme.colors.onSurface }]}>
            {value}
          </Text>
          <Text
            style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}
          >
            {label}
          </Text>
        </>
      )}
    </CardComponent>
  );
}

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity] = useState("Ahmedabad");
  const theme = useTheme();
  const { resolvedScheme } = useAppTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [isUpdating, setIsUpdating] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleDailyUpdatesPress = () => {
    if (isUpdating) return;
    setIsUpdating(true);
    setTimeout(() => {
      setIsUpdating(false);
      setSnackbarMessage("Prices and supplier listings are up to date!");
      setSnackbarVisible(true);
    }, 1000);
  };

  const isDark = resolvedScheme === "dark";
  const gradientColors = isDark
    ? (["#2E1B2C", "#0F172A"] as const)
    : (["#D2E9FC", "#F5F7FA"] as const);

  const allMaterials = useQuery(api.materials.listAllMaterials);
  const allSuppliers = useQuery(api.suppliers.listSuppliers);

  const categoryLowestPrices = useMemo(() => {
    if (!allMaterials) return [];

    const lowestByCategory: Record<string, any> = {};

    for (const m of allMaterials) {
      const cat = m.category;
      if (!lowestByCategory[cat] || m.price < lowestByCategory[cat].price) {
        lowestByCategory[cat] = m;
      }
    }

    return Object.values(lowestByCategory).sort((a: any, b: any) =>
      a.category.localeCompare(b.category),
    );
  }, [allMaterials]);

  // Find supplier count offering the exact material name, brand, and unit
  const getSupplierCount = (item: any) => {
    if (!allMaterials) return 0;
    const normName = item.name.toLowerCase().trim();
    const normBrand = item.brand.toLowerCase().trim();
    const normUnit = item.unit.toLowerCase().trim();
    return allMaterials.filter(
      (m) =>
        m.category === item.category &&
        m.name.toLowerCase().trim() === normName &&
        m.brand.toLowerCase().trim() === normBrand &&
        m.unit.toLowerCase().trim() === normUnit,
    ).length;
  };

  const topSuppliers = useMemo(() => {
    if (!allSuppliers || !allMaterials) return [];

    const materialCounts: Record<string, number> = {};
    for (const m of allMaterials) {
      materialCounts[m.supplierId] = (materialCounts[m.supplierId] || 0) + 1;
    }

    const suppliersWithCounts = allSuppliers.map((s) => ({
      ...s,
      materialCount: materialCounts[s._id] || 0,
    }));

    return suppliersWithCounts
      .sort((a, b) => b.materialCount - a.materialCount)
      .slice(0, 3);
  }, [allSuppliers, allMaterials]);

  const filteredMaterials = useMemo(() => {
    if (!searchQuery.trim() || !allMaterials) return [];
    const q = searchQuery.toLowerCase().trim();
    return allMaterials.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.brand.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q),
    );
  }, [searchQuery, allMaterials]);

  const filteredSuppliers = useMemo(() => {
    if (!searchQuery.trim() || !allSuppliers || !allMaterials) return [];
    const q = searchQuery.toLowerCase().trim();

    const materialCounts: Record<string, number> = {};
    for (const m of allMaterials) {
      materialCounts[m.supplierId] = (materialCounts[m.supplierId] || 0) + 1;
    }

    return allSuppliers
      .filter(
        (s) =>
          s.businessName.toLowerCase().includes(q) ||
          s.city.toLowerCase().includes(q),
      )
      .map((s) => ({
        ...s,
        materialCount: materialCounts[s._id] || 0,
      }));
  }, [searchQuery, allSuppliers, allMaterials]);

  const isLoading = allMaterials === undefined || allSuppliers === undefined;

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
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Image
              source={require("../../assets/CustomSplashScreenImage.png")}
              style={{ width: 44, height: 48 }}
              alt="BuildRate logo"
            />
            <View>
              <Text
                style={[
                  styles.headerTitle,
                  { color: isDark ? "#FFFFFF" : "#1E3A8A" },
                ]}
              >
                BuildRate
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
          </View>
          <View
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
          </View>
        </View>

        <Searchbar
          placeholder="Search cement, steel, sand..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          onSubmitEditing={() => {
            Keyboard.dismiss();
          }}
          style={[
            styles.searchBar,
            {
              backgroundColor: theme.colors.surface,
              elevation: isDark ? 0 : 2,
              borderWidth: isDark ? 1 : 0,
              borderColor: theme.colors.outline,
            },
          ]}
          inputStyle={[{ color: theme.colors.onSurface }]}
          iconColor={theme.colors.onSurfaceVariant}
          placeholderTextColor={theme.colors.onSurfaceVariant}
        />

        <View style={styles.popularRow}>
          <Text
            style={[
              styles.popularTitle,
              {
                color: isDark
                  ? "rgba(255,255,255,0.6)"
                  : "rgba(71, 85, 105, 0.8)",
              },
            ]}
          >
            Popular:
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8 }}
          >
            {["Cement", "Steel", "Sand", "M35 Grade", "TMT Bar"].map((tag) => (
              <TouchableOpacity
                key={tag}
                activeOpacity={0.7}
                onPress={() => setSearchQuery(tag)}
                style={[
                  styles.popularTag,
                  {
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.06)"
                      : "rgba(26, 86, 219, 0.05)",
                    borderColor: isDark
                      ? "rgba(255,255,255,0.15)"
                      : "rgba(26, 86, 219, 0.15)",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.popularTagText,
                    { color: isDark ? "#FFF" : "#1E3A8A" },
                  ]}
                >
                  {tag}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
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

          {searchQuery.trim().length > 0 ? (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text
                  style={[
                    styles.sectionTitle,
                    { color: theme.colors.onBackground },
                  ]}
                >
                  Search Results for "{searchQuery}"
                </Text>
                <TouchableOpacity onPress={() => setSearchQuery("")}>
                  <Text
                    style={[styles.seeAll, { color: theme.colors.primary }]}
                  >
                    Clear
                  </Text>
                </TouchableOpacity>
              </View>

              {isLoading ? (
                <ActivityIndicator
                  size="small"
                  color={theme.colors.primary}
                  style={{ marginVertical: 40 }}
                />
              ) : filteredMaterials.length === 0 &&
                filteredSuppliers.length === 0 ? (
                <View style={{ alignItems: "center", paddingVertical: 60 }}>
                  <MaterialCommunityIcons
                    name="cloud-search-outline"
                    size={64}
                    color={theme.colors.onSurfaceVariant}
                    style={{ marginBottom: 16, opacity: 0.5 }}
                  />
                  <Text
                    style={{
                      color: theme.colors.onSurface,
                      fontSize: 16,
                      fontWeight: "700",
                      marginBottom: 6,
                    }}
                  >
                    No matches found
                  </Text>
                  <Text
                    style={{
                      color: theme.colors.onSurfaceVariant,
                      fontSize: 13,
                      textAlign: "center",
                      paddingHorizontal: 32,
                      lineHeight: 18,
                    }}
                  >
                    We couldn't find any materials or suppliers matching "
                    {searchQuery}".
                  </Text>
                </View>
              ) : (
                <>
                  {filteredMaterials.length > 0 && (
                    <View style={{ marginBottom: 24 }}>
                      <Text
                        style={{
                          fontSize: 13,
                          fontWeight: "800",
                          color: theme.colors.primary,
                          marginBottom: 12,
                          textTransform: "uppercase",
                          letterSpacing: 1,
                        }}
                      >
                        Materials ({filteredMaterials.length})
                      </Text>
                      {filteredMaterials.map((item) => {
                        const sCount = getSupplierCount(item);
                        return (
                          <TouchableOpacity
                            key={item._id}
                            activeOpacity={0.8}
                            onPress={() =>
                              router.push({
                                pathname: "/(tabs)/materials",
                                params: {
                                  category: item.category,
                                  search: item.name,
                                },
                              })
                            }
                          >
                            <View
                              style={[
                                styles.priceCard,
                                { backgroundColor: theme.colors.surface },
                              ]}
                            >
                              <View style={styles.priceCardLeft}>
                                <Text
                                  style={[
                                    styles.materialName,
                                    { color: theme.colors.onSurface },
                                  ]}
                                >
                                  {item.name}
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
                                    {sCount} supplier{sCount !== 1 ? "s" : ""}{" "}
                                    offer this
                                  </Text>
                                </View>
                              </View>
                              <View style={styles.priceCardRight}>
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
                            </View>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  )}

                  {filteredSuppliers.length > 0 && (
                    <View style={{ marginBottom: 24 }}>
                      <Text
                        style={{
                          fontSize: 13,
                          fontWeight: "800",
                          color: theme.colors.primary,
                          marginBottom: 12,
                          textTransform: "uppercase",
                          letterSpacing: 1,
                        }}
                      >
                        Suppliers ({filteredSuppliers.length})
                      </Text>
                      {filteredSuppliers.map((supplier) => (
                        <TouchableOpacity
                          key={supplier._id}
                          activeOpacity={0.8}
                          onPress={() =>
                            router.push({
                              pathname: "/supplier-detail",
                              params: { id: supplier._id },
                            })
                          }
                        >
                          <View
                            style={[
                              styles.supplierCard,
                              { backgroundColor: theme.colors.surface },
                            ]}
                          >
                            <View
                              style={[
                                styles.supplierAvatar,
                                {
                                  backgroundColor: isDark
                                    ? "rgba(255,255,255,0.06)"
                                    : COLORS.primaryLight,
                                },
                              ]}
                            >
                              <Text
                                style={[
                                  styles.supplierInitial,
                                  {
                                    color: isDark ? "#4F8EF7" : COLORS.primary,
                                  },
                                ]}
                              >
                                {supplier.businessName.charAt(0).toUpperCase()}
                              </Text>
                            </View>
                            <View style={styles.supplierInfo}>
                              <View style={styles.supplierNameRow}>
                                <Text
                                  style={[
                                    styles.supplierName,
                                    { color: theme.colors.onSurface },
                                  ]}
                                  numberOfLines={1}
                                >
                                  {supplier.businessName}
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
                                <Text
                                  style={[
                                    styles.supplierMetaText,
                                    { color: theme.colors.onSurfaceVariant },
                                  ]}
                                >
                                  {supplier.materialCount} material
                                  {supplier.materialCount !== 1
                                    ? "s"
                                    : ""} · {supplier.city}
                                </Text>
                              </View>
                            </View>
                            <MaterialCommunityIcons
                              name="chevron-right"
                              size={20}
                              color={theme.colors.onSurfaceVariant}
                            />
                          </View>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </>
              )}
            </View>
          ) : (
            <>
              <View style={styles.statsRow}>
                <StatCard
                  value={allSuppliers ? `${allSuppliers.length}` : "—"}
                  label="Suppliers"
                  icon="store"
                  color={COLORS.primary}
                  onPress={() => router.push("/(tabs)/suppliers")}
                />
                <StatCard
                  value={`${CATEGORIES.length}`}
                  label="Categories"
                  icon="package-variant"
                  color={COLORS.secondary}
                  onPress={() => router.push("/(tabs)/materials")}
                />
                <StatCard
                  value="Daily"
                  label="Updates"
                  icon="refresh"
                  color={COLORS.success}
                  onPress={handleDailyUpdatesPress}
                  loading={isUpdating}
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
                  <TouchableOpacity
                    onPress={() => router.push("/(tabs)/materials")}
                  >
                    <Text
                      style={[styles.seeAll, { color: theme.colors.primary }]}
                    >
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
                      onPress={() =>
                        router.push({
                          pathname: "/(tabs)/materials",
                          params: { category: cat.label },
                        })
                      }
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
                    Today's Lowest Prices
                  </Text>
                  <View style={styles.updatedBadge}>
                    <View style={styles.liveDot} />
                    <Text style={styles.updatedText}>Live</Text>
                  </View>
                </View>

                {isLoading ? (
                  <ActivityIndicator
                    size="small"
                    color={theme.colors.primary}
                    style={{ marginVertical: 20 }}
                  />
                ) : categoryLowestPrices.length === 0 ? (
                  <Text
                    style={{
                      color: theme.colors.onSurfaceVariant,
                      textAlign: "center",
                      marginVertical: 16,
                      fontSize: 13,
                    }}
                  >
                    No material prices listed yet.
                  </Text>
                ) : (
                  categoryLowestPrices.map((item) => {
                    const sCount = getSupplierCount(item);
                    return (
                      <TouchableOpacity
                        key={item._id}
                        activeOpacity={0.8}
                        onPress={() =>
                          router.push({
                            pathname: "/(tabs)/materials",
                            params: {
                              category: item.category,
                              search: item.name,
                            },
                          })
                        }
                      >
                        <View
                          style={[
                            styles.priceCard,
                            { backgroundColor: theme.colors.surface },
                          ]}
                        >
                          <View style={styles.priceCardLeft}>
                            <Text
                              style={[
                                styles.materialName,
                                { color: theme.colors.onSurface },
                              ]}
                            >
                              {item.name}
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
                                {sCount} supplier{sCount !== 1 ? "s" : ""} offer
                                this
                              </Text>
                            </View>
                          </View>
                          <View style={styles.priceCardRight}>
                            <View
                              style={[
                                styles.changeTag,
                                {
                                  backgroundColor: isDark
                                    ? "rgba(22,163,74,0.15)"
                                    : COLORS.successLight,
                                },
                              ]}
                            >
                              <Text
                                style={[
                                  styles.changeText,
                                  {
                                    color: isDark ? "#4ADE80" : COLORS.success,
                                  },
                                ]}
                              >
                                Lowest
                              </Text>
                            </View>
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
                        </View>
                      </TouchableOpacity>
                    );
                  })
                )}
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
                  <TouchableOpacity
                    onPress={() => router.push("/(tabs)/suppliers")}
                  >
                    <Text
                      style={[styles.seeAll, { color: theme.colors.primary }]}
                    >
                      See All
                    </Text>
                  </TouchableOpacity>
                </View>

                {isLoading ? (
                  <ActivityIndicator
                    size="small"
                    color={theme.colors.primary}
                    style={{ marginVertical: 20 }}
                  />
                ) : topSuppliers.length === 0 ? (
                  <Text
                    style={{
                      color: theme.colors.onSurfaceVariant,
                      textAlign: "center",
                      marginVertical: 16,
                      fontSize: 13,
                    }}
                  >
                    No suppliers registered yet.
                  </Text>
                ) : (
                  topSuppliers.map((supplier) => (
                    <TouchableOpacity
                      key={supplier._id}
                      activeOpacity={0.8}
                      onPress={() =>
                        router.push({
                          pathname: "/supplier-detail",
                          params: { id: supplier._id },
                        })
                      }
                    >
                      <View
                        style={[
                          styles.supplierCard,
                          { backgroundColor: theme.colors.surface },
                        ]}
                      >
                        <View
                          style={[
                            styles.supplierAvatar,
                            {
                              backgroundColor: isDark
                                ? "rgba(255,255,255,0.06)"
                                : COLORS.primaryLight,
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.supplierInitial,
                              { color: isDark ? "#4F8EF7" : COLORS.primary },
                            ]}
                          >
                            {supplier.businessName.charAt(0).toUpperCase()}
                          </Text>
                        </View>
                        <View style={styles.supplierInfo}>
                          <View style={styles.supplierNameRow}>
                            <Text
                              style={[
                                styles.supplierName,
                                { color: theme.colors.onSurface },
                              ]}
                              numberOfLines={1}
                            >
                              {supplier.businessName}
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
                            <Text
                              style={[
                                styles.supplierMetaText,
                                { color: theme.colors.onSurfaceVariant },
                              ]}
                            >
                              {supplier.materialCount} material
                              {supplier.materialCount !== 1 ? "s" : ""} ·{" "}
                              {supplier.city}
                            </Text>
                          </View>
                        </View>
                        <MaterialCommunityIcons
                          name="chevron-right"
                          size={20}
                          color={theme.colors.onSurfaceVariant}
                        />
                      </View>
                    </TouchableOpacity>
                  ))
                )}
              </View>
            </>
          )}
        </View>
      </ScrollView>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={2500}
        style={{ marginBottom: Platform.OS === "ios" ? -4 : -20 }}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
}
