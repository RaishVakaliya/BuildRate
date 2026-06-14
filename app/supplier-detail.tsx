import React, { useState, useMemo, useEffect } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Linking,
  Platform,
  Share,
  Clipboard,
} from "react-native";
import { styles } from "../components/styles/supplierDetailStyles";
import {
  Text,
  useTheme,
  Surface,
  ActivityIndicator,
  Snackbar,
  Button,
} from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useQuery } from "convex/react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { api } from "../convex/_generated/api";
import { useAppTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useCompare } from "../context/CompareContext";
import { COLORS } from "../constants/theme";
import {
  handleCall as contactCall,
  handleEmail as contactEmail,
  handleWhatsApp as contactWhatsApp,
} from "../utils/contact";

const CATEGORY_DETAILS: Record<string, { color: string; icon: string }> = {
  Cement: { color: "#6B7280", icon: "circle-outline" },
  Steel: { color: "#4B5563", icon: "nail" },
  RMC: { color: "#7C3AED", icon: "truck-cargo-container" },
  Sand: { color: "#D97706", icon: "wave" },
  Aggregate: { color: "#92400E", icon: "terrain" },
  Bricks: { color: "#B91C1C", icon: "wall" },
};

const STATUS_DETAILS: Record<
  string,
  { bg: string; text: string; icon: string }
