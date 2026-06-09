import React, { useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
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
import { useAuth } from "../../context/AuthContext";
import { useAppTheme } from "../../context/ThemeContext";

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
    return <LoginScreen isDark={isDark} />;
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

function LoginScreen({ isDark }: { isDark: boolean }) {
  const theme = useTheme();
  const { login } = useAuth();
  const insets = useSafeAreaInsets();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const gradientColors = isDark
    ? (["#1E293B", "#111827"] as const)
    : (["#E6F2FF", "#FFFFFF"] as const);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setError("Please enter username and password.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await login(username.trim(), password);
    } catch (e: any) {
      setError(e?.message ?? "Login failed. Please try again.");
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
          Welcome to RateGuru
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
            label="Username"
            value={username}
            onChangeText={(t) => {
              setUsername(t);
              setError("");
            }}
            mode="outlined"
            autoCapitalize="none"
            autoCorrect={false}
            left={<TextInput.Icon icon="account" />}
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
  const { user, logout } = useAuth();

  const gradientColors = isDark
    ? (["#1E293B", "#111827"] as const)
    : (["#E6F2FF", "#FFFFFF"] as const);

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
        <View
          style={[
            styles.avatar,
            { backgroundColor: isDark ? "#1A56DB" : "#1A56DB" },
          ]}
        >
          <Text style={styles.avatarText}>{initial}</Text>
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
            name="shield-check"
            size={13}
            color={isDark ? "#4F8EF7" : "#1A56DB"}
          />
          <Text
            style={[styles.roleText, { color: isDark ? "#4F8EF7" : "#1A56DB" }]}
          >
            Admin
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
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  centered: { flex: 1, alignItems: "center", justifyContent: "center" },

  loginHeader: {
    alignItems: "center",
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
  loginLogoWrap: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "rgba(26,86,219,0.08)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  loginTitle: { fontSize: 26, fontWeight: "800", letterSpacing: -0.5 },
  loginSubtitle: { fontSize: 13, fontWeight: "500", marginTop: 4 },

  loginBody: { padding: 20 },
  loginCard: {
    borderRadius: 20,
    padding: 24,
    gap: 14,
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FEE2E2",
    borderRadius: 10,
    padding: 12,
  },
  errorText: { fontSize: 13, color: "#DC2626", flex: 1, fontWeight: "500" },
  input: { backgroundColor: "transparent" },
  loginBtn: { borderRadius: 12, marginTop: 4 },
  loginBtnContent: { height: 52 },
  loginBtnLabel: { fontSize: 15, fontWeight: "700", letterSpacing: 0.3 },

  profileHeader: {
    alignItems: "center",
    paddingBottom: 36,
    paddingHorizontal: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  avatarText: { fontSize: 34, fontWeight: "800", color: "#FFFFFF" },
  profileName: { fontSize: 22, fontWeight: "800", letterSpacing: -0.3 },
  profileEmail: { fontSize: 13, fontWeight: "500", marginTop: 3 },
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginTop: 10,
  },
  roleText: { fontSize: 12, fontWeight: "700" },

  scrollView: { marginTop: -20 },
  profileBody: { padding: 16, gap: 14 },

  infoCard: {
    borderRadius: 18,
    padding: 18,
    gap: 4,
  },
  cardTitle: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 6,
  },
  infoTextWrap: { flex: 1 },
  infoLabel: { fontSize: 11, fontWeight: "500", marginBottom: 1 },
  infoValue: { fontSize: 14, fontWeight: "600" },
  divider: {
    height: 1,
    backgroundColor: "rgba(0,0,0,0.06)",
    marginVertical: 4,
  },

  prefLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
    marginTop: 4,
  },
  segmented: { borderRadius: 10 },

  logoutBtn: { borderRadius: 12, borderWidth: 1.5, marginTop: 4 },
  logoutContent: { height: 50 },
});
