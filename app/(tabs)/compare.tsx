import React, { useMemo, useState } from "react";
import { View, ScrollView, TouchableOpacity, Platform } from "react-native";
import {
  Text,
  useTheme,
  Surface,
  ActivityIndicator,
  Snackbar,
} from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { api } from "../../convex/_generated/api";
import { useRouter } from "expo-router";
import { useAppTheme } from "../../context/ThemeContext";
import { useTranslation } from "../../context/LanguageContext";
import { useCompare } from "../../context/CompareContext";
import { COLORS } from "../../constants/theme";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";
import { styles, SCREEN_WIDTH } from "../../components/styles/compareStyles";
import {
  handleCall as contactCall,
  handleWhatsApp as contactWhatsApp,
} from "../../utils/contact";
import { useOfflineCache } from "../../utils/useOfflineCache";
import type { SupplierDoc } from "../../types/convex";

const CATEGORY_ICONS: Record<string, string> = {
  Cement: "circle-outline",
  Steel: "nail",
  RMC: "truck-cargo-container",
  Sand: "wave",
  Aggregate: "terrain",
  Bricks: "wall",
};

const CATEGORY_COLORS: Record<string, string> = {
  Cement: "#6B7280",
  Steel: "#4B5563",
  RMC: "#7C3AED",
  Sand: "#D97706",
  Aggregate: "#92400E",
  Bricks: "#B91C1C",
};

const getAvatarColor = (name: string) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash % 360);
  return {
    bgLight: `hsl(${h}, 70%, 94%)`,
    textLight: `hsl(${h}, 75%, 32%)`,
    bgDark: `hsl(${h}, 60%, 16%)`,
    textDark: `hsl(${h}, 70%, 65%)`,
  };
};

function EmptyCompare({
  isDark,
  theme,
  router,
}: {
  isDark: boolean;
  theme: any;
  router: any;
}) {
  const { t } = useTranslation();
  return (
    <View style={styles.emptyWrap}>
      <View
        style={[
          styles.emptyIconCircle,
          {
            backgroundColor: isDark
              ? "rgba(79,142,247,0.12)"
              : "rgba(26,86,219,0.08)",
          },
        ]}
      >
        <MaterialCommunityIcons
          name="scale-balance"
          size={48}
          color={theme.colors.primary}
        />
      </View>
      <Text
        variant="headlineSmall"
        style={[styles.emptyTitle, { color: theme.colors.onBackground }]}
      >
        {t("noSuppliersSelected")}
      </Text>
      <Text
        variant="bodyMedium"
        style={[styles.emptyBody, { color: theme.colors.onSurfaceVariant }]}
      >
        {t("noSuppliersSelectedBody")}
      </Text>
      <TouchableOpacity
        onPress={() => router.push("/(tabs)/suppliers")}
        style={[styles.browseBtn, { backgroundColor: theme.colors.primary }]}
        activeOpacity={0.8}
      >
        <MaterialCommunityIcons name="store-search" size={18} color="#FFF" />
        <Text style={styles.browseBtnText}>{t("browseSuppliers")}</Text>
      </TouchableOpacity>
    </View>
  );
}

function NeedMoreSuppliers({
  count,
  isDark,
  theme,
}: {
  count: number;
  isDark: boolean;
  theme: any;
}) {
  const { t } = useTranslation();
  return (
    <View
      style={[
        styles.needMoreWrap,
        {
          backgroundColor: isDark
            ? "rgba(251,146,60,0.12)"
            : "rgba(249,115,22,0.08)",
          borderColor: isDark
            ? "rgba(251,146,60,0.25)"
            : "rgba(249,115,22,0.18)",
        },
      ]}
    >
      <MaterialCommunityIcons
        name="information-outline"
        size={20}
        color="#F97316"
      />
      <Text
        style={[styles.needMoreText, { color: isDark ? "#FB923C" : "#C2410C" }]}
      >
        {t("needMoreText")
          .replace("{count}", count.toString())
          .replace("{needed}", (2 - count).toString())}
      </Text>
    </View>
  );
}

