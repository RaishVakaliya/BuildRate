import React, { useMemo, useState } from "react";
import { View, ScrollView, TouchableOpacity, Platform } from "react-native";
import {
  Text,
  Searchbar,
  useTheme,
  Surface,
  ActivityIndicator,
  Snackbar,
} from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { api } from "../../convex/_generated/api";
import { useRouter, useLocalSearchParams } from "expo-router";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";
import { useAppTheme } from "../../context/ThemeContext";
import { useTranslation } from "../../context/LanguageContext";
import { useCompare } from "../../context/CompareContext";
import { styles } from "../../components/styles/materialsStyles";
import { COLORS } from "../../constants/theme";
import {
  handleCall as contactCall,
  handleWhatsApp as contactWhatsApp,
} from "../../utils/contact";
import { useOfflineCache } from "../../utils/useOfflineCache";
import type { SupplierDoc } from "../../types/convex";

const AnimatedSurface = Animated.createAnimatedComponent(Surface);

const CHIPS = ["All", "Cement", "Steel", "RMC", "Sand", "Aggregate", "Bricks"];

const CATEGORY_MAP: Record<string, { color: string; icon: string }> = {
  Cement: { color: "#6B7280", icon: "circle-outline" },
  Steel: { color: "#4B5563", icon: "nail" },
  RMC: { color: "#7C3AED", icon: "truck-cargo-container" },
  Sand: { color: "#D97706", icon: "wave" },
  Aggregate: { color: "#92400E", icon: "terrain" },
  Bricks: { color: "#B91C1C", icon: "wall" },
};

