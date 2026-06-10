import React, { useState, useMemo } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Linking,
  Platform,
} from "react-native";
import {
  Text,
  Searchbar,
  useTheme,
  Surface,
  ActivityIndicator,
  Button,
  Snackbar,
} from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAppTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "expo-router";
import { styles } from "../../components/styles/suppliersStyles";
import { COLORS } from "../../constants/theme";

const CATEGORIES = [
  { label: "All", icon: "apps", color: "#1A56DB" },
  { label: "Cement", icon: "circle-outline", color: "#6B7280" },
  { label: "Steel", icon: "nail", color: "#4B5563" },
  { label: "RMC", icon: "truck-cargo-container", color: "#7C3AED" },
  { label: "Sand", icon: "wave", color: "#D97706" },
  { label: "Aggregate", icon: "terrain", color: "#92400E" },
  { label: "Bricks", icon: "wall", color: "#B91C1C" },
];

const STATUS_COLOR: Record<string, { bg: string; text: string; icon: string }> =
  {
    active: { bg: "#DCFCE7", text: "#16A34A", icon: "check-circle" },
    suspended: { bg: "#FEE2E2", text: "#DC2626", icon: "cancel" },
    pending: { bg: "#FEF3C7", text: "#D97706", icon: "clock-outline" },
  };

const CATEGORY_ICONS: Record<string, string> = {
  Cement: "circle-outline",
  Steel: "nail",
  RMC: "truck-cargo-container",
  Sand: "wave",
  Aggregate: "terrain",
  Bricks: "wall",
};

const getAvatarColor = (name: string) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash % 360);
  return {
    h,
    bgLight: `hsl(${h}, 70%, 94%)`,
    textLight: `hsl(${h}, 75%, 32%)`,
    bgDark: `hsl(${h}, 60%, 16%)`,
    textDark: `hsl(${h}, 70%, 65%)`,
  };
};