> = {
  active: { bg: "#DCFCE7", text: "#16A34A", icon: "check-circle" },
  suspended: { bg: "#FEE2E2", text: "#DC2626", icon: "cancel" },
  pending: { bg: "#FEF3C7", text: "#D97706", icon: "clock-outline" },
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

export default function SupplierDetailScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { resolvedScheme } = useAppTheme();
  const { user } = useAuth();
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();
  const isDark = resolvedScheme === "dark";

  const supplier = useQuery(
    api.suppliers.getSupplier,
    id ? { id: id as any } : ("skip" as any),
  );

  const materials = useQuery(
    api.materials.listSupplierMaterials,
    id ? { supplierId: id as any } : "skip",
  );

  const materialCategories = useMemo(() => {
    if (!materials) return [];
    const cats = new Set<string>();
    materials.forEach((m) => cats.add(m.category));
    return Array.from(cats);
  }, [materials]);

  const [selectedMatCat, setSelectedMatCat] = useState<string | null>(null);

  useEffect(() => {
    if (materialCategories.length > 0 && !selectedMatCat) {
      setSelectedMatCat(materialCategories[0]);
    }
  }, [materialCategories, selectedMatCat]);

  const displayedMaterials = useMemo(() => {
    if (!materials || !selectedMatCat) return [];
    return materials.filter((m) => m.category === selectedMatCat);
  }, [materials, selectedMatCat]);

  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const gradientColors = isDark
    ? (["#2E1B2C", "#0F172A"] as const)
    : (["#E6F2FF", "#F5F7FA"] as const);

  const showToast = (msg: string) => {
    setSnackbarMessage(msg);
    setSnackbarVisible(true);
  };

  const handleCall = (phone: string) => {
    contactCall(phone, showToast);
  };

  const handleEmail = (email: string, businessName: string) => {
    contactEmail(email, businessName, showToast);
  };

  const handleWhatsApp = (phone: string, businessName: string) => {
    contactWhatsApp(phone, businessName, showToast);
  };

  const openMaps = (address: string, city: string) => {
    const query = encodeURIComponent(`${address}, ${city}`);
    const url = Platform.select({
      ios: `maps:0,0?q=${query}`,
      android: `geo:0,0?q=${query}`,
      default: `https://www.google.com/maps/search/?api=1&query=${query}`,
    });
    Linking.openURL(url).catch(() => {
      showToast("Could not open map.");
    });
  };

  const copyToClipboard = (text: string, label: string) => {
    Clipboard.setString(text);
    showToast(`${label} copied to clipboard!`);
  };

  const handleShare = async () => {
    if (!supplier) return;
    try {
      const shareMessage = `BuildRate Supplier Profile:
🏢 Business Name: ${supplier.businessName}
📍 City: ${supplier.city}
📦 Materials Offered: ${supplier.categories.join(", ")}
📞 Phone: ${supplier.phone}
✉️ Email: ${supplier.email}
🛡️ Verified: ${supplier.verified ? "Yes" : "No"}`;

      await Share.share({
        message: shareMessage,
      });
    } catch {
      showToast("Could not share profile.");
    }
  };

  if (supplier === undefined) {
    return (
      <View
        style={[styles.centered, { backgroundColor: theme.colors.background }]}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (supplier === null) {
    return (
      <View
        style={[styles.centered, { backgroundColor: theme.colors.background }]}
      >
        <MaterialCommunityIcons
          name="store-off-outline"
          size={64}
          color={theme.colors.onSurfaceVariant}
        />
        <Text
          variant="titleMedium"
          style={{ marginTop: 16, color: theme.colors.onBackground }}
        >
          Supplier Not Found
        </Text>
        <Button
          mode="contained"
          onPress={() => router.back()}
          style={{ marginTop: 16 }}
        >
          Go Back
        </Button>
      </View>
    );
  }

  const avColors = getAvatarColor(supplier.businessName);
  const avatarBg = isDark ? avColors.bgDark : avColors.bgLight;
  const avatarText = isDark ? avColors.textDark : avColors.textLight;
  const initial = supplier.businessName.charAt(0).toUpperCase();
  const stBadge = STATUS_DETAILS[supplier.status] ?? STATUS_DETAILS.active;
  const dateFormatted = new Date(supplier.createdAt).toLocaleDateString(
    "en-IN",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  );

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 90 }}
      >
        <LinearGradient
          colors={gradientColors}
          style={[styles.headerBlock, { paddingTop: insets.top + 12 }]}
        >
          <View style={styles.topNavigationRow}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={[
                styles.iconCircleButton,
                {
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(0,0,0,0.05)",
                },
              ]}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name="arrow-left"
                size={20}
                color={theme.colors.onBackground}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleShare}
              style={[
                styles.iconCircleButton,
                {
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(0,0,0,0.05)",
                },
              ]}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name="share-variant"
                size={20}
                color={theme.colors.onBackground}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.avatarOverview}>
            <View
              style={[styles.largeAvatarCircle, { backgroundColor: avatarBg }]}
            >
              <Text style={[styles.largeAvatarLetter, { color: avatarText }]}>
                {initial}
              </Text>
            </View>

            <View style={styles.businessTitleRow}>
              <Text
                style={[
                  styles.businessNameText,
                  { color: theme.colors.onSurface },
                ]}
              >
                {supplier.businessName}
              </Text>
              {supplier.verified && (
                <MaterialCommunityIcons
                  name="check-decagram"
                  size={20}
                  color={COLORS.primary}
                />
              )}
            </View>

            <Text
              style={[
                styles.usernameText,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              @{supplier.username}
            </Text>

            <View style={styles.statusChipsContainer}>
              <View
                style={[styles.statusBadge, { backgroundColor: stBadge.bg }]}
              >
                <MaterialCommunityIcons
                  name={stBadge.icon as any}
                  size={12}
                  color={stBadge.text}
                />
                <Text style={[styles.statusBadgeText, { color: stBadge.text }]}>
                  {supplier.status.toUpperCase()}
                </Text>
              </View>
              {supplier.verified && (
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: "rgba(26,86,219,0.08)" },
                  ]}
                >
                  <MaterialCommunityIcons
                    name="shield-check-outline"
                    size={12}
                    color={COLORS.primary}
                  />
                  <Text
                    style={[styles.statusBadgeText, { color: COLORS.primary }]}
                  >
                    VERIFIED SUPPLIER
                  </Text>
                </View>
              )}
            </View>
          </View>
        </LinearGradient>

        <View style={styles.infoSheetContainer}>
          {user?.role === "supplier" && user?.id === supplier._id && (
            <Button
              mode="contained"
              icon="package-variant-closed"
              onPress={() => router.push("/manage-materials")}
              style={{ backgroundColor: "#F97316", borderRadius: 14 }}
              contentStyle={{ height: 48 }}
              labelStyle={{ fontSize: 13, fontWeight: "700" }}
            >
              Manage Materials
            </Button>
          )}

          {materials === undefined ? (
            <Surface
              style={[
                styles.contentCard,
                {
                  backgroundColor: theme.colors.surface,
                  padding: 24,
                  alignItems: "center",
                },
              ]}
              elevation={1}
            >
              <ActivityIndicator size="small" color={theme.colors.primary} />
            </Surface>
          ) : materials.length > 0 ? (
            <Surface
              style={[
                styles.contentCard,
                { backgroundColor: theme.colors.surface },
              ]}
              elevation={1}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
                >
                  <MaterialCommunityIcons
                    name="tag-multiple-outline"
                    size={18}
                    color={theme.colors.primary}
                  />
                  <Text
                    style={[
                      styles.cardTitle,
                      { color: theme.colors.onSurfaceVariant, marginBottom: 0 },
                    ]}
                  >
                    Material Catalog
                  </Text>
                </View>
                <Surface
                  style={{
                    backgroundColor: isDark
                      ? "rgba(79,142,247,0.12)"
                      : "rgba(26,86,219,0.08)",
                    paddingHorizontal: 8,
                    paddingVertical: 3,
                    borderRadius: 8,
                  }}
                  elevation={0}
                >
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: "700",
                      color: theme.colors.primary,
                    }}
                  >
                    {materials.length} Item{materials.length > 1 ? "s" : ""}
                  </Text>
                </Surface>
              </View>

              {/* Horizontal category selector */}
              {materialCategories.length > 0 && (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{
                    gap: 6,
                    marginBottom: 12,
                    paddingBottom: 4,
                  }}
                >
                  {materialCategories.map((cat) => {
                    const isSelected = selectedMatCat === cat;
                    const catDetails = CATEGORY_DETAILS[cat];
                    const catColor = catDetails?.color ?? theme.colors.primary;
                    return (
                      <TouchableOpacity
                        key={cat}
                        onPress={() => setSelectedMatCat(cat)}
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 6,
                          paddingHorizontal: 12,
                          paddingVertical: 6,
                          borderRadius: 20,
                          backgroundColor: isSelected
                            ? theme.colors.primary
                            : isDark
                              ? "rgba(255,255,255,0.05)"
                              : "rgba(0,0,0,0.04)",
                          borderWidth: 1,
                          borderColor: isSelected
                            ? theme.colors.primary
                            : isDark
                              ? "rgba(255,255,255,0.1)"
                              : "rgba(0,0,0,0.08)",
                        }}
                        activeOpacity={0.8}
                      >
                        <MaterialCommunityIcons
                          name={(catDetails?.icon ?? "circle-outline") as any}
                          size={12}
                          color={isSelected ? "#FFF" : catColor}
                        />
                        <Text
                          style={{
                            fontSize: 12,
                            fontWeight: "700",
                            color: isSelected ? "#FFF" : theme.colors.onSurface,
                          }}
                        >
                          {cat}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              )}

              {/* Material List */}
              <View style={{ gap: 8 }}>
                {displayedMaterials.map((mat, idx) => {
                  const isAvailable = mat.status === "available";
                  return (
                    <View key={mat._id}>
                      {idx > 0 && (
                        <View
                          style={{
                            height: 1,
                            backgroundColor: isDark
                              ? "rgba(255,255,255,0.06)"
                              : "rgba(0,0,0,0.05)",
                            marginVertical: 8,
                          }}
                        />
                      )}
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <View style={{ flex: 1, marginRight: 16 }}>
                          <Text
                            style={{
                              fontSize: 13,
                              fontWeight: "600",
                              color: theme.colors.onSurface,
                            }}
                          >
                            {mat.name}
                          </Text>
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              gap: 6,
                              marginTop: 2,
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 12,
                                color: isDark ? "#FB923C" : "#D97706",
                                fontWeight: "600",
                              }}
                            >
                              Brand: {mat.brand}
                            </Text>
                            {mat.notes && (
                              <>
                                <View
                                  style={{
                                    width: 3,
                                    height: 3,
                                    borderRadius: 1.5,
                                    backgroundColor:
                                      theme.colors.onSurfaceVariant,
                                    opacity: 0.5,
                                  }}
                                />
                                <Text
                                  style={{
                                    fontSize: 11,
                                    color: theme.colors.onSurfaceVariant,
                                    fontStyle: "italic",
                                  }}
                                  numberOfLines={1}
                                >
                                  {mat.notes}
                                </Text>
                              </>
                            )}
                          </View>
                        </View>

                        <View style={{ alignItems: "flex-end" }}>
                          <Text
                            style={{
                              fontSize: 14,
                              fontWeight: "700",
                              color: theme.colors.primary,
                            }}
                          >
                            ₹{mat.price}
                            <Text
                              style={{
                                fontSize: 11,
                                fontWeight: "500",
                                color: theme.colors.onSurfaceVariant,
                              }}
                            >
                              {" "}
                              / {mat.unit}
                            </Text>
                          </Text>
                          <Text
                            style={{
                              fontSize: 10,
                              fontWeight: "600",
                              color: isAvailable ? "#16A34A" : "#DC2626",
                              marginTop: 2,
                            }}
                          >
                            {isAvailable ? "Available" : "Out of Stock"}
                          </Text>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
            </Surface>
          ) : null}

          <Surface
            style={[
              styles.contentCard,
              { backgroundColor: theme.colors.surface },
            ]}
            elevation={1}
          >
            <Text
              style={[
                styles.cardTitle,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              Business Details
            </Text>

            <View style={styles.contactItemRow}>
              <MaterialCommunityIcons
                name="phone-outline"
                size={20}
                color={theme.colors.onSurfaceVariant}
              />
              <View style={styles.contactItemContent}>
                <Text
                  style={[
                    styles.contactItemLabel,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  Phone Number
                </Text>
                <Text
                  style={[
                    styles.contactItemValue,
                    { color: theme.colors.onSurface },
                  ]}
                >
                  {supplier.phone}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => copyToClipboard(supplier.phone, "Phone number")}
                style={styles.copyButton}
              >
                <MaterialCommunityIcons
                  name="content-copy"
                  size={16}
                  color={theme.colors.primary}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.cardDivider} />

            <View style={styles.contactItemRow}>
              <MaterialCommunityIcons
                name="email-outline"
                size={20}
                color={theme.colors.onSurfaceVariant}
              />
              <View style={styles.contactItemContent}>
                <Text
                  style={[
                    styles.contactItemLabel,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  Email Address
                </Text>
                <Text
                  style={[
                    styles.contactItemValue,
                    { color: theme.colors.onSurface },
                  ]}
                >
                  {supplier.email}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => copyToClipboard(supplier.email, "Email address")}
                style={styles.copyButton}
              >
                <MaterialCommunityIcons
                  name="content-copy"
                  size={16}
                  color={theme.colors.primary}
                />
              </TouchableOpacity>
            </View>

            {supplier.gstNumber && (
              <>
                <View style={styles.cardDivider} />
                <View style={styles.contactItemRow}>
                  <MaterialCommunityIcons
                    name="file-certificate-outline"
                    size={20}
                    color={theme.colors.onSurfaceVariant}
                  />
                  <View style={styles.contactItemContent}>
                    <Text
                      style={[
                        styles.contactItemLabel,
                        { color: theme.colors.onSurfaceVariant },
                      ]}
                    >
                      GST Registration
                    </Text>
                    <Text
                      style={[
                        styles.contactItemValue,
                        { color: theme.colors.onSurface },
                      ]}
                    >
                      {supplier.gstNumber}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() =>
                      copyToClipboard(supplier.gstNumber!, "GST Number")
                    }
                    style={styles.copyButton}
                  >
                    <MaterialCommunityIcons
                      name="content-copy"
                      size={16}
                      color={theme.colors.primary}
                    />
                  </TouchableOpacity>
                </View>
              </>
            )}

            <View style={styles.cardDivider} />

            <View style={styles.contactItemRow}>
              <MaterialCommunityIcons
                name="calendar-outline"
                size={20}
                color={theme.colors.onSurfaceVariant}
              />
              <View style={styles.contactItemContent}>
                <Text
                  style={[
                    styles.contactItemLabel,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  Member Since
                </Text>
                <Text
                  style={[
                    styles.contactItemValue,
                    { color: theme.colors.onSurface },
                  ]}
                >
                  {dateFormatted}
                </Text>
              </View>
            </View>
          </Surface>

          <Surface
            style={[
              styles.contentCard,
              { backgroundColor: theme.colors.surface },
            ]}
            elevation={1}
          >
            <Text
              style={[
                styles.cardTitle,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              Warehouse Location
            </Text>

            <View style={styles.locationItemBlock}>
              <View style={{ flexDirection: "row", gap: 12 }}>
                <MaterialCommunityIcons
                  name="map-marker-radius-outline"
                  size={20}
                  color={theme.colors.onSurfaceVariant}
                  style={{ marginTop: 2 }}
                />
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.locationLabelText,
                      { color: theme.colors.onSurfaceVariant },
                    ]}
                  >
                    Location Coverage
                  </Text>
                  <Text
                    style={[
                      styles.cityLabelText,
                      { color: theme.colors.onSurface },
                    ]}
                  >
                    {supplier.city}
                  </Text>
                  {supplier.address && (
                    <Text
                      style={[
                        styles.addressLabelText,
                        { color: theme.colors.onSurfaceVariant },
                      ]}
                    >
                      {supplier.address}
                    </Text>
                  )}
                </View>
              </View>

              {(supplier.address || supplier.mapUrl) && (
                <Button
                  mode="outlined"
                  icon="map"
                  onPress={() => {
                    if (supplier.mapUrl) {
                      Linking.openURL(supplier.mapUrl).catch(() => {
                        showToast("Could not open maps link.");
                      });
                    } else {
                      openMaps(supplier.address || "", supplier.city);
                    }
                  }}
                  style={styles.mapsActionButton}
                  labelStyle={styles.mapsButtonLabel}
                >
                  View on Maps
                </Button>
              )}
            </View>
          </Surface>

          {supplier.notes && (
            <Surface
              style={[
                styles.contentCard,
                { backgroundColor: theme.colors.surface },
              ]}
              elevation={1}
            >
              <Text
                style={[
                  styles.cardTitle,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                Supplier Description
              </Text>
              <View style={styles.notesContainer}>
                <MaterialCommunityIcons
                  name="information-outline"
                  size={18}
                  color={theme.colors.primary}
                  style={{ marginTop: 2 }}
                />
                <Text
                  style={[
                    styles.notesTextVal,
                    { color: theme.colors.onSurface },
                  ]}
                >
                  {supplier.notes}
                </Text>
              </View>
            </Surface>
          )}
        </View>
      </ScrollView>

      <Surface
        style={[
          styles.floatingFooter,
          {
            backgroundColor: theme.colors.surface,
            paddingBottom: insets.bottom > 0 ? insets.bottom + 12 : 20,
            borderTopColor: theme.colors.outline,
          },
        ]}
        elevation={4}
      >
        <View style={styles.footerActionRow}>
          <TouchableOpacity
            style={[
              styles.footerCircleBtn,
              {
                backgroundColor: isDark
                  ? "rgba(255,255,255,0.06)"
                  : "rgba(0,0,0,0.04)",
              },
            ]}
            onPress={() => handleCall(supplier.phone)}
            activeOpacity={0.75}
          >
            <MaterialCommunityIcons
              name="phone"
              size={20}
              color={theme.colors.primary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.footerCircleBtn,
              {
                backgroundColor: isDark
                  ? "rgba(255,255,255,0.06)"
                  : "rgba(0,0,0,0.04)",
              },
            ]}
            onPress={() => handleEmail(supplier.email, supplier.businessName)}
            activeOpacity={0.75}
          >
            <MaterialCommunityIcons
              name="email"
              size={20}
              color={theme.colors.primary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.footerCircleBtn, { backgroundColor: "#25D3661B" }]}
            onPress={() =>
              handleWhatsApp(supplier.phone, supplier.businessName)
            }
            activeOpacity={0.75}
          >
            <MaterialCommunityIcons name="whatsapp" size={22} color="#25D366" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.footerPrimaryBtn,
              {
                backgroundColor: isInCompare(supplier._id)
                  ? "#16A34A"
                  : theme.colors.primary,
              },
            ]}
            onPress={() => {
              if (isInCompare(supplier._id)) {
                removeFromCompare(supplier._id);
                showToast("Removed from comparison.");
              } else {
                const result = addToCompare(supplier._id);
                showToast(result.message);
                if (result.success) {
                  router.push("/(tabs)/compare");
                }
              }
            }}
            activeOpacity={0.75}
          >
            <MaterialCommunityIcons
              name={
                isInCompare(supplier._id) ? "check-circle" : "scale-balance"
              }
              size={18}
              color="#FFF"
            />
            <Text style={styles.footerPrimaryLabel}>
              {isInCompare(supplier._id) ? "In Compare" : "Compare"}
            </Text>
          </TouchableOpacity>
        </View>
      </Surface>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={2500}
        style={{ marginBottom: Platform.OS === "ios" ? 96 : 80 }}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
}