export default function CompareScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { resolvedScheme } = useAppTheme();
  const { compareIds, removeFromCompare, clearCompare } = useCompare();
  const isDark = resolvedScheme === "dark";
  const { t } = useTranslation();

  const { data: allSuppliers, isLoading: suppliersLoading } = useOfflineCache(
    api.suppliers.listSuppliers,
    {},
    "@buildrate/allSuppliers"
  );

  const selectedSuppliers = useMemo(() => {
    if (!allSuppliers) return [];
    return compareIds
      .map((id) => allSuppliers.find((s: SupplierDoc) => s._id === id))
      .filter(Boolean) as typeof allSuppliers;
  }, [allSuppliers, compareIds]);

  const sup0Id = selectedSuppliers[0]?._id;
  const sup1Id = selectedSuppliers[1]?._id;
  const sup2Id = selectedSuppliers[2]?._id;

  const { data: allMaterials0 } = useOfflineCache(
    api.materials.listSupplierMaterials,
    sup0Id ? { supplierId: sup0Id } : "skip",
    sup0Id ? `@buildrate/supplierMaterials_${sup0Id}` : "@buildrate/supplierMaterials_0"
  );
  const { data: allMaterials1 } = useOfflineCache(
    api.materials.listSupplierMaterials,
    sup1Id ? { supplierId: sup1Id } : "skip",
    sup1Id ? `@buildrate/supplierMaterials_${sup1Id}` : "@buildrate/supplierMaterials_1"
  );
  const { data: allMaterials2 } = useOfflineCache(
    api.materials.listSupplierMaterials,
    sup2Id ? { supplierId: sup2Id } : "skip",
    sup2Id ? `@buildrate/supplierMaterials_${sup2Id}` : "@buildrate/supplierMaterials_2"
  );

  const supplierMaterials = [allMaterials0, allMaterials1, allMaterials2];

  const gradientColors = isDark
    ? (["#2E1B2C", "#0F172A"] as const)
    : (["#D2E9FC", "#F5F7FA"] as const);

  const colWidth = useMemo(() => {
    const count = Math.max(selectedSuppliers.length, 1);
    const totalGaps = count - 1;
    return (SCREEN_WIDTH - 40 - totalGaps * 8) / count;
  }, [selectedSuppliers.length]);

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

  const isLoading = suppliersLoading;
  const hasEnough = selectedSuppliers.length >= 2;

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
              {t("compareSuppliers")}
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
              {compareIds.length > 0
                ? t("selectedOfNSuppliers").replace("{count}", compareIds.length.toString())
                : t("selectSuppliersToCompare")}
            </Text>
          </View>

          {compareIds.length > 0 && (
            <TouchableOpacity
              onPress={clearCompare}
              style={[
                styles.clearBtn,
                {
                  backgroundColor: isDark
                    ? "rgba(239,68,68,0.15)"
                    : "rgba(220,38,38,0.08)",
                  borderColor: isDark
                    ? "rgba(239,68,68,0.3)"
                    : "rgba(220,38,38,0.15)",
                },
              ]}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons
                name="trash-can-outline"
                size={14}
                color="#DC2626"
              />
              <Text style={styles.clearBtnText}>{t("clearAll")}</Text>
            </TouchableOpacity>
          )}
        </View>

        {compareIds.length > 0 && (
          <View style={styles.pillRow}>
            {[0, 1, 2].map((i) => (
              <View
                key={i}
                style={[
                  styles.pill,
                  {
                    backgroundColor:
                      i < compareIds.length
                        ? theme.colors.primary
                        : isDark
                          ? "rgba(255,255,255,0.12)"
                          : "rgba(0,0,0,0.1)",
                  },
                ]}
              />
            ))}
          </View>
        )}
      </LinearGradient>

      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : compareIds.length === 0 ? (
        <EmptyCompare isDark={isDark} theme={theme} router={router} />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
        >
          {!hasEnough && (
            <NeedMoreSuppliers
              count={compareIds.length}
              isDark={isDark}
              theme={theme}
            />
          )}

          <View style={styles.headerCardsRow}>
            {selectedSuppliers.map((supplier: SupplierDoc) => {
              const avColors = getAvatarColor(supplier.businessName);
              const avatarBg = isDark ? avColors.bgDark : avColors.bgLight;
              const avatarText = isDark
                ? avColors.textDark
                : avColors.textLight;

              return (
                <Surface
                  key={supplier._id}
                  style={[
                    styles.supplierCard,
                    {
                      width: colWidth,
                      backgroundColor: theme.colors.surface,
                    },
                  ]}
                  elevation={2}
                >
                  <TouchableOpacity
                    onPress={() =>
                      router.push({
                        pathname: "/supplier-detail",
                        params: { id: supplier._id },
                      })
                    }
                    activeOpacity={0.7}
                    style={{ alignItems: "center", width: "100%" }}
                  >
                    <View
                      style={[
                        styles.avatarCircle,
                        { backgroundColor: avatarBg },
                      ]}
                    >
                      <Text
                        style={[styles.avatarLetter, { color: avatarText }]}
                      >
                        {supplier.businessName.charAt(0).toUpperCase()}
                      </Text>
                    </View>

                    <Text
                      style={[
                        styles.supplierName,
                        { color: theme.colors.onSurface },
                      ]}
                      numberOfLines={2}
                    >
                      {supplier.businessName}
                    </Text>

                    {supplier.verified && (
                      <MaterialCommunityIcons
                        name="check-decagram"
                        size={14}
                        color={COLORS.primary}
                        style={{ marginTop: 3 }}
                      />
                    )}

                    <View style={styles.cityRow}>
                      <MaterialCommunityIcons
                        name="map-marker"
                        size={11}
                        color={theme.colors.onSurfaceVariant}
                      />
                      <Text
                        style={[
                          styles.cityText,
                          { color: theme.colors.onSurfaceVariant },
                        ]}
                        numberOfLines={1}
                      >
                        {supplier.area}
                      </Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => removeFromCompare(supplier._id)}
                    style={[
                      styles.removeBtn,
                      {
                        backgroundColor: isDark
                          ? "rgba(239,68,68,0.18)"
                          : "rgba(220,38,38,0.1)",
                      },
                    ]}
                    activeOpacity={0.8}
                    hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
                  >
                    <MaterialCommunityIcons
                      name="close"
                      size={14}
                      color="#DC2626"
                    />
                  </TouchableOpacity>

                  <View style={styles.quickContactRow}>
                    <TouchableOpacity
                      onPress={() => handleCall(supplier.phone)}
                      style={[
                        styles.callBtn,
                        { backgroundColor: theme.colors.primary },
                      ]}
                      activeOpacity={0.8}
                    >
                      <MaterialCommunityIcons
                        name="phone"
                        size={14}
                        color="#FFF"
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() =>
                        handleWhatsApp(supplier.phone, supplier.businessName)
                      }
                      style={styles.waBtn}
                      activeOpacity={0.8}
                    >
                      <MaterialCommunityIcons
                        name="whatsapp"
                        size={14}
                        color="#25D366"
                      />
                    </TouchableOpacity>
                  </View>
                </Surface>
              );
            })}
          </View>

          {hasEnough && (
            <>
              <CompareSection
                title={t("materialsSupplied")}
                icon="package-variant"
                isDark={isDark}
                theme={theme}
                collapsible={true}
                defaultCollapsed={true}
              >
                <View style={styles.materialsGridRow}>
                  {selectedSuppliers.map((supplier: SupplierDoc) => (
                    <View
                      key={supplier._id}
                      style={[styles.materialsCol, { width: colWidth }]}
                    >
                      {supplier.categories.map((cat: string) => {
                        const icon = CATEGORY_ICONS[cat] ?? "circle-outline";
                        const color = CATEGORY_COLORS[cat] ?? "#6B7280";
                        return (
                          <View
                            key={cat}
                            style={[
                              styles.catChip,
                              {
                                backgroundColor: isDark
                                  ? "rgba(255,255,255,0.05)"
                                  : "rgba(0,0,0,0.04)",
                              },
                            ]}
                          >
                            <MaterialCommunityIcons
                              name={icon as any}
                              size={12}
                              color={color}
                            />
                            <Text
                              style={[
                                styles.catChipText,
                                { color: theme.colors.onSurface },
                              ]}
                            >
                              {cat}
                            </Text>
                          </View>
                        );
                      })}
                    </View>
                  ))}
                </View>
              </CompareSection>

              <CompareSection
                title={t("priceCatalog")}
                icon="tag-multiple-outline"
                isDark={isDark}
                theme={theme}
              >
                {supplierMaterials
                  .slice(0, selectedSuppliers.length)
                  .some((m) => m === undefined) ? (
                  <ActivityIndicator
                    color={theme.colors.primary}
                    style={{ padding: 16 }}
                  />
                ) : (
                  <PriceCompareTable
                    suppliers={selectedSuppliers}
                    supplierMaterials={
                      supplierMaterials.slice(
                        0,
                        selectedSuppliers.length,
                      ) as any[]
                    }
                    isDark={isDark}
                    theme={theme}
                    colWidth={colWidth}
                  />
                )}
              </CompareSection>
            </>
          )}
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

