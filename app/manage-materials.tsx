import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
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
import { useQuery, useMutation } from "convex/react";
import { useRouter } from "expo-router";
import { api } from "../convex/_generated/api";
import { useAuth } from "../context/AuthContext";
import { useAppTheme } from "../context/ThemeContext";
import { styles } from "../components/styles/manageMaterialsStyles";
import { Dropdown } from "react-native-element-dropdown";

const CATEGORIES = [
  { label: "Cement", icon: "circle-outline", color: "#6B7280" },
  { label: "Steel", icon: "nail", color: "#4B5563" },
  { label: "RMC", icon: "truck-cargo-container", color: "#7C3AED" },
  { label: "Sand", icon: "wave", color: "#D97706" },
  { label: "Aggregate", icon: "terrain", color: "#92400E" },
  { label: "Bricks", icon: "wall", color: "#B91C1C" },
];

const CATEGORY_MAP: Record<string, { color: string; icon: string }> = {
  Cement: { color: "#6B7280", icon: "circle-outline" },
  Steel: { color: "#4B5563", icon: "nail" },
  RMC: { color: "#7C3AED", icon: "truck-cargo-container" },
  Sand: { color: "#D97706", icon: "wave" },
  Aggregate: { color: "#92400E", icon: "terrain" },
  Bricks: { color: "#B91C1C", icon: "wall" },
};

const SUGGESTIONS: Record<
  string,
  { names: string[]; brands: string[]; units: string[] }
> = {
  Cement: {
    names: [
      "OPC 53 Grade",
      "OPC 43 Grade",
      "PPC (Portland Pozzolana)",
      "PSC (Portland Slag)",
      "White Cement",
    ],
    brands: [
      "UltraTech",
      "Ambuja",
      "ACC",
      "Shree Cement",
      "Birla Gold",
      "Dalmia",
      "JK Lakshmi",
      "Nuvoco",
    ],
    units: ["bag", "MT"],
  },
  Steel: {
    names: [
      "TMT Bar Fe 500D",
      "TMT Bar Fe 550D",
      "TMT Bar Fe 600",
      "Binding Wire",
      "Structural Steel",
    ],
    brands: [
      "Tata Tiscon",
      "JSW Neosteel",
      "SAIL",
      "Jindal Panther",
      "Vizag Steel",
      "Shyam Steel",
    ],
    units: ["MT", "kg", "ton"],
  },
  RMC: {
    names: ["M20 Grade", "M25 Grade", "M30 Grade", "M35 Grade", "M40 Grade"],
    brands: [
      "UltraTech RMC",
      "ACC RMC",
      "Aparna RMC",
      "RMC Readymix India",
      "Local RMC",
    ],
    units: ["cum", "brass"],
  },
  Sand: {
    names: [
      "River Sand",
      "M-Sand (Manufactured Sand)",
      "Plaster Sand",
      "Concrete Sand",
    ],
    brands: ["Premium Quality", "VSI Sand", "Local Sand", "Wash Sand"],
    units: ["brass", "ton", "cum"],
  },
  Aggregate: {
    names: [
      "10mm Aggregate",
      "20mm Aggregate",
      "40mm Aggregate",
      "Crushed Stone Dust",
    ],
    brands: ["Premium Hard Granite", "Local Blue Metal", "Crushed Trap Rock"],
    units: ["brass", "ton", "cum"],
  },
  Bricks: {
    names: [
      "Red Clay Bricks",
      "Fly Ash Bricks",
      "AAC Blocks (4 inch)",
      "AAC Blocks (6 inch)",
      "AAC Blocks (8 inch)",
      "Concrete Blocks",
    ],
    brands: [
      "JK SmartBlox",
      "Aerocon Blocks",
      "Biltech AAC",
      "Premium Clay Bricks",
      "Local Brick Kiln",
    ],
    units: ["piece", "thousand", "brass"],
  },
};

