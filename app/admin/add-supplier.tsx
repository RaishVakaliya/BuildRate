import React, { useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Text, TextInput, Button, Surface, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useMutation } from "convex/react";
import { useRouter } from "expo-router";
import { api } from "../../convex/_generated/api";
import { useAppTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";

const ALL_CATEGORIES = [
  { label: "Cement", icon: "circle-outline", color: "#6B7280" },
  { label: "Steel", icon: "nail", color: "#4B5563" },
  { label: "RMC", icon: "truck-cargo-container", color: "#7C3AED" },
  { label: "Sand", icon: "wave", color: "#D97706" },
  { label: "Aggregate", icon: "terrain", color: "#92400E" },
  { label: "Bricks", icon: "wall", color: "#B91C1C" },
];

export default function AddSupplierScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { resolvedScheme } = useAppTheme();
  const { user } = useAuth();
  const isDark = resolvedScheme === "dark";

  React.useEffect(() => {
    if (user?.role !== "admin") {
      router.replace("/(tabs)/account");
    }
  }, [user, router]);

  const addSupplier = useMutation(api.suppliers.addSupplier);

  const [businessName, setBusinessName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const gradientColors = isDark
    ? (["#1A2540", "#0F172A"] as const)
    : (["#E6F2FF", "#F5F7FA"] as const);

  const toggleCategory = (label: string) => {
    setSelectedCategories((prev) =>
      prev.includes(label) ? prev.filter((c) => c !== label) : [...prev, label],
    );
  };

  const handleSubmit = async () => {
    if (!businessName.trim()) return setError("Business name is required.");
    if (!username.trim()) return setError("Username is required.");
    if (!email.trim()) return setError("Email is required.");
    if (!phone.trim()) return setError("Phone number is required.");
    if (!password.trim()) return setError("Password is required.");
    if (!city.trim()) return setError("City is required.");
    if (selectedCategories.length === 0)
      return setError("Select at least one category.");

    setError("");
    setLoading(true);
    try {
      await addSupplier({
        businessName: businessName.trim(),
        username: username.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password,
        city: city.trim(),
        address: address.trim() || undefined,
        categories: selectedCategories,
        gstNumber: gstNumber.trim() || undefined,
        notes: notes.trim() || undefined,
      });
      router.back();
    } catch (e: any) {
      setError(e?.message ?? "Failed to add supplier. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.root, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <LinearGradient
        colors={gradientColors}
        style={[styles.header, { paddingTop: insets.top + 12 }]}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={[
              styles.backBtn,
              {
                backgroundColor: isDark
                  ? "rgba(255,255,255,0.12)"
                  : "rgba(26, 86, 219, 0.08)",
              },
            ]}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={24}
              color={isDark ? "#FFF" : "#1E3A8A"}
            />
          </TouchableOpacity>
          <View>
            <Text
              style={[
                styles.headerTitle,
                { color: isDark ? "#FFF" : "#1E3A8A" },
              ]}
            >
              Add Supplier
            </Text>
            <Text
              style={[
                styles.headerSub,
                {
                  color: isDark
                    ? "rgba(255,255,255,0.65)"
                    : "rgba(71, 85, 105, 0.8)",
                },
              ]}
            >
              Fill in supplier details
            </Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.body,
          { paddingBottom: insets.bottom + 32 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
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

        <Surface
          style={[styles.section, { backgroundColor: theme.colors.surface }]}
          elevation={1}
        >
          <Text
            style={[
              styles.sectionTitle,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            Business Info
          </Text>
          <TextInput
            label="Business / Store Name *"
            value={businessName}
            onChangeText={(t) => {
              setBusinessName(t);
              setError("");
            }}
            mode="outlined"
            left={<TextInput.Icon icon="store" />}
            style={styles.input}
            outlineColor={theme.colors.outline}
            activeOutlineColor={theme.colors.primary}
          />
          <TextInput
            label="City *"
            value={city}
            onChangeText={(t) => {
              setCity(t);
              setError("");
            }}
            mode="outlined"
            left={<TextInput.Icon icon="map-marker" />}
            style={styles.input}
            outlineColor={theme.colors.outline}
            activeOutlineColor={theme.colors.primary}
          />
          <TextInput
            label="Full Address"
            value={address}
            onChangeText={setAddress}
            mode="outlined"
            left={<TextInput.Icon icon="home" />}
            style={styles.input}
            outlineColor={theme.colors.outline}
            activeOutlineColor={theme.colors.primary}
          />
          <TextInput
            label="GST Number"
            value={gstNumber}
            onChangeText={setGstNumber}
            mode="outlined"
            autoCapitalize="characters"
            left={<TextInput.Icon icon="file-certificate" />}
            style={styles.input}
            outlineColor={theme.colors.outline}
            activeOutlineColor={theme.colors.primary}
          />
        </Surface>

        <Surface
          style={[styles.section, { backgroundColor: theme.colors.surface }]}
          elevation={1}
        >
          <Text
            style={[
              styles.sectionTitle,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            Login Credentials
          </Text>
          <TextInput
            label="Username *"
            value={username}
            onChangeText={(t) => {
              setUsername(t);
              setError("");
            }}
            mode="outlined"
            autoCapitalize="none"
            left={<TextInput.Icon icon="account" />}
            style={styles.input}
            outlineColor={theme.colors.outline}
            activeOutlineColor={theme.colors.primary}
          />
          <TextInput
            label="Email *"
            value={email}
            onChangeText={(t) => {
              setEmail(t);
              setError("");
            }}
            mode="outlined"
            autoCapitalize="none"
            keyboardType="email-address"
            left={<TextInput.Icon icon="email" />}
            style={styles.input}
            outlineColor={theme.colors.outline}
            activeOutlineColor={theme.colors.primary}
          />
          <TextInput
            label="Phone Number *"
            value={phone}
            onChangeText={(t) => {
              setPhone(t);
              setError("");
            }}
            mode="outlined"
            keyboardType="phone-pad"
            left={<TextInput.Icon icon="phone" />}
            style={styles.input}
            outlineColor={theme.colors.outline}
            activeOutlineColor={theme.colors.primary}
          />
          <TextInput
            label="Password *"
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
        </Surface>

        <Surface
          style={[styles.section, { backgroundColor: theme.colors.surface }]}
          elevation={1}
        >
          <Text
            style={[
              styles.sectionTitle,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            Material Categories *
          </Text>
          <Text
            style={[
              styles.sectionHint,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            Select the materials this supplier deals in
          </Text>
          <View style={styles.categoryGrid}>
            {ALL_CATEGORIES.map((cat) => {
              const selected = selectedCategories.includes(cat.label);
              return (
                <TouchableOpacity
                  key={cat.label}
                  style={[
                    styles.catTile,
                    {
                      backgroundColor: selected
                        ? cat.color + "20"
                        : theme.colors.surfaceVariant,
                      borderColor: selected ? cat.color : "transparent",
                      borderWidth: selected ? 1.5 : 0,
                    },
                  ]}
                  onPress={() => toggleCategory(cat.label)}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.catIconWrap,
                      { backgroundColor: cat.color + "18" },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={cat.icon as any}
                      size={20}
                      color={cat.color}
                    />
                  </View>
                  <Text
                    style={[
                      styles.catLabel,
                      { color: selected ? cat.color : theme.colors.onSurface },
                    ]}
                  >
                    {cat.label}
                  </Text>
                  {selected && (
                    <View
                      style={[styles.checkMark, { backgroundColor: cat.color }]}
                    >
                      <MaterialCommunityIcons
                        name="check"
                        size={10}
                        color="#FFF"
                      />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </Surface>

        <Surface
          style={[styles.section, { backgroundColor: theme.colors.surface }]}
          elevation={1}
        >
          <Text
            style={[
              styles.sectionTitle,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            Admin Notes
          </Text>
          <TextInput
            label="Internal notes (optional)"
            value={notes}
            onChangeText={setNotes}
            mode="outlined"
            multiline
            numberOfLines={3}
            left={<TextInput.Icon icon="note-text" />}
            style={styles.input}
            outlineColor={theme.colors.outline}
            activeOutlineColor={theme.colors.primary}
          />
        </Surface>

        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={loading}
          disabled={loading}
          icon="check"
          contentStyle={styles.submitContent}
          style={styles.submitBtn}
          labelStyle={styles.submitLabel}
        >
          {loading ? "Adding Supplier..." : "Add Supplier"}
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 28 },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    color: "#FFF",
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.4,
  },
  headerSub: {
    color: "rgba(255,255,255,0.65)",
    fontSize: 12,
    fontWeight: "500",
    marginTop: 1,
  },
  scrollView: { marginTop: -12 },
  body: { padding: 16, gap: 14 },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FEE2E2",
    borderRadius: 12,
    padding: 12,
  },
  errorText: { fontSize: 13, color: "#DC2626", flex: 1, fontWeight: "500" },
  section: { borderRadius: 18, padding: 18, gap: 12 },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  sectionHint: { fontSize: 12, marginTop: -8, marginBottom: 4 },
  input: { backgroundColor: "transparent" },
  categoryGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  catTile: {
    width: "30%",
    alignItems: "center",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 6,
    gap: 6,
    position: "relative",
  },
  catIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  catLabel: { fontSize: 11, fontWeight: "600", textAlign: "center" },
  checkMark: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  submitBtn: { borderRadius: 14, marginTop: 4 },
  submitContent: { height: 54 },
  submitLabel: { fontSize: 15, fontWeight: "700", letterSpacing: 0.3 },
});