function CompareSection({
  title,
  icon,
  isDark,
  theme,
  children,
  collapsible = false,
  defaultCollapsed = false,
}: {
  title: string;
  icon: string;
  isDark: boolean;
  theme: any;
  children: React.ReactNode;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}) {
  const [isCollapsed, setIsCollapsed] = useState(
    collapsible && defaultCollapsed,
  );

  const HeaderContent = (
    <View
      style={[
        styles.sectionHeader,
        {
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          marginBottom: isCollapsed ? 0 : 10,
        },
      ]}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <MaterialCommunityIcons
          name={icon as any}
          size={16}
          color={theme.colors.primary}
        />
        <Text
          style={[
            styles.sectionTitle,
            { color: theme.colors.onSurfaceVariant },
          ]}
        >
          {title}
        </Text>
      </View>
      {collapsible && (
        <MaterialCommunityIcons
          name={isCollapsed ? "chevron-down" : "chevron-up"}
          size={18}
          color={theme.colors.onSurfaceVariant}
        />
      )}
    </View>
  );

  return (
    <Animated.View layout={LinearTransition} style={styles.sectionWrap}>
      {collapsible ? (
        <TouchableOpacity
          onPress={() => setIsCollapsed(!isCollapsed)}
          activeOpacity={0.7}
          style={{ width: "100%" }}
        >
          {HeaderContent}
        </TouchableOpacity>
      ) : (
        HeaderContent
      )}
      {!isCollapsed && (
        <Animated.View
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(150)}
        >
          <View
            style={[
              styles.sectionSurface,
              {
                backgroundColor: theme.colors.surface,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.08,
                shadowRadius: 2,
                elevation: 1,
              },
            ]}
          >
            {children}
          </View>
        </Animated.View>
      )}
    </Animated.View>
  );
}