export default function MaterialsScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { resolvedScheme } = useAppTheme();
  const isDark = resolvedScheme === "dark";
  const { t } = useTranslation();

  const { compareIds, addToCompare, removeFromCompare } = useCompare();

  const { data: allMaterials, isLoading: materialsLoading } = useOfflineCache(
    api.materials.listAllMaterials,
    {},
    "@buildrate/allMaterials"
  );
  const { data: allSuppliers, isLoading: suppliersLoading } = useOfflineCache(
    api.suppliers.listSuppliers,
    {},
    "@buildrate/allSuppliers"
  );

  const { category: paramCategory, search: paramSearch } =
    useLocalSearchParams<{ category?: string; search?: string }>();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [expandedKey, setExpandedKey] = useState<string | null>(null);

  React.useEffect(() => {
    if (paramCategory && CHIPS.includes(paramCategory)) {
      setSelectedCategory(paramCategory);
      setExpandedKey(null);
    } else if (!paramCategory) {
      setSelectedCategory("All");
      setExpandedKey(null);
    }
  }, [paramCategory]);

  React.useEffect(() => {
    if (paramSearch !== undefined) {
      setSearchQuery(paramSearch);
    } else {
      setSearchQuery("");
    }
  }, [paramSearch]);

  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const showToast = (msg: string) => {
    setSnackbarMessage(msg);
    setSnackbarVisible(true);
  };

  const handleCall = (phone: string) => {
    contactCall(phone, showToast);
  };

  const handleWhatsApp = (phone: string, businessName: string) => {
    contactWhatsApp(phone, businessName, showToast);
  };

  const toggleExpand = (key: string) => {
    setExpandedKey((prev) => (prev === key ? null : key));
  };

  const gradientColors = isDark
    ? (["#2E1B2C", "#0F172A"] as const)
    : (["#D2E9FC", "#F5F7FA"] as const);

  const groupedMaterials = useMemo(() => {
    if (!allMaterials) return [];

    const groups: Record<
      string,
      {
        category: string;
        name: string;
        brand: string;
        unit: string;
        key: string;
        minPrice: number;
        maxPrice: number;
        offers: {
          materialId: string;
          supplierId: string;
          price: number;
          status: "available" | "out_of_stock";
          notes?: string;
        }[];
      }
    > = {};

    for (const m of allMaterials) {
      const normCat = m.category.toLowerCase().trim();
      const normName = m.name.toLowerCase().trim();
      const normBrand = m.brand.toLowerCase().trim();
      const normUnit = m.unit.toLowerCase().trim();
      const groupKey = `${normCat}__${normName}__${normBrand}__${normUnit}`;

      if (!groups[groupKey]) {
        groups[groupKey] = {
          category: m.category,
          name: m.name,
          brand: m.brand,
          unit: m.unit,
          key: groupKey,
          minPrice: m.price,
          maxPrice: m.price,
          offers: [],
        };
      }

      groups[groupKey].offers.push({
        materialId: m._id,
        supplierId: m.supplierId,
        price: m.price,
        status: m.status,
        notes: m.notes,
      });

      if (m.price < groups[groupKey].minPrice) {
        groups[groupKey].minPrice = m.price;
      }
      if (m.price > groups[groupKey].maxPrice) {
        groups[groupKey].maxPrice = m.price;
      }
    }

    return Object.values(groups);
  }, [allMaterials]);

  const filteredMaterials = useMemo(() => {
    let result = groupedMaterials;

    if (selectedCategory !== "All") {
      result = result.filter(
        (g) => g.category.toLowerCase() === selectedCategory.toLowerCase(),
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (g) =>
          g.name.toLowerCase().includes(q) || g.brand.toLowerCase().includes(q),
      );
    }

    // Sort alphabetically by category first, then by material name
    return [...result].sort((a, b) => {
      if (a.category !== b.category) {
        return a.category.localeCompare(b.category);
      }
      return a.name.localeCompare(b.name);
    });
  }, [groupedMaterials, selectedCategory, searchQuery]);

  const isLoading = materialsLoading || suppliersLoading;

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
      <LinearGradient
        colors={gradientColors}
        style={[styles.header, { paddingTop: insets.top + 16 }]}
      >
        <View style={styles.headerRow}>
          <View>
            <Text
              style={[
                styles.headerTitle,
                { color: isDark ? "#FFFFFF" : "#1E3A8A" },
              ]}
            >
            {t("materialCatalog")}
            </Text>
            <Text
              style={[
                styles.headerSub,
                {
                  color: isDark
                    ? "rgba(255,255,255,0.55)"
                    : "rgba(71,85,105,0.8)",
                },
              ]}
            >
              {t("browseLivePricing")}
            </Text>
          </View>
        </View>

        <Searchbar
          placeholder={t("searchMaterialsBrands")}
          onChangeText={setSearchQuery}
          value={searchQuery}
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
      </LinearGradient>

      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.catScroll}
          contentContainerStyle={{ paddingRight: 40 }}
        >
          {CHIPS.map((chip) => {
            const isSelected = selectedCategory === chip;
            const chipDetails = CATEGORY_MAP[chip];
            const chipColor = chipDetails?.color ?? theme.colors.primary;

            return (
              <TouchableOpacity
                key={chip}
                onPress={() => {
                  setSelectedCategory(chip);
                  setExpandedKey(null);
                }}
                style={[
                  styles.catChip,
                  {
                    backgroundColor: isSelected
                      ? theme.colors.primary
                      : isDark
                        ? "rgba(255,255,255,0.05)"
                        : "rgba(0,0,0,0.04)",
                    borderColor: isSelected
                      ? theme.colors.primary
                      : isDark
                        ? "rgba(255,255,255,0.1)"
                        : "rgba(0,0,0,0.08)",
                  },
                ]}
                activeOpacity={0.8}
              >
                {chipDetails && (
                  <MaterialCommunityIcons
                    name={chipDetails.icon as any}
                    size={12}
                    color={isSelected ? "#FFF" : chipColor}
                    style={{ marginRight: 4 }}
                  />
                )}
                <Text
                  style={[
                    styles.catChipText,
                    {
                      color: isSelected ? "#FFF" : theme.colors.onSurface,
                    },
                  ]}
                >
                  {chip}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : filteredMaterials.length === 0 ? (
        <View style={styles.emptyWrap}>
          <MaterialCommunityIcons
            name="package-variant-closed-remove"
            size={64}
            color={theme.colors.onSurfaceVariant}
          />
          <Text style={[styles.emptyTitle, { color: theme.colors.onSurface }]}>
            {t("noMaterialsFound")}
          </Text>
          <Text
            style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}
          >
            {t("noMaterialsFoundSubtitle")}
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={[
            styles.listContainer,
            { paddingBottom: insets.bottom + 24 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {filteredMaterials.map((item) => {
            const isExpanded = expandedKey === item.key;
            const catDetails = CATEGORY_MAP[item.category];
            const catColor = catDetails?.color ?? "#6B7280";
            const catIcon = catDetails?.icon ?? "circle-outline";

            const priceStr =
              item.minPrice === item.maxPrice
                ? `₹${item.minPrice.toLocaleString("en-IN")}`
                : `₹${item.minPrice.toLocaleString("en-IN")} - ₹${item.maxPrice.toLocaleString("en-IN")}`;

            return (
              <AnimatedSurface
                key={item.key}
                style={[
                  styles.materialCard,
                  { backgroundColor: theme.colors.surface },
                ]}
                elevation={1}
                layout={LinearTransition.duration(200)}
              >
                <TouchableOpacity
                  onPress={() => toggleExpand(item.key)}
                  activeOpacity={0.7}
                  style={styles.cardMain}
                >
                  <View
                    style={[
                      styles.iconWrap,
                      { backgroundColor: catColor + "15" },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={catIcon as any}
                      size={20}
                      color={catColor}
                    />
                  </View>

                  <View style={styles.materialInfo}>
                    <View style={styles.nameRow}>
                      <Text
                        style={[
                          styles.matName,
                          { color: theme.colors.onSurface },
                        ]}
                      >
                        {item.name}
                      </Text>
                      <View
                        style={[
                          styles.catBadge,
                          { backgroundColor: catColor + "20" },
                        ]}
                      >
                        <Text
                          style={[styles.catBadgeText, { color: catColor }]}
                        >
                          {item.category}
                        </Text>
                      </View>
                    </View>
                    <Text
                      style={[
                        styles.brandText,
                        { color: theme.colors.onSurfaceVariant },
                      ]}
                    >
                      {t("brandPrefix")} {item.brand}
                    </Text>
                    <View style={styles.offersCount}>
                      <MaterialCommunityIcons
                        name="store-outline"
                        size={12}
                        color={theme.colors.primary}
                      />
                      <Text
                        style={[
                          styles.offersText,
                          { color: theme.colors.primary, fontWeight: "600" },
                        ]}
                      >
                        {item.offers.length} {item.offers.length > 1 ? t("suppliersPlural") : t("supplierSingular")}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.priceInfo}>
                    <Text
                      style={[
                        styles.priceRange,
                        { color: theme.colors.onSurface },
                      ]}
                    >
                      {priceStr}
                    </Text>
                    <Text
                      style={[
                        styles.priceUnit,
                        { color: theme.colors.onSurfaceVariant },
                      ]}
                    >
                      {t("per")} {item.unit}
                    </Text>
                  </View>

                  <MaterialCommunityIcons
                    name={isExpanded ? "chevron-up" : "chevron-down"}
                    size={20}
                    color={theme.colors.onSurfaceVariant}
                    style={{ marginLeft: 8 }}
                  />
                </TouchableOpacity>

                {isExpanded && (
                  <Animated.View
                    entering={FadeIn.duration(200)}
                    exiting={FadeOut.duration(200)}
                    style={[
                      styles.expandedPanel,
                      {
                        borderTopColor: isDark
                          ? "rgba(255,255,255,0.06)"
                          : "rgba(0,0,0,0.04)",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.expandedTitle,
                        { color: theme.colors.onSurfaceVariant },
                      ]}
                    >
                      {t("supplierOffers")}
                    </Text>

                    {item.offers.map((offer, index) => {
                      const supplier = allSuppliers.find(
                        (s: SupplierDoc) => s._id === offer.supplierId,
                      );
                      if (!supplier) return null;

                      const isAvailable = offer.status === "available";
                      const isInCompare = compareIds.includes(supplier._id);

                      return (
                        <View
                          key={offer.materialId}
                          style={[
                            styles.offerRow,
                            {
                              borderBottomColor: isDark
                                ? "rgba(255,255,255,0.04)"
                                : "rgba(0,0,0,0.03)",
                              borderBottomWidth:
                                index === item.offers.length - 1 ? 0 : 1,
                            },
                          ]}
                        >
                          <View style={styles.supplierInfo}>
                            <TouchableOpacity
                              onPress={() =>
                                router.push({
                                  pathname: "/supplier-detail",
                                  params: { id: supplier._id },
                                })
                              }
                              activeOpacity={0.7}
                            >
                              <View style={styles.supplierNameRow}>
                                <Text
                                  style={[
                                    styles.supplierName,
                                    { color: theme.colors.onSurface },
                                  ]}
                                >
                                  {supplier.businessName}
                                </Text>
                                {supplier.verified && (
                                  <MaterialCommunityIcons
                                    name="check-decagram"
                                    size={14}
                                    color={COLORS.primary}
                                  />
                                )}
                              </View>
                              <View style={styles.supplierCityRow}>
                                <MaterialCommunityIcons
                                  name="map-marker"
                                  size={10}
                                  color={theme.colors.onSurfaceVariant}
                                />
                                <Text
                                  style={[
                                    styles.supplierCity,
                                    { color: theme.colors.onSurfaceVariant },
                                  ]}
                                >
                                  {supplier.area}
                                </Text>
                              </View>
                            </TouchableOpacity>

                            <View style={styles.offerActions}>
                              <TouchableOpacity
                                onPress={() => handleCall(supplier.phone)}
                                style={[
                                  styles.actionCircleBtn,
                                  { backgroundColor: "rgba(26,86,219,0.08)" },
                                ]}
                                activeOpacity={0.75}
                              >
                                <MaterialCommunityIcons
                                  name="phone"
                                  size={14}
                                  color={theme.colors.primary}
                                />
                              </TouchableOpacity>

                              <TouchableOpacity
                                onPress={() =>
                                  handleWhatsApp(
                                    supplier.phone,
                                    supplier.businessName,
                                  )
                                }
                                style={[
                                  styles.actionCircleBtn,
                                  { backgroundColor: "#25D36618" },
                                ]}
                                activeOpacity={0.75}
                              >
                                <MaterialCommunityIcons
                                  name="whatsapp"
                                  size={15}
                                  color="#25D366"
                                />
                              </TouchableOpacity>

                              <TouchableOpacity
                                onPress={() => {
                                  if (isInCompare) {
                                    removeFromCompare(supplier._id);
                                    showToast("Removed from comparison.");
                                  } else {
                                    const result = addToCompare(supplier._id);
                                    showToast(result.message);
                                  }
                                }}
                                style={[
                                  styles.compareBtn,
                                  {
                                    backgroundColor: isInCompare
                                      ? "rgba(22,163,74,0.08)"
                                      : "rgba(26,86,219,0.08)",
                                  },
                                ]}
                                activeOpacity={0.75}
                              >
                                <MaterialCommunityIcons
                                  name={
                                    isInCompare
                                      ? "check-circle"
                                      : "scale-balance"
                                  }
                                  size={12}
                                  color={
                                    isInCompare
                                      ? "#16A34A"
                                      : theme.colors.primary
                                  }
                                />
                                <Text
                                  style={[
                                    styles.compareBtnText,
                                    {
                                      color: isInCompare
                                        ? "#16A34A"
                                        : theme.colors.primary,
                                    },
                                  ]}
                                >
                                  {isInCompare ? t("inCompare") : t("compare")}
                                </Text>
                              </TouchableOpacity>
                            </View>
                          </View>

                          <View style={styles.offerRight}>
                            <Text
                              style={[
                                styles.offerPrice,
                                { color: theme.colors.primary },
                              ]}
                            >
                              ₹{offer.price.toLocaleString("en-IN")}
                            </Text>
                            <Text
                              style={[
                                styles.offerStatus,
                                { color: isAvailable ? "#16A34A" : "#DC2626" },
                              ]}
                            >
                              {isAvailable ? t("available") : t("outOfStock")}
                            </Text>
                          </View>
                        </View>
                      );
                    })}
                  </Animated.View>
                )}
              </AnimatedSurface>
            );
          })}
        </ScrollView>
      )}

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
