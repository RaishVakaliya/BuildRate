import React, { useState } from "react";
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
import { COLORS } from "../constants/theme";

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
  const isDark = resolvedScheme === "dark";

  const supplier = useQuery(
    api.suppliers.getSupplier,
    id ? { id: id as any } : ("skip" as any),
  );

  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const gradientColors = isDark
    ? (["#1E293B", "#0F172A"] as const)
    : (["#E6F2FF", "#F5F7FA"] as const);

  const showToast = (msg: string) => {
    setSnackbarMessage(msg);
    setSnackbarVisible(true);
  };

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone.replace(/\s+/g, "")}`).catch(() => {
      showToast("Could not open dialer.");
    });
  };

  const handleEmail = (email: string, businessName: string) => {
    Linking.openURL(
      `mailto:${email}?subject=Inquiry from RateGuru to ${businessName}`,
    ).catch(() => {
      showToast("Could not open email client.");
    });
  };

  const handleWhatsApp = (phone: string, businessName: string) => {
    const cleanPhone = phone.replace(/[^\d+]/g, "");
    const message = encodeURIComponent(
      `Hello ${businessName}, I found your business on RateGuru and would like to inquire about material pricing.`,
    );
    const url = `whatsapp://send?phone=${cleanPhone}&text=${message}`;
    Linking.openURL(url).catch(() => {
      Linking.openURL(`https://wa.me/${cleanPhone}?text=${message}`).catch(
        () => {
          showToast("WhatsApp is not available.");
        },
      );
    });
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
      const shareMessage = `RateGuru Supplier Profile:
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
        <Button mode="contained" onPress={() => router.back()} style={{ marginTop: 16 }}>
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
        {/* Profile Header Block */}
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

          {/* Profile Overview Card */}
          <View style={styles.avatarOverview}>
            <View style={[styles.largeAvatarCircle, { backgroundColor: avatarBg }]}>
              <Text style={[styles.largeAvatarLetter, { color: avatarText }]}>
                {initial}
              </Text>
            </View>

            <View style={styles.businessTitleRow}>
              <Text style={[styles.businessNameText, { color: theme.colors.onSurface }]}>
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
              style={[styles.usernameText, { color: theme.colors.onSurfaceVariant }]}
            >
              @{supplier.username}
            </Text>

            <View style={styles.statusChipsContainer}>
              <View style={[styles.statusBadge, { backgroundColor: stBadge.bg }]}>
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
                <View style={[styles.statusBadge, { backgroundColor: "rgba(26,86,219,0.08)" }]}>
                  <MaterialCommunityIcons
                    name="shield-check-outline"
                    size={12}
                    color={COLORS.primary}
                  />
                  <Text style={[styles.statusBadgeText, { color: COLORS.primary }]}>
                    VERIFIED SUPPLIER
                  </Text>
                </View>
              )}
            </View>
          </View>
        </LinearGradient>

        <View style={styles.infoSheetContainer}>
          {user?.role === "supplier" && (
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

          {/* Categories Offered */}
          <Surface
            style={[styles.contentCard, { backgroundColor: theme.colors.surface }]}
            elevation={1}
          >
            <Text
              style={[styles.cardTitle, { color: theme.colors.onSurfaceVariant }]}
            >
              Materials Supplied
            </Text>
            <View style={styles.categoriesBadgeGrid}>
              {supplier.categories.map((cat) => {
                const matched = CATEGORY_DETAILS[cat];
                const catColor = matched?.color ?? theme.colors.onSurfaceVariant;
                const catIcon = matched?.icon ?? "circle-outline";
                return (
                  <View
                    key={cat}
                    style={[
                      styles.categoryBadgeChip,
                      {
                        backgroundColor: isDark
                          ? "rgba(255,255,255,0.06)"
                          : "rgba(0,0,0,0.04)",
                      },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={catIcon as any}
                      size={14}
                      color={catColor}
                    />
                    <Text style={[styles.categoryBadgeText, { color: theme.colors.onSurface }]}>
                      {cat}
                    </Text>
                  </View>
                );
              })}
            </View>
          </Surface>

          {/* Contact Details Card */}
          <Surface
            style={[styles.contentCard, { backgroundColor: theme.colors.surface }]}
            elevation={1}
          >
            <Text
              style={[styles.cardTitle, { color: theme.colors.onSurfaceVariant }]}
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
                <Text style={[styles.contactItemLabel, { color: theme.colors.onSurfaceVariant }]}>
                  Phone Number
                </Text>
                <Text style={[styles.contactItemValue, { color: theme.colors.onSurface }]}>
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
                <Text style={[styles.contactItemLabel, { color: theme.colors.onSurfaceVariant }]}>
                  Email Address
                </Text>
                <Text style={[styles.contactItemValue, { color: theme.colors.onSurface }]}>
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
                    <Text style={[styles.contactItemLabel, { color: theme.colors.onSurfaceVariant }]}>
                      GST Registration
                    </Text>
                    <Text style={[styles.contactItemValue, { color: theme.colors.onSurface }]}>
                      {supplier.gstNumber}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => copyToClipboard(supplier.gstNumber!, "GST Number")}
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
                <Text style={[styles.contactItemLabel, { color: theme.colors.onSurfaceVariant }]}>
                  Member Since
                </Text>
                <Text style={[styles.contactItemValue, { color: theme.colors.onSurface }]}>
                  {dateFormatted}
                </Text>
              </View>
            </View>
          </Surface>

          {/* Warehouse Location Card */}
          <Surface
            style={[styles.contentCard, { backgroundColor: theme.colors.surface }]}
            elevation={1}
          >
            <Text
              style={[styles.cardTitle, { color: theme.colors.onSurfaceVariant }]}
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
                  <Text style={[styles.locationLabelText, { color: theme.colors.onSurfaceVariant }]}>
                    Location Coverage
                  </Text>
                  <Text style={[styles.cityLabelText, { color: theme.colors.onSurface }]}>
                    {supplier.city}
                  </Text>
                  {supplier.address && (
                    <Text style={[styles.addressLabelText, { color: theme.colors.onSurfaceVariant }]}>
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

          {/* Notes Card */}
          {supplier.notes && (
            <Surface
              style={[styles.contentCard, { backgroundColor: theme.colors.surface }]}
              elevation={1}
            >
              <Text
                style={[styles.cardTitle, { color: theme.colors.onSurfaceVariant }]}
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
                <Text style={[styles.notesTextVal, { color: theme.colors.onSurface }]}>
                  {supplier.notes}
                </Text>
              </View>
            </Surface>
          )}
        </View>
      </ScrollView>

      {/* Floating Bottom Communication Bar */}
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
            onPress={() => handleWhatsApp(supplier.phone, supplier.businessName)}
            activeOpacity={0.75}
          >
            <MaterialCommunityIcons name="whatsapp" size={22} color="#25D366" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.footerPrimaryBtn, { backgroundColor: theme.colors.primary }]}
            onPress={() => showToast("Comparison feature coming soon!")}
            activeOpacity={0.75}
          >
            <MaterialCommunityIcons name="scale-balance" size={18} color="#FFF" />
            <Text style={styles.footerPrimaryLabel}>Compare</Text>
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


