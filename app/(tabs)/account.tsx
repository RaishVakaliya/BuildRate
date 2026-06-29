import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { styles } from "../../components/styles/accountStyles";
import {
  Text,
  TextInput,
  Button,
  Surface,
  useTheme,
  ActivityIndicator,
  SegmentedButtons,
} from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAppTheme, useThemeColors } from "../../context/ThemeContext";
import { useTranslation } from "../../context/LanguageContext";
import { type Language } from "../../i18n";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import AboutBuildRateCard from "../../components/AboutBuildRateCard";

export default function AccountScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { user, isLoading, login, logout } = useAuth();
  const { preference, setPreference, resolvedScheme } = useAppTheme();
  const isDark = resolvedScheme === "dark";

  if (isLoading) {
    return (
      <View
        style={[styles.centered, { backgroundColor: theme.colors.background }]}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!user) {
    return (
      <LoginScreen
        isDark={isDark}
        preference={preference}
        setPreference={setPreference}
      />
    );
  }

  return (
    <ProfileScreen
      isDark={isDark}
      preference={preference}
      setPreference={setPreference}
      insets={insets}
    />
  );
}

function LoginScreen({
  isDark,
  preference,
  setPreference,
}: {
  isDark: boolean;
  preference: "light" | "dark" | "system";
  setPreference: (p: "light" | "dark" | "system") => void;
}) {
  const theme = useTheme();
  const { login } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t, language, setLanguage } = useTranslation();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { gradientColors } = useThemeColors();

  const handleLogin = async () => {
    if (!phone.trim() || !password.trim()) {
      setError(t("pleaseEnterPhoneAndPassword"));
      return;
    }
    setError("");
    setLoading(true);
    try {
      await login(phone.trim(), password);
    } catch (e: any) {
      const msg = e?.message ?? t("loginFailed");
      const match =
        msg.match(/Uncaught Error:\s*([^.]+)/) ||
        msg.match(/Server Error:\s*([^.]+)/);
      const cleanMsg = match && match[1] ? match[1].trim() : msg;
      setError(cleanMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <LinearGradient
        colors={gradientColors}
        style={[styles.loginHeader, { paddingTop: insets.top + 20 }]}
      >
        <View style={styles.loginLogoWrap}>
          <MaterialCommunityIcons
            name="shield-account"
            size={56}
            color={isDark ? "#4F8EF7" : "#1A56DB"}
          />
        </View>
        <Text
          style={[styles.loginTitle, { color: isDark ? "#FFFFFF" : "#1E3A8A" }]}
        >
          {t("signIn")}
        </Text>
        <Text
          style={[
            styles.loginSubtitle,
            { color: isDark ? "rgba(255,255,255,0.6)" : "rgba(71,85,105,0.8)" },
          ]}
        >
          {t("welcomeToBuildRate")}
        </Text>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={[
          styles.loginBody,
          { paddingBottom: insets.bottom + 24 },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <Surface
          style={[styles.loginCard, { backgroundColor: theme.colors.surface }]}
          elevation={2}
        >
          {error ? (
            <View style={styles.errorBox}>
              <MaterialCommunityIcons
                name="alert-circle"
                size={16}
                color="#DC2626"
              />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <TextInput
            label={t("phoneNumber")}
            value={phone}
            onChangeText={(text) => {
              setPhone(text);
              setError("");
            }}
            mode="outlined"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="phone-pad"
            left={<TextInput.Icon icon="phone" />}
            style={styles.input}
            outlineColor={theme.colors.outline}
            activeOutlineColor={theme.colors.primary}
          />

          <TextInput
            label={t("password")}
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setError("");
            }}
            mode="outlined"
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            left={<TextInput.Icon icon="lock" />}
            right={
              <TextInput.Icon
                icon={showPassword ? "eye-off" : "eye"}
                onPress={() => setShowPassword((v) => !v)}
              />
            }
            style={styles.input}
            outlineColor={theme.colors.outline}
            activeOutlineColor={theme.colors.primary}
          />

          <Button
            mode="contained"
            onPress={handleLogin}
            loading={loading}
            disabled={loading}
            contentStyle={styles.loginBtnContent}
            style={styles.loginBtn}
            labelStyle={styles.loginBtnLabel}
          >
            {loading ? t("signingIn") : t("signIn")}
          </Button>
        </Surface>

        <View style={{ height: 16 }} />

        <TouchableOpacity
          onPress={() => router.push("/become-supplier")}
          activeOpacity={0.82}
          style={[
            styles.infoCard,
            {
              backgroundColor: isDark
                ? "rgba(26,86,219,0.15)"
                : "rgba(26,86,219,0.07)",
              borderRadius: 18,
              borderWidth: 1.5,
              borderColor: isDark
                ? "rgba(79,142,247,0.3)"
                : "rgba(26,86,219,0.18)",
              flexDirection: "row",
              alignItems: "center",
              gap: 14,
              paddingVertical: 16,
              paddingHorizontal: 18,
            },
          ]}
        >
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: isDark
                ? "rgba(79,142,247,0.2)"
                : "rgba(26,86,219,0.12)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MaterialCommunityIcons
              name="store-plus"
              size={22}
              color={isDark ? "#4F8EF7" : "#1A56DB"}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 15,
                fontWeight: "800",
                color: isDark ? "#4F8EF7" : "#1A56DB",
                marginBottom: 2,
              }}
            >
              Become a Supplier
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontWeight: "500",
                color: isDark ? "rgba(79,142,247,0.75)" : "rgba(26,86,219,0.7)",
              }}
            >
              Apply to list your business on BuildRate
            </Text>
          </View>
          <MaterialCommunityIcons
            name="chevron-right"
            size={20}
            color={isDark ? "#4F8EF7" : "#1A56DB"}
          />
        </TouchableOpacity>

        <View style={{ height: 4 }} />

        <Surface
          style={[styles.infoCard, { backgroundColor: theme.colors.surface }]}
          elevation={1}
        >
          <Text
            style={[styles.cardTitle, { color: theme.colors.onSurfaceVariant }]}
          >
            {t("preferences")}
          </Text>
          <Text style={[styles.prefLabel, { color: theme.colors.onSurface }]}>
            {t("appTheme")}
          </Text>
          <SegmentedButtons
            value={preference}
            onValueChange={(v) =>
              setPreference(v as "light" | "dark" | "system")
            }
            style={styles.segmented}
            buttons={[
              {
                value: "light",
                label: t("themeLight"),
                icon: "white-balance-sunny",
              },
              {
                value: "system",
                label: t("themeSystem"),
                icon: "theme-light-dark",
              },
              { value: "dark", label: t("themeDark"), icon: "weather-night" },
            ]}
          />

          <Text
            style={[
              styles.prefLabel,
              { color: theme.colors.onSurface, marginTop: 16 },
            ]}
          >
            {t("appLanguage")}
          </Text>
          <SegmentedButtons
            value={language}
            onValueChange={(v) => setLanguage(v as Language)}
            style={styles.segmented}
            buttons={[
              { value: "en", label: "English", icon: "translate" },
              { value: "gu", label: "ગુજરાતી", icon: "translate" },
            ]}
          />
        </Surface>

        <AboutBuildRateCard />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function ProfileScreen({
  isDark,
  preference,
  setPreference,
  insets,
}: {
  isDark: boolean;
  preference: "light" | "dark" | "system";
  setPreference: (p: "light" | "dark" | "system") => void;
  insets: ReturnType<typeof useSafeAreaInsets>;
}) {
  const theme = useTheme();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { t, language, setLanguage } = useTranslation();
  const pendingCount = useQuery(api.supplierApplications.getPendingCount) ?? 0;

  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    if (user?.email) {
      AsyncStorage.getItem(`profile_pic_${user.email}`).then((uri) => {
        if (uri) setProfileImage(uri);
      });
    }
  }, [user?.email]);

  const handlePickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert(t("permissionPhotoRequired"));
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets[0].uri) {
      const pickedUri = result.assets[0].uri;
      setProfileImage(pickedUri);
      if (user?.email) {
        await AsyncStorage.setItem(`profile_pic_${user.email}`, pickedUri);
      }
    }
  };

  const { gradientColors } = useThemeColors();

  const initial = user?.username?.charAt(0)?.toUpperCase() ?? "A";

  const memberSince = (() => {
    try {
      return new Date(user?.memberSince ?? "").toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return user?.memberSince ?? "-";
    }
  })();

  return (
    <View style={[styles.flex, { backgroundColor: theme.colors.background }]}>
      <LinearGradient
        colors={gradientColors}
        style={[styles.profileHeader, { paddingTop: insets.top + 20 }]}
      >
        <View style={{ position: "relative", marginBottom: 12 }}>
          <TouchableOpacity
            onPress={handlePickImage}
            activeOpacity={0.85}
            style={[
              styles.avatar,
              {
                backgroundColor: isDark ? "#1A56DB" : "#1A56DB",
                overflow: "hidden",
                marginBottom: 0,
              },
            ]}
          >
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                style={{ width: "100%", height: "100%" }}
                alt="User Profile Picture"
              />
            ) : (
              <Text style={styles.avatarText}>{initial}</Text>
            )}
          </TouchableOpacity>
        </View>
        <Text
          style={[
            styles.profileName,
            { color: isDark ? "#FFFFFF" : "#1E3A8A" },
          ]}
        >
          {user?.username}
        </Text>
        <Text
          style={[
            styles.profileEmail,
            { color: isDark ? "rgba(255,255,255,0.7)" : "rgba(71,85,105,0.8)" },
          ]}
        >
          {user?.email}
        </Text>
        <View
          style={[
            styles.roleBadge,
            {
              backgroundColor: isDark
                ? "rgba(79,142,247,0.2)"
                : "rgba(26,86,219,0.1)",
            },
          ]}
        >
          <MaterialCommunityIcons
            name={user?.role === "admin" ? "shield-check" : "storefront"}
            size={13}
            color={isDark ? "#4F8EF7" : "#1A56DB"}
          />
          <Text
            style={[styles.roleText, { color: isDark ? "#4F8EF7" : "#1A56DB" }]}
          >
            {user?.role === "admin" ? t("adminRole") : t("supplierRole")}
          </Text>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.profileBody,
          { paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {user?.role === "supplier" && (
          <TouchableOpacity
            style={[
              styles.adminPanelBtn,
              { backgroundColor: "#F97316", marginBottom: 2 },
            ]}
            onPress={() => router.push("/manage-materials")}
            activeOpacity={0.85}
          >
            <View style={styles.adminPanelLeft}>
              <View style={styles.adminPanelIconWrap}>
                <MaterialCommunityIcons
                  name="package-variant-closed"
                  size={24}
                  color="#FFF"
                />
              </View>
              <View>
                <Text style={styles.adminPanelTitle}>
                  {t("manageMaterialsTitle")}
                </Text>
                <Text style={styles.adminPanelSub}>
                  {t("manageMaterialsSub")}
                </Text>
              </View>
            </View>
            <MaterialCommunityIcons
              name="chevron-right"
              size={22}
              color="rgba(255,255,255,0.7)"
            />
          </TouchableOpacity>
        )}

        <Surface
          style={[styles.infoCard, { backgroundColor: theme.colors.surface }]}
          elevation={1}
        >
          <Text
            style={[styles.cardTitle, { color: theme.colors.onSurfaceVariant }]}
          >
            {t("accountInfo")}
          </Text>

          <View style={styles.infoRow}>
            <MaterialCommunityIcons
              name="account-outline"
              size={18}
              color={theme.colors.onSurfaceVariant}
            />
            <View style={styles.infoTextWrap}>
              <Text
                style={[
                  styles.infoLabel,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                {t("username")}
              </Text>
              <Text
                style={[styles.infoValue, { color: theme.colors.onSurface }]}
              >
                {user?.username}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <MaterialCommunityIcons
              name="email-outline"
              size={18}
              color={theme.colors.onSurfaceVariant}
            />
            <View style={styles.infoTextWrap}>
              <Text
                style={[
                  styles.infoLabel,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                {t("email")}
              </Text>
              <Text
                style={[styles.infoValue, { color: theme.colors.onSurface }]}
              >
                {user?.email}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <MaterialCommunityIcons
              name="calendar-outline"
              size={18}
              color={theme.colors.onSurfaceVariant}
            />
            <View style={styles.infoTextWrap}>
              <Text
                style={[
                  styles.infoLabel,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                {t("memberSince")}
              </Text>
              <Text
                style={[styles.infoValue, { color: theme.colors.onSurface }]}
              >
                {memberSince}
              </Text>
            </View>
          </View>
        </Surface>

        {user?.role === "supplier" && (
          <Surface
            style={[styles.infoCard, { backgroundColor: theme.colors.surface }]}
            elevation={1}
          >
            <Text
              style={[
                styles.cardTitle,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              {t("businessDetails")}
            </Text>

            {user?.businessName && (
              <>
                <View style={styles.infoRow}>
                  <MaterialCommunityIcons
                    name="store"
                    size={18}
                    color={theme.colors.onSurfaceVariant}
                  />
                  <View style={styles.infoTextWrap}>
                    <Text
                      style={[
                        styles.infoLabel,
                        { color: theme.colors.onSurfaceVariant },
                      ]}
                    >
                      {t("businessName")}
                    </Text>
                    <Text
                      style={[
                        styles.infoValue,
                        { color: theme.colors.onSurface },
                      ]}
                    >
                      {user.businessName}
                    </Text>
                  </View>
                </View>
                <View style={styles.divider} />
              </>
            )}

            {user?.phone && (
              <>
                <View style={styles.infoRow}>
                  <MaterialCommunityIcons
                    name="phone-outline"
                    size={18}
                    color={theme.colors.onSurfaceVariant}
                  />
                  <View style={styles.infoTextWrap}>
                    <Text
                      style={[
                        styles.infoLabel,
                        { color: theme.colors.onSurfaceVariant },
                      ]}
                    >
                      {t("phoneNumber")}
                    </Text>
                    <Text
                      style={[
                        styles.infoValue,
                        { color: theme.colors.onSurface },
                      ]}
                    >
                      {user.phone}
                    </Text>
                  </View>
                </View>
                <View style={styles.divider} />
              </>
            )}

            {user?.area && (
              <>
                <View style={styles.infoRow}>
                  <MaterialCommunityIcons
                    name="map-marker-outline"
                    size={18}
                    color={theme.colors.onSurfaceVariant}
                  />
                  <View style={styles.infoTextWrap}>
                    <Text
                      style={[
                        styles.infoLabel,
                        { color: theme.colors.onSurfaceVariant },
                      ]}
                    >
                      {t("areaLocation")}
                    </Text>
                    <Text
                      style={[
                        styles.infoValue,
                        { color: theme.colors.onSurface },
                      ]}
                    >
                      {user.area}
                    </Text>
                  </View>
                </View>
                <View style={styles.divider} />
              </>
            )}

            {user?.address && (
              <>
                <View style={styles.infoRow}>
                  <MaterialCommunityIcons
                    name="home-outline"
                    size={18}
                    color={theme.colors.onSurfaceVariant}
                  />
                  <View style={styles.infoTextWrap}>
                    <Text
                      style={[
                        styles.infoLabel,
                        { color: theme.colors.onSurfaceVariant },
                      ]}
                    >
                      {t("fullAddress")}
                    </Text>
                    <Text
                      style={[
                        styles.infoValue,
                        { color: theme.colors.onSurface },
                      ]}
                    >
                      {user.address}
                    </Text>
                  </View>
                </View>
                <View style={styles.divider} />
              </>
            )}

            {user?.categories && user.categories.length > 0 && (
              <View
                style={[
                  styles.infoRow,
                  { flexDirection: "column", alignItems: "flex-start", gap: 8 },
                ]}
              >
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
                >
                  <MaterialCommunityIcons
                    name="tag-multiple-outline"
                    size={18}
                    color={theme.colors.onSurfaceVariant}
                  />
                  <Text
                    style={[
                      styles.infoLabel,
                      { color: theme.colors.onSurfaceVariant },
                    ]}
                  >
                    {t("dealingCategories")}
                  </Text>
                </View>
                <View style={styles.categoryWrap}>
                  {user.categories.map((cat) => (
                    <View
                      key={cat}
                      style={[
                        styles.catChip,
                        { backgroundColor: theme.colors.surfaceVariant },
                      ]}
                    >
                      <Text
                        style={[
                          styles.catText,
                          { color: theme.colors.onSurface },
                        ]}
                      >
                        {cat}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </Surface>
        )}

        {user?.role === "admin" && (
          <TouchableOpacity
            style={[styles.adminPanelBtn, { backgroundColor: "#1A56DB" }]}
            onPress={() => router.push("/admin")}
            activeOpacity={0.85}
          >
            <View style={styles.adminPanelLeft}>
              <View style={styles.adminPanelIconWrap}>
                <MaterialCommunityIcons
                  name="shield-crown"
                  size={24}
                  color="#FFF"
                />
              </View>
              <View>
                <Text style={styles.adminPanelTitle}>
                  {t("adminPanelTitle")}
                </Text>
                <Text style={styles.adminPanelSub}>{t("adminPanelSub")}</Text>
              </View>
            </View>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
            >
              {pendingCount > 0 && (
                <View
                  style={{
                    backgroundColor: "#DC2626",
                    borderRadius: 12,
                    minWidth: 24,
                    height: 24,
                    alignItems: "center",
                    justifyContent: "center",
                    paddingHorizontal: 6,
                  }}
                >
                  <Text
                    style={{ fontSize: 12, color: "#FFF", fontWeight: "800" }}
                  >
                    {pendingCount > 99 ? "99+" : pendingCount}
                  </Text>
                </View>
              )}
              <MaterialCommunityIcons
                name="chevron-right"
                size={22}
                color="rgba(255,255,255,0.7)"
              />
            </View>
          </TouchableOpacity>
        )}

        <Surface
          style={[styles.infoCard, { backgroundColor: theme.colors.surface }]}
          elevation={1}
        >
          <Text
            style={[styles.cardTitle, { color: theme.colors.onSurfaceVariant }]}
          >
            {t("preferences")}
          </Text>
          <Text style={[styles.prefLabel, { color: theme.colors.onSurface }]}>
            {t("appTheme")}
          </Text>
          <SegmentedButtons
            value={preference}
            onValueChange={(v) =>
              setPreference(v as "light" | "dark" | "system")
            }
            style={styles.segmented}
            buttons={[
              {
                value: "light",
                label: t("themeLight"),
                icon: "white-balance-sunny",
              },
              {
                value: "system",
                label: t("themeSystem"),
                icon: "theme-light-dark",
              },
              { value: "dark", label: t("themeDark"), icon: "weather-night" },
            ]}
          />
        </Surface>

        <Surface
          style={[styles.infoCard, { backgroundColor: theme.colors.surface }]}
          elevation={1}
        >
          <Text
            style={[styles.cardTitle, { color: theme.colors.onSurfaceVariant }]}
          >
            {t("languagePreferences")}
          </Text>
          <Text style={[styles.prefLabel, { color: theme.colors.onSurface }]}>
            {t("appLanguage")}
          </Text>
          <SegmentedButtons
            value={language}
            onValueChange={(v) => setLanguage(v as Language)}
            style={styles.segmented}
            buttons={[
              { value: "en", label: "English", icon: "translate" },
              { value: "gu", label: "ગુજરાતી", icon: "translate" },
            ]}
          />
        </Surface>

        <Button
          mode="outlined"
          onPress={logout}
          icon="logout"
          contentStyle={styles.logoutContent}
          style={[styles.logoutBtn, { borderColor: "#DC2626" }]}
          textColor="#DC2626"
        >
          {t("signOut")}
        </Button>

        <AboutBuildRateCard />

        <View style={{ alignItems: "center", marginTop: 20, marginBottom: 0 }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              color: isDark ? "#ccccccff" : "#000000ff",
              letterSpacing: 0.5,
            }}
          >
            {t("allRightsReserved")}
          </Text>
          <Text
            style={{
              fontSize: 12,
              fontWeight: "500",
              color: isDark ? "#ccccccff" : "#000000ff",
              opacity: 0.7,
              marginTop: 4,
            }}
          >
            v1.0.0
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