export default function SuppliersScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { resolvedScheme } = useAppTheme();
  const { user } = useAuth();
  const isDark = resolvedScheme === "dark";

  const suppliers = useQuery(api.suppliers.listSuppliers);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [adminStatusFilter, setAdminStatusFilter] = useState<
    "all" | "active" | "suspended" | "pending"
  >("all");
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const showToast = (msg: string) => {
    setSnackbarMessage(msg);
    setSnackbarVisible(true);
  };

  const gradientColors = isDark
    ? (["#1A2540", "#0F172A"] as const)
    : (["#E6F2FF", "#F5F7FA"] as const);

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone.replace(/\s+/g, "")}`).catch(() => {});
  };

  const handleEmail = (email: string, businessName: string) => {
    Linking.openURL(
      `mailto:${email}?subject=Inquiry from RateGuru to ${businessName}`,
    ).catch(() => {});
  };

  const handleWhatsApp = (phone: string, businessName: string) => {
    const cleanPhone = phone.replace(/[^\d+]/g, "");
    const message = encodeURIComponent(
      `Hello ${businessName}, I found your listing on RateGuru and would like to inquire about material prices.`,
    );
    const url = `whatsapp://send?phone=${cleanPhone}&text=${message}`;
    Linking.openURL(url).catch(() => {
      Linking.openURL(`https://wa.me/${cleanPhone}?text=${message}`).catch(
        () => {},
      );
    });
  };

  const filteredSuppliers = useMemo(() => {
    if (!suppliers) return [];

    return suppliers.filter((supplier) => {
      if (user?.role !== "admin") {
        if (supplier.status !== "active") return false;
      } else {
        if (
          adminStatusFilter !== "all" &&
          supplier.status !== adminStatusFilter
        )
          return false;
      }

      const queryLower = searchQuery.toLowerCase().trim();
      if (queryLower) {
        const matchName = supplier.businessName
          .toLowerCase()
          .includes(queryLower);
        const matchCity = supplier.city.toLowerCase().includes(queryLower);
        const matchPhone = supplier.phone.includes(queryLower);
        if (!matchName && !matchCity && !matchPhone) return false;
      }

      if (selectedCategory !== "All") {
        if (!supplier.categories.includes(selectedCategory)) return false;
      }

      return true;
    });
  }, [suppliers, user, searchQuery, selectedCategory, adminStatusFilter]);

  const sortedSuppliers = useMemo(() => {
    if (user?.role === "supplier" && user?.id) {
      const listCopy = [...filteredSuppliers];
      const myIndex = listCopy.findIndex((s) => s._id === user.id);
      if (myIndex !== -1) {
        const [mySupplier] = listCopy.splice(myIndex, 1);
        return [mySupplier, ...listCopy];
      }
    }
    return filteredSuppliers;
  }, [filteredSuppliers, user]);

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
      <LinearGradient
        colors={gradientColors}
        style={[styles.header, { paddingTop: insets.top + 16 }]}
      >
        <View style={styles.headerTitleRow}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <Text
              style={[
                styles.headerTitle,
                { color: isDark ? "#FFFFFF" : "#1E3A8A" },
              ]}
            >
              Suppliers Directory
            </Text>
            <Text
              style={[
                styles.headerSub,
                {
                  color: isDark
                    ? "rgba(255,255,255,0.6)"
                    : "rgba(71,85,105,0.8)",
                },
              ]}
            >
              Find and contact verified providers
            </Text>
          </View>
          {user?.role === "admin" && (
            <TouchableOpacity
              onPress={() => router.push("/admin")}
              style={[
                styles.adminGoBtn,
                { backgroundColor: isDark ? "#4F8EF7" : "#1A56DB", alignSelf: "center" },
              ]}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons
                name="shield-crown"
                size={14}
                color="#FFF"
              />
              <Text style={styles.adminGoText}>Admin Panel</Text>
            </TouchableOpacity>
          )}
          {user?.role === "supplier" && (
            <Surface
              style={[
                styles.roleBadge,
                {
                  backgroundColor: isDark
                    ? "rgba(34,197,94,0.15)"
                    : "rgba(22,163,74,0.08)",
                },
              ]}
              elevation={0}
            >
              <MaterialCommunityIcons
                name="store"
                size={14}
                color={isDark ? "#4ADE80" : "#16A34A"}
              />
              <Text
                style={[
                  styles.roleBadgeText,
                  { color: isDark ? "#4ADE80" : "#16A34A" },
                ]}
              >
                Supplier View
              </Text>
            </Surface>
          )}
        </View>

        <Searchbar
          placeholder="Search by name, city, or phone..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={[
            styles.searchbar,
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

      {/* Horizontal Category Scroll */}
      <View style={{ backgroundColor: theme.colors.background }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
          contentContainerStyle={styles.categoryScrollContent}
        >
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.label;
            const chipBg = isSelected
              ? isDark
                ? "rgba(79,142,247,0.15)"
                : "rgba(26,86,219,0.08)"
              : theme.colors.surface;
            const chipBorder = isSelected
              ? isDark
                ? "#4F8EF7"
                : "#1A56DB"
              : theme.colors.outline;
            const chipTextColor = isSelected
              ? isDark
                ? "#4F8EF7"
                : "#1A56DB"
              : theme.colors.onSurfaceVariant;

            return (
              <TouchableOpacity
                key={cat.label}
                onPress={() => setSelectedCategory(cat.label)}
                style={[
                  styles.categoryChip,
                  {
                    backgroundColor: chipBg,
                    borderColor: chipBorder,
                    borderWidth: 1.5,
                  },
                ]}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons
                  name={cat.icon as any}
                  size={16}
                  color={
                    isSelected ? (isDark ? "#4F8EF7" : "#1A56DB") : cat.color
                  }
                />
                <Text
                  style={[styles.categoryChipText, { color: chipTextColor }]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Admin-only Status Filters */}
      {user?.role === "admin" && (
        <View style={styles.adminFiltersWrap}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.adminFiltersContent}
          >
            {(["all", "active", "suspended", "pending"] as const).map(
              (status) => {
                const isActive = adminStatusFilter === status;
                return (
                  <TouchableOpacity
                    key={status}
                    onPress={() => setAdminStatusFilter(status)}
                    style={[
                      styles.adminFilterChip,
                      {
                        backgroundColor: isActive
                          ? theme.colors.primary
                          : theme.colors.surface,
                        borderColor: isActive
                          ? theme.colors.primary
                          : theme.colors.outline,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.adminFilterChipText,
                        { color: isActive ? "#FFF" : theme.colors.onSurface },
                      ]}
                    >
                      {status.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                );
              },
            )}
          </ScrollView>
        </View>
      )}

      {/* Supplier List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.listContent,
          {
            paddingBottom: insets.bottom + 24,
            paddingTop: user?.role === "admin" ? 8 : 16,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {suppliers === undefined ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        ) : sortedSuppliers.length === 0 ? (
          <View style={styles.emptyWrap}>
            <MaterialCommunityIcons
              name="store-off-outline"
              size={64}
              color={theme.colors.onSurfaceVariant}
            />
            <Text
              style={[styles.emptyTitle, { color: theme.colors.onBackground }]}
            >
              No Suppliers Found
            </Text>
            <Text
              style={[
                styles.emptySubtitle,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              Try adjustments to your search queries or selected categories.
            </Text>
          </View>
        ) : (
          sortedSuppliers.map((supplier) => {
            const isMyBusiness =
              user?.role === "supplier" && user?.id === supplier._id;
            const avColors = getAvatarColor(supplier.businessName);
            const avatarBg = isDark ? avColors.bgDark : avColors.bgLight;
            const avatarText = isDark ? avColors.textDark : avColors.textLight;
            const initial = supplier.businessName.charAt(0).toUpperCase();
            const stBadge =
              STATUS_COLOR[supplier.status] ?? STATUS_COLOR.active;

            return (
              <Surface
                key={supplier._id}
                style={[
                  styles.card,
                  {
                    backgroundColor: theme.colors.surface,
                    borderColor: isMyBusiness
                      ? theme.colors.primary
                      : isDark
                        ? "rgba(255,255,255,0.05)"
                        : "rgba(0,0,0,0.03)",
                    borderWidth: isMyBusiness ? 2 : 1,
                  },
                ]}
                elevation={isMyBusiness ? 2 : 1}
              >
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: "/supplier-detail",
                      params: { id: supplier._id },
                    })
                  }
                  activeOpacity={0.7}
                  style={styles.cardPressable}
                >
                  <View style={styles.cardHeader}>
                    <View
                      style={[styles.avatarCircle, { backgroundColor: avatarBg }]}
                    >
                      <Text style={[styles.avatarLetter, { color: avatarText }]}>
                        {initial}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <View style={styles.nameRow}>
                        <Text
                          style={[
                            styles.businessName,
                            { color: theme.colors.onSurface },
                          ]}
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
                      <View style={styles.subInfoRow}>
                        <MaterialCommunityIcons
                          name="map-marker"
                          size={14}
                          color={theme.colors.onSurfaceVariant}
                        />
                        <Text
                          style={[
                            styles.cityText,
                            { color: theme.colors.onSurfaceVariant },
                          ]}
                        >
                          {supplier.city}
                        </Text>
                      </View>
                    </View>

                    {/* Top-Right Badge Indicators */}
                    <View style={{ alignItems: "flex-end", gap: 6 }}>
                      {isMyBusiness && (
                        <Surface style={styles.myBusinessBadge} elevation={0}>
                          <Text style={styles.myBusinessBadgeText}>
                            My Business
                          </Text>
                        </Surface>
                      )}
                      {user?.role === "admin" && (
                        <View
                          style={[
                            styles.adminStatusBadge,
                            { backgroundColor: stBadge.bg },
                          ]}
                        >
                          <MaterialCommunityIcons
                            name={stBadge.icon as any}
                            size={10}
                            color={stBadge.text}
                          />
                          <Text
                            style={[
                              styles.adminStatusBadgeText,
                              { color: stBadge.text },
                            ]}
                          >
                            {supplier.status.toUpperCase()}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>

                  {/* Categories Badge List */}
                  <View style={[styles.categoryWrap, { marginTop: 12 }]}>
                    {supplier.categories.map((cat) => {
                      const matchedCat = CATEGORIES.find((c) => c.label === cat);
                      const catColor =
                        matchedCat?.color ?? theme.colors.onSurfaceVariant;
                      const catIcon = matchedCat?.icon ?? "circle-outline";

                      return (
                        <View
                          key={cat}
                          style={[
                            styles.catChip,
                            {
                              backgroundColor: isDark
                                ? "rgba(255,255,255,0.06)"
                                : "rgba(0,0,0,0.04)",
                            },
                          ]}
                        >
                          <MaterialCommunityIcons
                            name={catIcon as any}
                            size={11}
                            color={catColor}
                          />
                          <Text
                            style={[
                              styles.catText,
                              { color: theme.colors.onSurface },
                            ]}
                          >
                            {cat}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                </TouchableOpacity>

                {/* Compare & contact action buttons */}
                <View style={styles.cardFooterActions}>
                  <TouchableOpacity
                    style={styles.compareBtn}
                    onPress={() => showToast("Comparison feature coming soon!")}
                    activeOpacity={0.7}
                  >
                    <MaterialCommunityIcons
                      name="scale-balance"
                      size={16}
                      color={theme.colors.primary}
                    />
                    <Text
                      style={[
                        styles.compareBtnText,
                        { color: theme.colors.primary },
                      ]}
                    >
                      Compare
                    </Text>
                  </TouchableOpacity>

                  <View style={styles.contactActionRow}>
                    <TouchableOpacity
                      style={[
                        styles.contactCircleBtn,
                        {
                          backgroundColor: isDark
                            ? "rgba(255,255,255,0.06)"
                            : "rgba(0,0,0,0.04)",
                        },
                      ]}
                      onPress={() =>
                        handleEmail(supplier.email, supplier.businessName)
                      }
                      activeOpacity={0.75}
                    >
                      <MaterialCommunityIcons
                        name="email"
                        size={18}
                        color={theme.colors.primary}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.contactCircleBtn,
                        { backgroundColor: "#25D3661B" },
                      ]}
                      onPress={() =>
                        handleWhatsApp(supplier.phone, supplier.businessName)
                      }
                      activeOpacity={0.75}
                    >
                      <MaterialCommunityIcons
                        name="whatsapp"
                        size={20}
                        color="#25D366"
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.contactCallBtn,
                        { backgroundColor: theme.colors.primary },
                      ]}
                      onPress={() => handleCall(supplier.phone)}
                      activeOpacity={0.75}
                    >
                      <MaterialCommunityIcons
                        name="phone"
                        size={16}
                        color="#FFF"
                      />
                      <Text style={styles.contactCallText}>Call</Text>
                    </TouchableOpacity>

                  </View>
                </View>
              </Surface>
            );
          })
        )}
      </ScrollView>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={2500}
        style={{ marginBottom: insets.bottom > 0 ? insets.bottom + 8 : 16 }}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
}


