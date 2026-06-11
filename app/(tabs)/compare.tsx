import React, { useMemo } from "react";
import { View, ScrollView, TouchableOpacity, Linking } from "react-native";
import { Text, useTheme, Surface, ActivityIndicator } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useQuery } from "convex/react";
import { useRouter } from "expo-router";
import { api } from "../../convex/_generated/api";
import { useAppTheme } from "../../context/ThemeContext";
import { useCompare } from "../../context/CompareContext";
import { COLORS } from "../../constants/theme";
import { styles, SCREEN_WIDTH } from "../../components/styles/compareStyles";

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
        No Suppliers Selected
      </Text>
      <Text
        variant="bodyMedium"
        style={[styles.emptyBody, { color: theme.colors.onSurfaceVariant }]}
      >
        Go to the Suppliers tab and tap{" "}
        <Text style={{ color: theme.colors.primary, fontWeight: "600" }}>
          Compare
        </Text>{" "}
        on 2 to 3 suppliers to compare them side by side.
      </Text>
      <TouchableOpacity
        onPress={() => router.push("/(tabs)/suppliers")}
        style={[styles.browseBtn, { backgroundColor: theme.colors.primary }]}
        activeOpacity={0.8}
      >
        <MaterialCommunityIcons name="store-search" size={18} color="#FFF" />
        <Text style={styles.browseBtnText}>Browse Suppliers</Text>
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
        You have {count} supplier selected. Add at least {2 - count} more to
        start comparing.
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

  const allSuppliers = useQuery(api.suppliers.listSuppliers);

  const selectedSuppliers = useMemo(() => {
    if (!allSuppliers) return [];
    return compareIds
      .map((id) => allSuppliers.find((s) => s._id === id))
      .filter(Boolean) as typeof allSuppliers;
  }, [allSuppliers, compareIds]);

  const allMaterials0 = useQuery(
    api.materials.listSupplierMaterials,
    selectedSuppliers[0] ? { supplierId: selectedSuppliers[0]._id } : "skip",
  );
  const allMaterials1 = useQuery(
    api.materials.listSupplierMaterials,
    selectedSuppliers[1] ? { supplierId: selectedSuppliers[1]._id } : "skip",
  );
  const allMaterials2 = useQuery(
    api.materials.listSupplierMaterials,
    selectedSuppliers[2] ? { supplierId: selectedSuppliers[2]._id } : "skip",
  );

  const supplierMaterials = [allMaterials0, allMaterials1, allMaterials2];

  const gradientColors = isDark
    ? (["#1A2540", "#0F172A"] as const)
    : (["#E6F2FF", "#F5F7FA"] as const);

  const colWidth = useMemo(() => {
    const count = Math.max(selectedSuppliers.length, 1);
    const totalGaps = count - 1;
    return (SCREEN_WIDTH - 40 - totalGaps * 8) / count;
  }, [selectedSuppliers.length]);

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone.replace(/\s+/g, "")}`).catch(() => {});
  };

  const handleWhatsApp = (phone: string, businessName: string) => {
    const cleanPhone = phone.replace(/[^\d+]/g, "");
    const message = encodeURIComponent(
      `Hello ${businessName}, I found your listing on RateGuru and would like to inquire about material prices.`,
    );
    Linking.openURL(
      `whatsapp://send?phone=${cleanPhone}&text=${message}`,
    ).catch(() =>
      Linking.openURL(`https://wa.me/${cleanPhone}?text=${message}`).catch(
        () => {},
      ),
    );
  };

  const isLoading = allSuppliers === undefined;
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
              Compare Suppliers
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
                ? `${compareIds.length} of 3 supplier${compareIds.length > 1 ? "s" : ""} selected`
                : "Select 2–3 suppliers to compare"}
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
              <Text style={styles.clearBtnText}>Clear All</Text>
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
            {selectedSuppliers.map((supplier) => {
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
                  >
                    <MaterialCommunityIcons
                      name="close"
                      size={14}
                      color="#DC2626"
                    />
                  </TouchableOpacity>

                  <View
                    style={[styles.avatarCircle, { backgroundColor: avatarBg }]}
                  >
                    <Text style={[styles.avatarLetter, { color: avatarText }]}>
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
                      {supplier.city}
                    </Text>
                  </View>

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
                title="Materials Supplied"
                icon="package-variant"
                isDark={isDark}
                theme={theme}
              >
                <View style={styles.materialsGridRow}>
                  {selectedSuppliers.map((supplier) => (
                    <View
                      key={supplier._id}
                      style={[styles.materialsCol, { width: colWidth }]}
                    >
                      {supplier.categories.map((cat) => {
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
                title="Price Catalog"
                icon="tag-multiple-outline"
                isDark={isDark}
                theme={theme}
              >
                {supplierMaterials.some((m) => m === undefined) ? (
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
    </View>
  );
}

function CompareSection({
  title,
  icon,
  isDark,
  theme,
  children,
}: {
  title: string;
  icon: string;
  isDark: boolean;
  theme: any;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.sectionWrap}>
      <View style={styles.sectionHeader}>
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
      <Surface
        style={[
          styles.sectionSurface,
          { backgroundColor: theme.colors.surface },
        ]}
        elevation={1}
      >
        {children}
      </Surface>
    </View>
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
  const allItems = useMemo(() => {
    const seen = new Set<string>();
    const items: { category: string; name: string; key: string }[] = [];
    for (const mats of supplierMaterials) {
      if (!mats) continue;
      for (const m of mats) {
        const key = `${m.category}__${m.name}`;
        if (!seen.has(key)) {
          seen.add(key);
          items.push({ category: m.category, name: m.name, key });
        }
      }
    }
    return items;
  }, [supplierMaterials]);

  const grouped = useMemo(() => {
    const map: Record<
      string,
      { category: string; name: string; key: string }[]
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
          No material prices listed for these suppliers yet.
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
            const prices: (number | null)[] = suppliers.map((_, idx) => {
              const mats = supplierMaterials[idx];
              if (!mats) return null;
              const found = mats.find(
                (m: any) =>
                  m.category === item.category && m.name === item.name,
              );
              return found ? found.price : null;
            });

            const validPrices = prices.filter((p): p is number => p !== null);
            const minPrice =
              validPrices.length > 0 ? Math.min(...validPrices) : null;

            const unitStr = (() => {
              for (let idx = 0; idx < suppliers.length; idx++) {
                const mats = supplierMaterials[idx];
                if (!mats) continue;
                const found = mats.find(
                  (m: any) =>
                    m.category === item.category && m.name === item.name,
                );
                if (found?.unit) return found.unit;
              }
              return "";
            })();

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
                <Text
                  style={[
                    styles.priceRowName,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  {item.name}
                  {unitStr ? (
                    <Text style={styles.priceRowUnit}> / {unitStr}</Text>
                  ) : null}
                </Text>

                <View style={styles.priceRowValues}>
                  {prices.map((price, i) => {
                    const isBest =
                      price !== null &&
                      price === minPrice &&
                      validPrices.length > 1;
                    const isAvailable = price !== null;

                    return (
                      <View
                        key={i}
                        style={[
                          styles.priceCell,
                          {
                            width: colWidth,
                            backgroundColor: isBest
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
                          <View>
                            <Text
                              style={[
                                styles.priceValue,
                                {
                                  color: isBest
                                    ? "#16A34A"
                                    : theme.colors.onSurface,
                                },
                              ]}
                            >
                              ₹{price.toLocaleString("en-IN")}
                            </Text>
                            {isBest && (
                              <View style={styles.bestPriceRow}>
                                <MaterialCommunityIcons
                                  name="trophy-outline"
                                  size={10}
                                  color="#16A34A"
                                />
                                <Text style={styles.bestPriceText}>
                                  BEST PRICE
                                </Text>
                              </View>
                            )}
                          </View>
                        ) : (
                          <Text
                            style={[
                              styles.noPrice,
                              { color: theme.colors.onSurfaceVariant },
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
