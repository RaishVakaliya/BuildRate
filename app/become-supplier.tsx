import React, { useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { styles } from "../components/styles/supplierApplicationStyles";
import { Text, TextInput, Button, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useMutation } from "convex/react";
import { useRouter } from "expo-router";
import { api } from "../convex/_generated/api";
import { useAppTheme } from "../context/ThemeContext";

const ALL_CATEGORIES = [
  { label: "Cement", icon: "circle-outline", color: "#6B7280" },
  { label: "Steel", icon: "nail", color: "#4B5563" },
  { label: "RMC", icon: "truck-cargo-container", color: "#7C3AED" },
  { label: "Sand", icon: "wave", color: "#D97706" },
  { label: "Aggregate", icon: "terrain", color: "#92400E" },
  { label: "Bricks", icon: "wall", color: "#B91C1C" },
];

export default function BecomeSupplierScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { resolvedScheme } = useAppTheme();
  const isDark = resolvedScheme === "dark";

  const submitApplication = useMutation(
    api.supplierApplications.submitApplication,
  );

  const [businessName, setBusinessName] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [area, setArea] = useState("");
  const [address, setAddress] = useState("");
  const [mapUrl, setMapUrl] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const gradientColors = isDark
    ? (["#1b2e2eff", "#0F172A"] as const)
    : (["#D2E9FC", "#F5F7FA"] as const);

  const toggleCategory = (label: string) => {
    setSelectedCategories((prev) =>
      prev.includes(label) ? prev.filter((c) => c !== label) : [...prev, label],
    );
  };

  const handleSubmit = async () => {
    if (!businessName.trim()) return setError("Business name is required.");
    if (!username.trim()) return setError("Username is required.");
    if (!phone.trim()) return setError("Phone number is required.");
    if (!email.trim()) return setError("Email is required.");
    if (!area.trim()) return setError("Area is required.");
    if (selectedCategories.length === 0)
      return setError("Select at least one category.");

    setError("");
    setLoading(true);
    try {
      await submitApplication({
        businessName: businessName.trim(),
        username: username.trim(),
        phone: phone.trim(),
        email: email.trim(),
        area: area.trim(),
        address: address.trim() || undefined,
        mapUrl: mapUrl.trim() || undefined,
        gstNumber: gstNumber.trim() || undefined,
        categories: selectedCategories,
        notes: notes.trim() || undefined,
      });
      setSubmitted(true);
    } catch (e: any) {
      setError(e?.message ?? "Failed to submit application. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
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
                    : "rgba(26,86,219,0.08)",
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
          </View>
        </LinearGradient>
        <View style={styles.successWrap}>
          <View style={[styles.successIcon, { backgroundColor: "#DCFCE7" }]}>
            <MaterialCommunityIcons
              name="check-circle"
              size={52}
              color="#16A34A"
            />
          </View>
          <Text
            style={[styles.successTitle, { color: theme.colors.onBackground }]}
          >
            Application Submitted!
          </Text>
          <Text
            style={[
              styles.successSubtitle,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            Your supplier application has been received. Our team will review it
            and get in touch with you soon.
          </Text>
          <Button
            mode="contained"
            onPress={() => router.back()}
            style={{ borderRadius: 12, marginTop: 8 }}
            contentStyle={{ height: 50 }}
          >
            Back to Home
          </Button>
        </View>
      </View>
    );
  }

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
                  : "rgba(26,86,219,0.08)",
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
              Become a Supplier
            </Text>
            <Text
              style={[
                styles.headerSub,
                {
                  color: isDark
                    ? "rgba(255,255,255,0.65)"
                    : "rgba(71,85,105,0.8)",
                },
              ]}
            >
              Submit your business information
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

        <View style={[styles.section, { backgroundColor: theme.colors.surface, elevation: 1 }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.onSurfaceVariant }]}>
            Business Info
          </Text>
          <TextInput
            label="Business / Store Name *"
            value={businessName}
            onChangeText={(t) => { setBusinessName(t); setError(""); }}
            mode="outlined"
            left={<TextInput.Icon icon="store" />}
            style={styles.input}
            outlineColor={theme.colors.outline}
            activeOutlineColor={theme.colors.primary}
          />
          <TextInput
            label="Area *"
            placeholder="e.g. Sarkhej, Thaltej, Bopal"
            value={area}
            onChangeText={(t) => { setArea(t); setError(""); }}
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
            label="Google Map URL"
            value={mapUrl}
            onChangeText={setMapUrl}
            mode="outlined"
            left={<TextInput.Icon icon="map-marker-radius" />}
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
            left={<TextInput.Icon icon="card-account-details-outline" />}
            style={styles.input}
            outlineColor={theme.colors.outline}
            activeOutlineColor={theme.colors.primary}
          />
        </View>

        <View style={[styles.section, { backgroundColor: theme.colors.surface, elevation: 1 }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.onSurfaceVariant }]}>
            Login Credentials
          </Text>
          <TextInput
            label="Username *"
            value={username}
            onChangeText={(t) => { setUsername(t); setError(""); }}
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
            onChangeText={(t) => { setEmail(t); setError(""); }}
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
            onChangeText={(t) => { setPhone(t); setError(""); }}
            mode="outlined"
            keyboardType="phone-pad"
            left={<TextInput.Icon icon="phone" />}
            style={styles.input}
            outlineColor={theme.colors.outline}
            activeOutlineColor={theme.colors.primary}
          />
        </View>

        <View
          style={[
            styles.section,
            { backgroundColor: theme.colors.surface, elevation: 1 },
          ]}
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
            Select the materials your business deals in
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
                  onPress={() => {
                    toggleCategory(cat.label);
                    setError("");
                  }}
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
        </View>

        <View
          style={[
            styles.section,
            { backgroundColor: theme.colors.surface, elevation: 1 },
          ]}
        >
          <Text
            style={[
              styles.sectionTitle,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            Business Notes
          </Text>
          <TextInput
            label="Tell us about your business (optional)"
            value={notes}
            onChangeText={setNotes}
            mode="outlined"
            multiline
            numberOfLines={4}
            left={<TextInput.Icon icon="text-box-outline" />}
            style={styles.input}
            outlineColor={theme.colors.outline}
            activeOutlineColor={theme.colors.primary}
          />
        </View>

        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={loading}
          disabled={loading}
          icon="send"
          contentStyle={styles.submitContent}
          style={styles.submitBtn}
          labelStyle={styles.submitLabel}
        >
          {loading ? "Submitting..." : "Submit Application"}
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