export default function ManageMaterialsScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();
  const { resolvedScheme } = useAppTheme();
  const isDark = resolvedScheme === "dark";

  useEffect(() => {
    if (!user || user.role !== "supplier") {
      router.replace("/(tabs)/account");
    }
  }, [user, router]);

  const materials = useQuery(
    api.materials.listSupplierMaterials,
    user?.id ? { supplierId: user.id as any } : ("skip" as any),
  );

  const addMaterial = useMutation(api.materials.addMaterial);
  const updateMaterial = useMutation(api.materials.updateMaterial);
  const deleteMaterial = useMutation(api.materials.deleteMaterial);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [category, setCategory] = useState("Cement");
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [unit, setUnit] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState<"available" | "out_of_stock">(
    "available",
  );
  const [notes, setNotes] = useState("");

  const [isCustomNameSelected, setIsCustomNameSelected] = useState(false);
  const [isCustomBrandSelected, setIsCustomBrandSelected] = useState(false);
  const [isCustomUnitSelected, setIsCustomUnitSelected] = useState(false);

  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  const filteredCategories = CATEGORIES.filter((cat) =>
    user?.categories ? user.categories.includes(cat.label) : true,
  );

  const gradientColors = isDark
    ? (["#3e291aff", "#0F172A"] as const)
    : (["#FFE8D6", "#F5F7FA"] as const);

  const openAddModal = () => {
    setEditingId(null);
    const defaultCat =
      filteredCategories.length > 0 ? filteredCategories[0].label : "Cement";
    setCategory(defaultCat);
    setName("");
    setBrand("");
    setUnit("");
    setPrice("");
    setStatus("available");
    setNotes("");
    setFormError("");
    setIsCustomNameSelected(false);
    setIsCustomBrandSelected(false);
    setIsCustomUnitSelected(false);
    setModalVisible(true);
  };

  const openEditModal = (material: any) => {
    setEditingId(material._id);
    setCategory(material.category);
    setName(material.name);
    setBrand(material.brand);
    setUnit(material.unit);
    setPrice(material.price.toString());
    setStatus(material.status);
    setNotes(material.notes ?? "");
    setFormError("");

    const nameSuggestions = SUGGESTIONS[material.category]?.names || [];
    const brandSuggestions = SUGGESTIONS[material.category]?.brands || [];
    const unitSuggestions = SUGGESTIONS[material.category]?.units || [];

    setIsCustomNameSelected(
      material.name !== "" && !nameSuggestions.includes(material.name),
    );
    setIsCustomBrandSelected(
      material.brand !== "" && !brandSuggestions.includes(material.brand),
    );
    setIsCustomUnitSelected(
      material.unit !== "" && !unitSuggestions.includes(material.unit),
    );

    setModalVisible(true);
  };

  const handleDelete = (id: string, materialName: string) => {
    Alert.alert(
      "Remove Material",
      `Are you sure you want to remove "${materialName}" from your supplied catalog?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteMaterial({ id: id as any });
            } catch {
              Alert.alert("Error", "Could not remove material.");
            }
          },
        },
      ],
    );
  };

  const handleSave = async () => {
    if (!name.trim()) return setFormError("Material name is required.");
    if (!brand.trim()) return setFormError("Brand is required.");
    if (!unit.trim()) return setFormError("Unit is required (e.g. bag, MT).");
    if (!price.trim() || isNaN(Number(price)) || Number(price) <= 0) {
      return setFormError("Price must be a valid positive number.");
    }

    setFormError("");
    setLoading(true);
    try {
      if (editingId) {
        await updateMaterial({
          id: editingId as any,
          category,
          name: name.trim(),
          brand: brand.trim(),
          unit: unit.trim(),
          price: Number(price),
          status,
          notes: notes.trim() || undefined,
        });
      } else {
        if (!user?.id) throw new Error("Unauthenticated user ID.");
        await addMaterial({
          supplierId: user.id as any,
          category,
          name: name.trim(),
          brand: brand.trim(),
          unit: unit.trim(),
          price: Number(price),
          status,
          notes: notes.trim() || undefined,
        });
      }
      setModalVisible(false);
    } catch (e: any) {
      setFormError(e?.message ?? "Failed to save material.");
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== "supplier") return null;

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
                  : "rgba(249, 115, 22, 0.08)",
              },
            ]}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={24}
              color={isDark ? "#FFF" : "#C2410C"}
            />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text
              style={[
                styles.headerTitle,
                { color: isDark ? "#FFF" : "#C2410C" },
              ]}
            >
              Manage Materials
            </Text>
            <Text
              style={[
                styles.headerSub,
                {
                  color: isDark
                    ? "rgba(255,255,255,0.65)"
                    : "rgba(120, 53, 4, 0.8)",
                },
              ]}
            >
              Update your catalog & prices
            </Text>
          </View>
        </View>
      </LinearGradient>

      <View
        style={{
          backgroundColor: theme.colors.background,
          paddingVertical: 12,
          zIndex: 10,
        }}
      >
        <Button
          mode="contained"
          onPress={openAddModal}
          icon="plus"
          style={[styles.addBtn, { backgroundColor: "#F97316", marginTop: 0 }]}
          contentStyle={styles.addBtnContent}
          labelStyle={styles.addBtnLabel}
        >
          Add Material
        </Button>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {materials === undefined ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        ) : materials.length === 0 ? (
          <View style={styles.emptyWrap}>
            <MaterialCommunityIcons
              name="package-variant-closed"
              size={64}
              color={theme.colors.onSurfaceVariant}
            />
            <Text
              style={[styles.emptyTitle, { color: theme.colors.onBackground }]}
            >
              Your Catalog is Empty
            </Text>
            <Text
              style={[
                styles.emptySubtitle,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              Tap "Add Material" above to list your construction materials and
              set current prices.
            </Text>
          </View>
        ) : (
          materials.map((item) => {
            const catInfo = CATEGORY_MAP[item.category] || CATEGORY_MAP.Cement;
            const isAvailable = item.status === "available";

            return (
              <Surface
                key={item._id}
                style={[styles.card, { backgroundColor: theme.colors.surface }]}
                elevation={1}
              >
                <View style={styles.cardHeader}>
                  <View
                    style={[
                      styles.catBadge,
                      {
                        backgroundColor: isDark
                          ? "rgba(255,255,255,0.06)"
                          : "rgba(0,0,0,0.04)",
                      },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={catInfo.icon as any}
                      size={12}
                      color={catInfo.color}
                    />
                    <Text
                      style={[
                        styles.catBadgeText,
                        { color: theme.colors.onSurface },
                      ]}
                    >
                      {item.category}
                    </Text>
                  </View>
                  <View style={styles.priceContainer}>
                    <Text
                      style={[styles.priceTag, { color: theme.colors.primary }]}
                    >
                      ₹{item.price.toLocaleString("en-IN")}
                    </Text>
                    <Text
                      style={[
                        styles.unitText,
                        { color: theme.colors.onSurfaceVariant },
                      ]}
                    >
                      per {item.unit}
                    </Text>
                  </View>
                </View>

                <View style={styles.cardBody}>
                  <Text
                    style={[
                      styles.materialName,
                      { color: theme.colors.onSurface },
                    ]}
                  >
                    {item.name}
                  </Text>
                  <Text
                    style={[
                      styles.materialBrand,
                      { color: theme.colors.onSurfaceVariant },
                    ]}
                  >
                    {item.brand}
                  </Text>
                </View>

                {item.notes ? (
                  <View
                    style={[
                      styles.notesContainer,
                      {
                        backgroundColor: isDark
                          ? "rgba(255,255,255,0.03)"
                          : "rgba(0,0,0,0.02)",
                      },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name="information-outline"
                      size={14}
                      color={theme.colors.onSurfaceVariant}
                      style={{ marginTop: 1 }}
                    />
                    <Text
                      style={[
                        styles.notesText,
                        { color: theme.colors.onSurfaceVariant },
                      ]}
                    >
                      {item.notes}
                    </Text>
                  </View>
                ) : null}

                <View
                  style={[
                    styles.divider,
                    { backgroundColor: theme.colors.outlineVariant },
                  ]}
                />

                <View style={styles.cardFooter}>
                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor: isAvailable
                          ? "rgba(22,163,74,0.08)"
                          : "rgba(220,38,38,0.08)",
                      },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={isAvailable ? "check-circle" : "cancel"}
                      size={12}
                      color={isAvailable ? "#16A34A" : "#DC2626"}
                    />
                    <Text
                      style={[
                        styles.statusText,
                        { color: isAvailable ? "#16A34A" : "#DC2626" },
                      ]}
                    >
                      {isAvailable ? "AVAILABLE" : "OUT OF STOCK"}
                    </Text>
                  </View>

                  <View style={styles.cardActions}>
                    <TouchableOpacity
                      style={[
                        styles.circleActionBtn,
                        { backgroundColor: "rgba(25,86,219,0.08)" },
                      ]}
                      onPress={() => openEditModal(item)}
                    >
                      <MaterialCommunityIcons
                        name="pencil-outline"
                        size={16}
                        color={theme.colors.primary}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.circleActionBtn,
                        { backgroundColor: "rgba(220,38,38,0.08)" },
                      ]}
                      onPress={() => handleDelete(item._id, item.name)}
                    >
                      <MaterialCommunityIcons
                        name="trash-can-outline"
                        size={16}
                        color="#DC2626"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </Surface>
            );
          })
        )}
      </ScrollView>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <Surface
            style={[
              styles.modalCard,
              { backgroundColor: theme.colors.elevation.level2 },
            ]}
            elevation={4}
          >
            <View style={styles.modalHeader}>
              <Text
                style={[styles.modalTitle, { color: theme.colors.onSurface }]}
              >
                {editingId ? "Edit Material" : "Add Material"}
              </Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                activeOpacity={0.7}
                style={[
                  styles.modalCloseBtn,
                  {
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.06)"
                      : "rgba(0,0,0,0.04)",
                  },
                ]}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={18}
                  color={theme.colors.onSurfaceVariant}
                />
              </TouchableOpacity>
            </View>

            {formError ? (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "#FEE2E2",
                  padding: 10,
                  borderRadius: 8,
                  gap: 6,
                }}
              >
                <MaterialCommunityIcons
                  name="alert-circle"
                  size={16}
                  color="#DC2626"
                />
                <Text
                  style={{ color: "#DC2626", fontSize: 12, fontWeight: "500" }}
                >
                  {formError}
                </Text>
              </View>
            ) : null}

            <ScrollView
              style={styles.modalScroll}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.modalForm}>
                <View>
                  <Text
                    style={[
                      styles.fieldLabel,
                      { color: theme.colors.onSurfaceVariant },
                    ]}
                  >
                    Category *
                  </Text>
                  <View style={styles.categoryGrid}>
                    {filteredCategories.map((cat) => {
                      const isSelected = category === cat.label;
                      return (
                        <TouchableOpacity
                          key={cat.label}
                          style={[
                            styles.catTile,
                            {
                              backgroundColor: isSelected
                                ? cat.color + "20"
                                : theme.colors.surfaceVariant,
                              borderColor: isSelected
                                ? cat.color
                                : "transparent",
                              borderWidth: isSelected ? 1.5 : 0,
                            },
                          ]}
                          onPress={() => {
                            setCategory(cat.label);
                          }}
                          activeOpacity={0.7}
                        >
                          <View
                            style={[
                              styles.catTileIconWrap,
                              { backgroundColor: cat.color + "18" },
                            ]}
                          >
                            <MaterialCommunityIcons
                              name={cat.icon as any}
                              size={16}
                              color={cat.color}
                            />
                          </View>
                          <Text
                            style={[
                              styles.catTileLabel,
                              {
                                color: isSelected
                                  ? cat.color
                                  : theme.colors.onSurface,
                              },
                            ]}
                          >
                            {cat.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                {/* Material Name Dropdown */}
                <View style={{ zIndex: 3 }}>
                  <Text
                    style={[
                      styles.fieldLabel,
                      { color: theme.colors.onSurfaceVariant },
                    ]}
                  >
                    Material Name *
                  </Text>
                  <Dropdown
                    style={{
                      height: 50,
                      borderColor: theme.colors.outline,
                      borderWidth: 1,
                      borderRadius: 12,
                      paddingHorizontal: 12,
                      backgroundColor: "transparent",
                      marginTop: 4,
                    }}
                    placeholderStyle={{
                      fontSize: 14,
                      color: theme.colors.onSurfaceVariant,
                    }}
                    selectedTextStyle={{
                      fontSize: 14,
                      color: theme.colors.onSurface,
                    }}
                    containerStyle={{
                      backgroundColor:
                        theme.colors.elevation.level3 || theme.colors.surface,
                      borderRadius: 8,
                      borderColor:
                        theme.colors.outlineVariant ||
                        theme.colors.outline ||
                        "rgba(0,0,0,0.1)",
                      borderWidth: 1,
                    }}
                    activeColor={
                      isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)"
                    }
                    itemTextStyle={{
                      color: theme.colors.onSurface,
                      fontSize: 14,
                    }}
                    iconColor={theme.colors.onSurfaceVariant}
                    data={[
                      ...(SUGGESTIONS[category]?.names || []).map((n) => ({
                        label: n,
                        value: n,
                      })),
                      { label: "Other / Write Custom Name", value: "custom" },
                    ]}
                    labelField="label"
                    valueField="value"
                    placeholder="Select Material Name"
                    value={isCustomNameSelected ? "custom" : name}
                    onChange={(item) => {
                      if (item.value === "custom") {
                        setIsCustomNameSelected(true);
                        setName("");
                      } else {
                        setIsCustomNameSelected(false);
                        setName(item.value);
                      }
                      setFormError("");
                    }}
                  />
                  {isCustomNameSelected && (
                    <TextInput
                      label="Enter Custom Material Name *"
                      value={name}
                      onChangeText={(t) => {
                        setName(t);
                        setFormError("");
                      }}
                      mode="outlined"
                      style={[styles.input, { marginTop: 8 }]}
                      outlineColor={theme.colors.outline}
                      activeOutlineColor={theme.colors.primary}
                    />
                  )}
                </View>

                {/* Brand / Manufacturer Dropdown */}
                <View style={{ zIndex: 2 }}>
                  <Text
                    style={[
                      styles.fieldLabel,
                      { color: theme.colors.onSurfaceVariant },
                    ]}
                  >
                    Brand / Manufacturer *
                  </Text>
                  <Dropdown
                    style={{
                      height: 50,
                      borderColor: theme.colors.outline,
                      borderWidth: 1,
                      borderRadius: 12,
                      paddingHorizontal: 12,
                      backgroundColor: "transparent",
                      marginTop: 4,
                    }}
                    placeholderStyle={{
                      fontSize: 14,
                      color: theme.colors.onSurfaceVariant,
                    }}
                    selectedTextStyle={{
                      fontSize: 14,
                      color: theme.colors.onSurface,
                    }}
                    containerStyle={{
                      backgroundColor:
                        theme.colors.elevation.level3 || theme.colors.surface,
                      borderRadius: 8,
                      borderColor:
                        theme.colors.outlineVariant ||
                        theme.colors.outline ||
                        "rgba(0,0,0,0.1)",
                      borderWidth: 1,
                    }}
                    activeColor={
                      isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)"
                    }
                    itemTextStyle={{
                      color: theme.colors.onSurface,
                      fontSize: 14,
                    }}
                    iconColor={theme.colors.onSurfaceVariant}
                    data={[
                      ...(SUGGESTIONS[category]?.brands || []).map((b) => ({
                        label: b,
                        value: b,
                      })),
                      { label: "Other / Write Custom Brand", value: "custom" },
                    ]}
                    labelField="label"
                    valueField="value"
                    placeholder="Select Brand / Manufacturer"
                    value={isCustomBrandSelected ? "custom" : brand}
                    onChange={(item) => {
                      if (item.value === "custom") {
                        setIsCustomBrandSelected(true);
                        setBrand("");
                      } else {
                        setIsCustomBrandSelected(false);
                        setBrand(item.value);
                      }
                      setFormError("");
                    }}
                  />
                  {isCustomBrandSelected && (
                    <TextInput
                      label="Enter Custom Brand *"
                      value={brand}
                      onChangeText={(t) => {
                        setBrand(t);
                        setFormError("");
                      }}
                      mode="outlined"
                      style={[styles.input, { marginTop: 8 }]}
                      outlineColor={theme.colors.outline}
                      activeOutlineColor={theme.colors.primary}
                    />
                  )}
                </View>

                {/* Price and Unit Row */}
                <View style={[styles.rowInputs, { zIndex: 1 }]}>
                  <View style={styles.halfInput}>
                    <Text
                      style={[
                        styles.fieldLabel,
                        { color: theme.colors.onSurfaceVariant },
                      ]}
                    >
                      Price (₹) *
                    </Text>
                    <TextInput
                      value={price}
                      onChangeText={(t) => {
                        setPrice(t);
                        setFormError("");
                      }}
                      mode="outlined"
                      keyboardType="numeric"
                      style={[styles.input, { marginTop: 4 }]}
                      outlineColor={theme.colors.outline}
                      activeOutlineColor={theme.colors.primary}
                      placeholder="e.g. 450"
                    />
                  </View>

                  <View style={styles.halfInput}>
                    <Text
                      style={[
                        styles.fieldLabel,
                        { color: theme.colors.onSurfaceVariant },
                      ]}
                    >
                      Unit *
                    </Text>
                    <Dropdown
                      style={{
                        height: 50,
                        borderColor: theme.colors.outline,
                        borderWidth: 1,
                        borderRadius: 12,
                        paddingHorizontal: 12,
                        backgroundColor: "transparent",
                        marginTop: 4,
                      }}
                      placeholderStyle={{
                        fontSize: 14,
                        color: theme.colors.onSurfaceVariant,
                      }}
                      selectedTextStyle={{
                        fontSize: 14,
                        color: theme.colors.onSurface,
                      }}
                      containerStyle={{
                        backgroundColor:
                          theme.colors.elevation.level3 || theme.colors.surface,
                        borderRadius: 8,
                        borderColor:
                          theme.colors.outlineVariant ||
                          theme.colors.outline ||
                          "rgba(0,0,0,0.1)",
                        borderWidth: 1,
                      }}
                      activeColor={
                        isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)"
                      }
                      itemTextStyle={{
                        color: theme.colors.onSurface,
                        fontSize: 14,
                      }}
                      iconColor={theme.colors.onSurfaceVariant}
                      data={[
                        ...(SUGGESTIONS[category]?.units || []).map((u) => ({
                          label: u,
                          value: u,
                        })),
                        { label: "Other / Custom", value: "custom" },
                      ]}
                      labelField="label"
                      valueField="value"
                      placeholder="Select Unit"
                      value={isCustomUnitSelected ? "custom" : unit}
                      onChange={(item) => {
                        if (item.value === "custom") {
                          setIsCustomUnitSelected(true);
                          setUnit("");
                        } else {
                          setIsCustomUnitSelected(false);
                          setUnit(item.value);
                        }
                        setFormError("");
                      }}
                    />
                    {isCustomUnitSelected && (
                      <TextInput
                        label="Enter Custom Unit *"
                        value={unit}
                        onChangeText={(t) => {
                          setUnit(t);
                          setFormError("");
                        }}
                        placeholder="bag, MT, brass"
                        mode="outlined"
                        style={[styles.input, { marginTop: 8 }]}
                        outlineColor={theme.colors.outline}
                        activeOutlineColor={theme.colors.primary}
                      />
                    )}
                  </View>
                </View>

                <View>
                  <Text
                    style={[
                      styles.fieldLabel,
                      { color: theme.colors.onSurfaceVariant },
                    ]}
                  >
                    Availability Status *
                  </Text>
                  <SegmentedButtons
                    value={status}
                    onValueChange={(v) => setStatus(v as any)}
                    style={styles.segmented}
                    buttons={[
                      { value: "available", label: "Available", icon: "check" },
                      {
                        value: "out_of_stock",
                        label: "Out of Stock",
                        icon: "cancel",
                      },
                    ]}
                  />
                </View>

                <TextInput
                  label="Optional Notes"
                  value={notes}
                  onChangeText={setNotes}
                  mode="outlined"
                  multiline
                  numberOfLines={2}
                  style={styles.input}
                  outlineColor={theme.colors.outline}
                  activeOutlineColor={theme.colors.primary}
                />
              </View>
            </ScrollView>

            <View style={styles.formActions}>
              <Button
                mode="outlined"
                onPress={() => setModalVisible(false)}
                style={styles.formBtn}
                contentStyle={styles.formBtnContent}
                labelStyle={[
                  styles.formBtnLabel,
                  { color: theme.colors.onSurfaceVariant },
                ]}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                mode="contained"
                onPress={handleSave}
                style={[styles.formBtn, { backgroundColor: "#F97316" }]}
                contentStyle={styles.formBtnContent}
                labelStyle={styles.formBtnLabel}
                loading={loading}
                disabled={loading}
              >
                Save
              </Button>
            </View>
          </Surface>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}
