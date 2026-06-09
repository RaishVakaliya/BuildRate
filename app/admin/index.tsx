import React, { useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Text, Surface, useTheme, ActivityIndicator } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useQuery, useMutation } from "convex/react";
import { useRouter } from "expo-router";
import { api } from "../../convex/_generated/api";
import { useAppTheme } from "../../context/ThemeContext";

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

export default function AdminPanelScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { resolvedScheme } = useAppTheme();
  const isDark = resolvedScheme === "dark";

  const suppliers = useQuery(api.suppliers.listSuppliers);
  const toggleStatus = useMutation(api.suppliers.toggleStatus);
  const deleteSupplier = useMutation(api.suppliers.deleteSupplier);

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const gradientColors = isDark
    ? (["#1A2540", "#0F172A"] as const)
    : (["#E6F2FF", "#F5F7FA"] as const);

  const total = suppliers?.length ?? 0;
  const active = suppliers?.filter((s) => s.status === "active").length ?? 0;
  const suspended =
    suppliers?.filter((s) => s.status === "suspended").length ?? 0;

  const handleToggle = async (id: string) => {
    setTogglingId(id);
    try {
      await toggleStatus({ id: id as any });
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = (id: string, name: string) => {
    Alert.alert(
      "Delete Supplier",
      `Remove "${name}" permanently? This cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setDeletingId(id);
            try {
              await deleteSupplier({ id: id as any });
            } finally {
              setDeletingId(null);
            }
          },
        },
      ],
    );
  };

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
          <View style={{ flex: 1 }}>
            <Text
              style={[
                styles.headerTitle,
                { color: isDark ? "#FFF" : "#1E3A8A" },
              ]}
            >
              Admin Panel
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
              Supplier Management
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.addBtn,
              {
                backgroundColor: isDark
                  ? "rgba(255,255,255,0.15)"
                  : "rgba(26, 86, 219, 0.1)",
              },
            ]}
            onPress={() => router.push("/admin/add-supplier")}
          >
            <MaterialCommunityIcons
              name="plus"
              size={20}
              color={isDark ? "#FFF" : "#1A56DB"}
            />
            <Text
              style={[
                styles.addBtnText,
                { color: isDark ? "#FFF" : "#1A56DB" },
              ]}
            >
              Add
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
          <StatChip
            icon="store"
            label="Total"
            value={total}
            color={isDark ? "#93C5FD" : "#1D4ED8"}
            isDark={isDark}
          />
          <StatChip
            icon="check-circle"
            label="Active"
            value={active}
            color={isDark ? "#6EE7B7" : "#15803D"}
            isDark={isDark}
          />
          <StatChip
            icon="cancel"
            label="Suspended"
            value={suspended}
            color={isDark ? "#FCA5A5" : "#B91C1C"}
            isDark={isDark}
          />
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {suppliers === undefined ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        ) : suppliers.length === 0 ? (
          <View style={styles.emptyWrap}>
            <MaterialCommunityIcons
              name="store-off"
              size={64}
              color={theme.colors.onSurfaceVariant}
            />
            <Text
              style={[styles.emptyTitle, { color: theme.colors.onBackground }]}
            >
              No Suppliers Yet
            </Text>
            <Text
              style={[
                styles.emptySubtitle,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              Tap "Add" above to add your first supplier.
            </Text>
          </View>
        ) : (
          suppliers.map((supplier) => {
            const st = STATUS_COLOR[supplier.status] ?? STATUS_COLOR.active;
            const isToggling = togglingId === supplier._id;
            const isDeleting = deletingId === supplier._id;

            return (
              <Surface
                key={supplier._id}
                style={[styles.card, { backgroundColor: theme.colors.surface }]}
                elevation={1}
              >
                <View style={styles.cardHeader}>
                  <View
                    style={[
                      styles.avatarCircle,
                      { backgroundColor: "#1A56DB18" },
                    ]}
                  >
                    <Text style={styles.avatarLetter}>
                      {supplier.businessName.charAt(0).toUpperCase()}
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
                          color="#1A56DB"
                        />
                      )}
                    </View>
                    <Text
                      style={[
                        styles.username,
                        { color: theme.colors.onSurfaceVariant },
                      ]}
                    >
                      @{supplier.username} · {supplier.city}
                    </Text>
                  </View>
                  <View
                    style={[styles.statusBadge, { backgroundColor: st.bg }]}
                  >
                    <MaterialCommunityIcons
                      name={st.icon as any}
                      size={12}
                      color={st.text}
                    />
                    <Text style={[styles.statusText, { color: st.text }]}>
                      {supplier.status.charAt(0).toUpperCase() +
                        supplier.status.slice(1)}
                    </Text>
                  </View>
                </View>

                <View style={styles.metaRow}>
                  <MaterialCommunityIcons
                    name="phone-outline"
                    size={13}
                    color={theme.colors.onSurfaceVariant}
                  />
                  <Text
                    style={[
                      styles.metaText,
                      { color: theme.colors.onSurfaceVariant },
                    ]}
                  >
                    {supplier.phone}
                  </Text>
                  <MaterialCommunityIcons
                    name="email-outline"
                    size={13}
                    color={theme.colors.onSurfaceVariant}
                    style={{ marginLeft: 12 }}
                  />
                  <Text
                    style={[
                      styles.metaText,
                      { color: theme.colors.onSurfaceVariant },
                    ]}
                    numberOfLines={1}
                  >
                    {supplier.email}
                  </Text>
                </View>

                <View style={styles.categoryWrap}>
                  {supplier.categories.map((cat) => (
                    <View
                      key={cat}
                      style={[
                        styles.catChip,
                        { backgroundColor: theme.colors.surfaceVariant },
                      ]}
                    >
                      <MaterialCommunityIcons
                        name={(CATEGORY_ICONS[cat] ?? "tag") as any}
                        size={12}
                        color={theme.colors.primary}
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
                  ))}
                </View>

                <View
                  style={[
                    styles.divider,
                    { backgroundColor: theme.colors.outlineVariant },
                  ]}
                />

                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={[
                      styles.actionBtn,
                      {
                        backgroundColor: isToggling
                          ? "#F3F4F6"
                          : supplier.status === "active"
                            ? "#FEE2E2"
                            : "#DCFCE7",
                      },
                    ]}
                    onPress={() => handleToggle(supplier._id)}
                    disabled={isToggling || isDeleting}
                  >
                    {isToggling ? (
                      <ActivityIndicator
                        size={14}
                        color={theme.colors.onSurfaceVariant}
                      />
                    ) : (
                      <MaterialCommunityIcons
                        name={
                          supplier.status === "active"
                            ? "pause-circle"
                            : "play-circle"
                        }
                        size={16}
                        color={
                          supplier.status === "active" ? "#DC2626" : "#16A34A"
                        }
                      />
                    )}
                    <Text
                      style={[
                        styles.actionText,
                        {
                          color:
                            supplier.status === "active"
                              ? "#DC2626"
                              : "#16A34A",
                        },
                      ]}
                    >
                      {supplier.status === "active" ? "Suspend" : "Activate"}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: "#FEE2E2" }]}
                    onPress={() =>
                      handleDelete(supplier._id, supplier.businessName)
                    }
                    disabled={isToggling || isDeleting}
                  >
                    {isDeleting ? (
                      <ActivityIndicator size={14} color="#DC2626" />
                    ) : (
                      <MaterialCommunityIcons
                        name="trash-can-outline"
                        size={16}
                        color="#DC2626"
                      />
                    )}
                    <Text style={[styles.actionText, { color: "#DC2626" }]}>
                      Delete
                    </Text>
                  </TouchableOpacity>
                </View>
              </Surface>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

function StatChip({
  icon,
  label,
  value,
  color,
  isDark,
}: {
  icon: string;
  label: string;
  value: number;
  color: string;
  isDark: boolean;
}) {
  return (
    <View
      style={[
        styles.statChip,
        {
          backgroundColor: isDark
            ? "rgba(255, 255, 255, 0.08)"
            : "rgba(26, 86, 219, 0.06)",
        },
      ]}
    >
      <MaterialCommunityIcons name={icon as any} size={18} color={color} />
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text
        style={[
          styles.statLabel,
          {
            color: isDark
              ? "rgba(255, 255, 255, 0.6)"
              : "rgba(71, 85, 105, 0.8)",
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 24 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
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
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  addBtnText: { color: "#FFF", fontSize: 13, fontWeight: "700" },
  statsRow: { flexDirection: "row", gap: 10 },
  statChip: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 14,
    paddingVertical: 12,
    gap: 2,
  },
  statValue: { fontSize: 18, fontWeight: "800" },
  statLabel: {
    fontSize: 10,
    color: "rgba(255,255,255,0.6)",
    fontWeight: "500",
  },

  scrollView: { marginTop: -16 },
  listContent: { padding: 16, gap: 12 },
  centered: { paddingTop: 60, alignItems: "center" },
  emptyWrap: { alignItems: "center", paddingTop: 80, gap: 10 },
  emptyTitle: { fontSize: 18, fontWeight: "700" },
  emptySubtitle: { fontSize: 13, textAlign: "center" },

  card: { borderRadius: 18, padding: 16, gap: 10 },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatarCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarLetter: { fontSize: 20, fontWeight: "800", color: "#1A56DB" },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 2,
  },
  businessName: { fontSize: 15, fontWeight: "700" },
  username: { fontSize: 12, fontWeight: "500" },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusText: { fontSize: 11, fontWeight: "700" },

  metaRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  metaText: { fontSize: 12, flex: 1 },

  categoryWrap: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  catChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  catText: { fontSize: 11, fontWeight: "600" },

  divider: { height: 1, marginVertical: 2 },
  actionRow: { flexDirection: "row", gap: 10 },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderRadius: 10,
    paddingVertical: 9,
  },
  actionText: { fontSize: 13, fontWeight: "700" },
});
