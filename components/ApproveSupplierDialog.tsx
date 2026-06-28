import React, { useState } from "react";
import { View, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { styles } from "./styles/applicationDetailStyles";
import {
  Text,
  TextInput,
  Button,
  Dialog,
  Portal,
  useTheme,
  ActivityIndicator,
} from "react-native-paper";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import type { SupplierApplicationDoc } from "../types/convex";
import type { Id } from "../convex/_generated/dataModel";

const ALL_CATEGORIES = [
  { label: "Cement", icon: "circle-outline", color: "#6B7280" },
  { label: "Steel", icon: "nail", color: "#4B5563" },
  { label: "RMC", icon: "truck-cargo-container", color: "#7C3AED" },
  { label: "Sand", icon: "wave", color: "#D97706" },
  { label: "Aggregate", icon: "terrain", color: "#92400E" },
  { label: "Bricks", icon: "wall", color: "#B91C1C" },
];

interface Props {
  visible: boolean;
  application: SupplierApplicationDoc;
  onDismiss: () => void;
  onSuccess: () => void;
}

export function ApproveSupplierDialog({
  visible,
  application,
  onDismiss,
  onSuccess,
}: Props) {
  const theme = useTheme();
  const addSupplier = useMutation(api.suppliers.addSupplier);
  const approveApplication = useMutation(
    api.supplierApplications.approveApplication,
  );

  const defaultUsername = application.businessName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");

  const [businessName, setBusinessName] = useState(application.businessName);
  const [username, setUsername] = useState(defaultUsername);
  const [email, setEmail] = useState(application.email);
  const [phone, setPhone] = useState(application.phone);
  const [area, setArea] = useState(application.area);
  const [address, setAddress] = useState(application.address ?? "");
  const [mapUrl, setMapUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    application.categories,
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleCategory = (label: string) => {
    setSelectedCategories((prev) =>
      prev.includes(label) ? prev.filter((c) => c !== label) : [...prev, label],
    );
  };

  const handleCreate = async () => {
    if (!businessName.trim()) return setError("Business name is required.");
    if (!username.trim()) return setError("Username is required.");
    if (!email.trim()) return setError("Email is required.");
    if (!phone.trim()) return setError("Phone is required.");
    if (!area.trim()) return setError("Area is required.");
    if (selectedCategories.length === 0)
      return setError("Select at least one category.");
    if (!password.trim())
      return setError("Password is required to create the account.");

    setError("");
    setLoading(true);
    try {
      await addSupplier({
        businessName: businessName.trim(),
        username: username.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password: password.trim(),
        area: area.trim(),
        address: address.trim() || undefined,
        categories: selectedCategories,
        notes: notes.trim() || undefined,
        mapUrl: mapUrl.trim() || undefined,
      });
      await approveApplication({
        id: application._id as Id<"supplierApplications">,
      });
      onSuccess();
    } catch (e: any) {
      setError(e?.message ?? "Failed to create supplier. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Portal>
      <Dialog
        visible={visible}
        onDismiss={onDismiss}
        style={{
          borderRadius: 20,
          maxHeight: "90%",
          backgroundColor: theme.colors.surface,
        }}
      >
        <Dialog.Title style={{ fontWeight: "800", fontSize: 18 }}>
          Create Supplier Account
        </Dialog.Title>
        <Dialog.ScrollArea style={styles.dialogScrollArea}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <View style={{ padding: 4, paddingBottom: 16 }}>
                {error ? (
                  <View style={styles.dialogErrorBox}>
                    <MaterialCommunityIcons
                      name="alert-circle"
                      size={14}
                      color="#DC2626"
                    />
                    <Text style={styles.dialogErrorText}>{error}</Text>
                  </View>
                ) : null}

                <View style={styles.dialogSection}>
                  <Text
                    style={[
                      styles.dialogSectionTitle,
                      { color: theme.colors.onSurfaceVariant },
                    ]}
                  >
                    Business Details
                  </Text>
                  <TextInput
                    label="Business Name *"
                    value={businessName}
                    onChangeText={(t) => {
                      setBusinessName(t);
                      setError("");
                    }}
                    mode="outlined"
                    dense
                    left={<TextInput.Icon icon="store" />}
                    style={styles.dialogInput}
                    outlineColor={theme.colors.outline}
                    activeOutlineColor={theme.colors.primary}
                  />
                  <TextInput
                    label="Area *"
                    value={area}
                    onChangeText={(t) => {
                      setArea(t);
                      setError("");
                    }}
                    mode="outlined"
                    dense
                    left={<TextInput.Icon icon="map-marker" />}
                    style={styles.dialogInput}
                    outlineColor={theme.colors.outline}
                    activeOutlineColor={theme.colors.primary}
                  />
                  <TextInput
                    label="Full Address"
                    value={address}
                    onChangeText={setAddress}
                    mode="outlined"
                    dense
                    left={<TextInput.Icon icon="home" />}
                    style={styles.dialogInput}
                    outlineColor={theme.colors.outline}
                    activeOutlineColor={theme.colors.primary}
                  />
                  <TextInput
                    label="Google Map URL"
                    value={mapUrl}
                    onChangeText={setMapUrl}
                    mode="outlined"
                    dense
                    autoCapitalize="none"
                    left={<TextInput.Icon icon="map-marker-outline" />}
                    style={styles.dialogInput}
                    outlineColor={theme.colors.outline}
                    activeOutlineColor={theme.colors.primary}
                  />
                </View>

                <View style={styles.dialogSection}>
                  <Text
                    style={[
                      styles.dialogSectionTitle,
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
                    dense
                    autoCapitalize="none"
                    left={<TextInput.Icon icon="account" />}
                    style={styles.dialogInput}
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
                    dense
                    autoCapitalize="none"
                    keyboardType="email-address"
                    left={<TextInput.Icon icon="email" />}
                    style={styles.dialogInput}
                    outlineColor={theme.colors.outline}
                    activeOutlineColor={theme.colors.primary}
                  />
                  <TextInput
                    label="Phone *"
                    value={phone}
                    onChangeText={(t) => {
                      setPhone(t);
                      setError("");
                    }}
                    mode="outlined"
                    dense
                    keyboardType="phone-pad"
                    left={<TextInput.Icon icon="phone" />}
                    style={styles.dialogInput}
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
                    dense
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    left={<TextInput.Icon icon="lock" />}
                    right={
                      <TextInput.Icon
                        icon={showPassword ? "eye-off" : "eye"}
                        onPress={() => setShowPassword((v) => !v)}
                      />
                    }
                    style={styles.dialogInput}
                    outlineColor={theme.colors.outline}
                    activeOutlineColor={theme.colors.primary}
                  />
                </View>

                <View style={styles.dialogSection}>
                  <Text
                    style={[
                      styles.dialogSectionTitle,
                      { color: theme.colors.onSurfaceVariant },
                    ]}
                  >
                    Categories *
                  </Text>
                  <View style={styles.dialogCategoryGrid}>
                    {ALL_CATEGORIES.map((cat) => {
                      const selected = selectedCategories.includes(cat.label);
                      return (
                        <View
                          key={cat.label}
                          style={[
                            styles.dialogCatTile,
                            {
                              backgroundColor: selected
                                ? cat.color + "18"
                                : theme.colors.surfaceVariant,
                              borderColor: selected ? cat.color : "transparent",
                            },
                          ]}
                        >
                          <MaterialCommunityIcons
                            name={cat.icon as any}
                            size={14}
                            color={
                              selected
                                ? cat.color
                                : theme.colors.onSurfaceVariant
                            }
                            onPress={() => {
                              toggleCategory(cat.label);
                              setError("");
                            }}
                          />
                          <Text
                            style={[
                              styles.dialogCatText,
                              {
                                color: selected
                                  ? cat.color
                                  : theme.colors.onSurface,
                              },
                            ]}
                            onPress={() => {
                              toggleCategory(cat.label);
                              setError("");
                            }}
                          >
                            {cat.label}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                </View>

                <View style={styles.dialogSection}>
                  <Text
                    style={[
                      styles.dialogSectionTitle,
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
                    dense
                    multiline
                    numberOfLines={2}
                    left={<TextInput.Icon icon="note-text" />}
                    style={styles.dialogInput}
                    outlineColor={theme.colors.outline}
                    activeOutlineColor={theme.colors.primary}
                  />
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </Dialog.ScrollArea>
        <Dialog.Actions
          style={{ gap: 8, paddingHorizontal: 16, paddingBottom: 16 }}
        >
          <Button
            onPress={onDismiss}
            disabled={loading}
            textColor={theme.colors.onSurfaceVariant}
          >
            Cancel
          </Button>
          <Button
            mode="contained"
            onPress={handleCreate}
            loading={loading}
            disabled={loading}
            style={{ borderRadius: 10 }}
            contentStyle={{ height: 42 }}
          >
            {loading ? "Creating..." : "Create Supplier Account"}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