function CompareRow({
  label,
  icon,
  values,
  isDark,
  theme,
  colWidth,
  highlightBest,
  isLast,
  hideLabel,
}: {
  label: string;
  icon: string;
  values: string[];
  isDark: boolean;
  theme: any;
  colWidth: number;
  highlightBest?: (vals: string[]) => boolean[];
  isLast?: boolean;
  hideLabel?: boolean;
}) {
  const highlights = highlightBest
    ? highlightBest(values)
    : values.map(() => false);

  return (
    <View
      style={[
        styles.compareRowWrap,
        {
          borderBottomColor: isDark
            ? "rgba(255,255,255,0.05)"
            : "rgba(0,0,0,0.04)",
          borderBottomWidth: isLast ? 0 : 1,
        },
      ]}
    >
      {!hideLabel && (
        <View style={styles.compareRowLabel}>
          <MaterialCommunityIcons
            name={icon as any}
            size={13}
            color={theme.colors.onSurfaceVariant}
          />
          <Text
            style={[
              styles.compareRowLabelText,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            {label}
          </Text>
        </View>
      )}

      <View style={styles.compareRowValues}>
        {values.map((val, i) => {
          const isHighlighted = highlights[i];
          return (
            <View
              key={i}
              style={[
                styles.compareValueCell,
                {
                  width: colWidth,
                  backgroundColor: isHighlighted
                    ? isDark
                      ? "rgba(26,86,219,0.15)"
                      : "rgba(26,86,219,0.07)"
                    : "transparent",
                },
              ]}
            >
              <Text
                style={[
                  styles.compareValueText,
                  {
                    fontSize: 12,
                    color: isHighlighted
                      ? theme.colors.primary
                      : theme.colors.onSurface,
                    fontWeight: isHighlighted ? "700" : "500",
                  },
                ]}
                numberOfLines={2}
              >
                {val}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

function PriceCompareTable({
  suppliers,
  supplierMaterials,
  isDark,
  theme,
  colWidth,
}: {
  suppliers: any[];
  supplierMaterials: any[][];
  isDark: boolean;
  theme: any;
  colWidth: number;
}) {
  const { t } = useTranslation();

  const allItems = useMemo(() => {
    const seen = new Set<string>();
    const items: {
      category: string;
      name: string;
      brand: string;
      key: string;
    }[] = [];
    for (const mats of supplierMaterials) {
      if (!mats) continue;
      for (const m of mats) {
        const normCategory = m.category.toLowerCase().trim();
        const normName = m.name.toLowerCase().trim();
        const normBrand = m.brand.toLowerCase().trim();
        const matchKey = `${normCategory}__${normName}__${normBrand}`;
        if (!seen.has(matchKey)) {
          seen.add(matchKey);
          items.push({
            category: m.category,
            name: m.name,
            brand: m.brand,
            key: matchKey,
          });
        }
      }
    }
    return items;
  }, [supplierMaterials]);

  const grouped = useMemo(() => {
    const map: Record<
      string,
      {
        category: string;
        name: string;
        brand: string;
        key: string;
      }[]
    > = {};
    for (const item of allItems) {
      if (!map[item.category]) map[item.category] = [];
      map[item.category].push(item);
    }
    return map;
  }, [allItems]);

  if (allItems.length === 0) {
    return (
      <View style={styles.priceEmptyWrap}>
        <MaterialCommunityIcons
          name="package-variant-closed-remove"
          size={36}
          color={theme.colors.onSurfaceVariant}
        />
        <Text
          style={[
            styles.priceEmptyText,
            { color: theme.colors.onSurfaceVariant },
          ]}
        >
          {t("noPricesListed")}
        </Text>
      </View>
    );
  }

  return (
    <View>
      {Object.entries(grouped).map(([category, items]) => (
        <View key={category}>
          <View
            style={[
              styles.categorySubHeader,
              {
                backgroundColor: isDark
                  ? "rgba(255,255,255,0.04)"
                  : "rgba(0,0,0,0.03)",
              },
            ]}
          >
            <MaterialCommunityIcons
              name={(CATEGORY_ICONS[category] ?? "circle-outline") as any}
              size={13}
              color={CATEGORY_COLORS[category] ?? "#6B7280"}
            />
            <Text
              style={[
                styles.categorySubHeaderText,
                {
                  color:
                    CATEGORY_COLORS[category] ?? theme.colors.onSurfaceVariant,
                },
              ]}
            >
              {category}
            </Text>
          </View>

          {items.map((item, itemIdx) => {
            const matchingMats = suppliers.map((_, idx) => {
              const mats = supplierMaterials[idx];
              if (!mats) return [];
              return mats.filter(
                (m: any) =>
                  m.category.toLowerCase().trim() ===
                    item.category.toLowerCase().trim() &&
                  m.name.toLowerCase().trim() ===
                    item.name.toLowerCase().trim() &&
                  m.brand.toLowerCase().trim() ===
                    item.brand.toLowerCase().trim(),
              );
            });

            const minPricesByUnit: Record<string, number> = {};
            const unitCounts: Record<string, number> = {};

            for (const mats of matchingMats) {
              for (const m of mats) {
                const u = m.unit.toLowerCase().trim();
                const p = m.price;
                if (
                  minPricesByUnit[u] === undefined ||
                  p < minPricesByUnit[u]
                ) {
                  minPricesByUnit[u] = p;
                }
                unitCounts[u] = (unitCounts[u] || 0) + 1;
              }
            }

            return (
              <View
                key={item.key}
                style={[
                  styles.priceRow,
                  {
                    borderBottomColor: isDark
                      ? "rgba(255,255,255,0.04)"
                      : "rgba(0,0,0,0.04)",
                    borderBottomWidth: itemIdx === items.length - 1 ? 0 : 1,
                  },
                ]}
              >
                <View style={{ marginBottom: 6 }}>
                  <Text
                    style={[
                      styles.priceRowName,
                      { color: theme.colors.onSurface, marginBottom: 2 },
                    ]}
                  >
                    {item.name}
                  </Text>
                  {item.brand ? (
                    <Text
                      style={{
                        fontSize: 12,
                        color: isDark ? "#FB923C" : "#D97706",
                        fontWeight: "600",
                      }}
                    >
                      Brand: {item.brand}
                    </Text>
                  ) : null}
                </View>

                <View style={styles.priceRowValues}>
                  {matchingMats.map((matsForSupplier, i) => {
                    const hasAnyBest = matsForSupplier.some((m: any) => {
                      const u = m.unit.toLowerCase().trim();
                      return (
                        unitCounts[u] > 1 && m.price === minPricesByUnit[u]
                      );
                    });
                    const isAvailable = matsForSupplier.length > 0;

                    return (
                      <View
                        key={i}
                        style={[
                          styles.priceCell,
                          {
                            width: colWidth,
                            backgroundColor: hasAnyBest
                              ? isDark
                                ? "rgba(22,163,74,0.18)"
                                : "rgba(22,163,74,0.1)"
                              : !isAvailable
                                ? isDark
                                  ? "rgba(255,255,255,0.03)"
                                  : "rgba(0,0,0,0.02)"
                                : "transparent",
                          },
                        ]}
                      >
                        {isAvailable ? (
                          <View
                            style={{
                              gap: 4,
                              width: "100%",
                              alignItems: "center",
                            }}
                          >
                            {matsForSupplier.map((m: any, mIdx: number) => {
                              const u = m.unit.toLowerCase().trim();
                              const isBest =
                                unitCounts[u] > 1 &&
                                m.price === minPricesByUnit[u];
                              return (
                                <View
                                  key={mIdx}
                                  style={{
                                    alignItems: "center",
                                    width: "100%",
                                  }}
                                >
                                  <Text
                                    style={[
                                      styles.priceValue,
                                      {
                                        fontSize: 12,
                                        color: isBest
                                          ? "#16A34A"
                                          : theme.colors.onSurface,
                                      },
                                    ]}
                                  >
                                    ₹{m.price.toLocaleString("en-IN")}{" "}
                                    <Text
                                      style={{
                                        fontSize: 10,
                                        fontWeight: "400",
                                        color: isBest
                                          ? "#16A34A"
                                          : theme.colors.onSurfaceVariant,
                                      }}
                                    >
                                      / {m.unit}
                                    </Text>
                                  </Text>
                                  {isBest && (
                                    <View style={styles.bestPriceRow}>
                                      <MaterialCommunityIcons
                                        name="trophy-outline"
                                        size={9}
                                        color="#16A34A"
                                      />
                                      <Text
                                        style={[
                                          styles.bestPriceText,
                                          { fontSize: 8 },
                                        ]}
                                      >
                                        {t("bestPrice")}
                                      </Text>
                                    </View>
                                  )}
                                </View>
                              );
                            })}
                          </View>
                        ) : (
                          <Text
                            style={[
                              styles.noPrice,
                              {
                                color: theme.colors.onSurfaceVariant,
                                textAlign: "center",
                                width: "100%",
                              },
                            ]}
                          >
                            —
                          </Text>
                        )}
                      </View>
                    );
                  })}
                </View>
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
}
