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
import { useAppTheme } from "../../context/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";

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
  const insets = useSafeAreaInsets();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const gradientColors = isDark
    ? (["#2E1B2C", "#0F172A"] as const)
    : (["#D2E9FC", "#F5F7FA"] as const);

  const handleLogin = async () => {
    if (!phone.trim() || !password.trim()) {
      setError("Please enter phone number and password.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await login(phone.trim(), password);
    } catch (e: any) {
      const msg = e?.message ?? "Login failed. Please try again.";
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
          Sign In
        </Text>
        <Text
          style={[
            styles.loginSubtitle,
            { color: isDark ? "rgba(255,255,255,0.6)" : "rgba(71,85,105,0.8)" },
          ]}
        >
          Welcome to BuildRate
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
            label="Phone Number"
            value={phone}
            onChangeText={(t) => {
              setPhone(t);
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
            label="Password"
            value={password}
            onChangeText={(t) => {
              setPassword(t);
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
            {loading ? "Signing In..." : "Sign In"}
          </Button>
        </Surface>

        <View style={{ height: 16 }} />

        <Surface
          style={[styles.infoCard, { backgroundColor: theme.colors.surface }]}
          elevation={1}
        >
          <Text
            style={[styles.cardTitle, { color: theme.colors.onSurfaceVariant }]}
          >
            Preferences
          </Text>
          <Text style={[styles.prefLabel, { color: theme.colors.onSurface }]}>
            App Theme
          </Text>
          <SegmentedButtons
            value={preference}
            onValueChange={(v) =>
              setPreference(v as "light" | "dark" | "system")
            }
            style={styles.segmented}
            buttons={[
              { value: "light", label: "Light", icon: "white-balance-sunny" },
              { value: "system", label: "System", icon: "theme-light-dark" },
              { value: "dark", label: "Dark", icon: "weather-night" },
            ]}
          />
        </Surface>
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
      alert("Permission to access photo library is required!");
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

  const gradientColors = isDark
    ? (["#2E1B2C", "#0F172A"] as const)
    : (["#D2E9FC", "#F5F7FA"] as const);

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
            {user?.role === "admin" ? "Admin" : "Supplier"}
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
                <Text style={styles.adminPanelTitle}>Manage Materials</Text>
                <Text style={styles.adminPanelSub}>
                  Update your material prices & stock
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
            Account Info
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
                Username
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
                Email
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
                Member Since
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
              Business Details
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
                      Business Name
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
                      Phone Number
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

            {user?.city && (
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
                      City / Location
                    </Text>
                    <Text
                      style={[
                        styles.infoValue,
                        { color: theme.colors.onSurface },
                      ]}
                    >
                      {user.city}
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
                      Full Address
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

            {user?.gstNumber && (
              <>
                <View style={styles.infoRow}>
                  <MaterialCommunityIcons
                    name="file-certificate-outline"
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
                      GST Number
                    </Text>
                    <Text
                      style={[
                        styles.infoValue,
                        { color: theme.colors.onSurface },
                      ]}
                    >
                      {user.gstNumber}
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
                    Dealing Categories
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
                <Text style={styles.adminPanelTitle}>Admin Panel</Text>
                <Text style={styles.adminPanelSub}>
                  Manage suppliers & categories
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
            Preferences
          </Text>
          <Text style={[styles.prefLabel, { color: theme.colors.onSurface }]}>
            App Theme
          </Text>
          <SegmentedButtons
            value={preference}
            onValueChange={(v) =>
              setPreference(v as "light" | "dark" | "system")
            }
            style={styles.segmented}
            buttons={[
              { value: "light", label: "Light", icon: "white-balance-sunny" },
              { value: "system", label: "System", icon: "theme-light-dark" },
              { value: "dark", label: "Dark", icon: "weather-night" },
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
          Sign Out
        </Button>

        <View style={{ alignItems: "center", marginTop: 20, marginBottom: 0 }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              color: isDark ? "#ccccccff" : "#000000ff",
              letterSpacing: 0.5,
            }}
          >
            © 2026 BuildRate. All rights reserved.
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
