import React, { useState } from "react";
import { View, ScrollView, TouchableOpacity, Pressable } from "react-native";
import { styles } from "../../components/styles/supplierApplicationStyles";
import { Text, useTheme, ActivityIndicator } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useQuery } from "convex/react";
import { useRouter } from "expo-router";
import { api } from "../../convex/_generated/api";
import { useAppTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import type { SupplierApplicationDoc } from "../../types/convex";

type FilterStatus = "all" | "pending" | "approved" | "rejected";

const STATUS_CONFIG: Record<string, { bg: string; text: string; icon: string; label: string }> = {
  pending: { bg: "#FEF3C7", text: "#D97706", icon: "clock-outline", label: "Pending" },
  approved: { bg: "#DCFCE7", text: "#16A34A", icon: "check-circle", label: "Approved" },
  rejected: { bg: "#FEE2E2", text: "#DC2626", icon: "cancel", label: "Rejected" },
};

const TABS: { key: FilterStatus; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
];

export default function SupplierApplicationsScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { resolvedScheme } = useAppTheme();
  const { user } = useAuth();
  const isDark = resolvedScheme === "dark";

  const [activeTab, setActiveTab] = useState<FilterStatus>("pending");

  React.useEffect(() => {
    if (user?.role !== "admin") {
      router.replace("/(tabs)/account");
    }
  }, [user, router]);

  const allApplications = useQuery(api.supplierApplications.listApplications, {});
  const pendingCount = useQuery(api.supplierApplications.getPendingCount, {});

  const gradientColors = isDark
    ? (["#1b2e2eff", "#0F172A"] as const)
    : (["#D2E9FC", "#F5F7FA"] as const);

  const filtered: SupplierApplicationDoc[] | undefined = allApplications
    ? activeTab === "all"
      ? (allApplications as SupplierApplicationDoc[])
      : (allApplications as SupplierApplicationDoc[]).filter((a) => a.status === activeTab)
    : undefined;

  const tabCount = (key: FilterStatus) => {
    if (!allApplications) return 0;
    if (key === "all") return allApplications.length;
    return (allApplications as SupplierApplicationDoc[]).filter((a) => a.status === key).length;
  };

  const formatDate = (ts: number) =>
    new Date(ts).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
      <LinearGradient colors={gradientColors} style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={[styles.backBtn, { backgroundColor: isDark ? "rgba(255,255,255,0.12)" : "rgba(26,86,219,0.08)" }]}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color={isDark ? "#FFF" : "#1E3A8A"} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={[styles.headerTitle, { color: isDark ? "#FFF" : "#1E3A8A" }]}>
              Supplier Applications
            </Text>
            <Text style={[styles.headerSub, { color: isDark ? "rgba(255,255,255,0.65)" : "rgba(71,85,105,0.8)" }]}>
              {pendingCount ?? 0} pending review
            </Text>
          </View>
        </View>
      </LinearGradient>

      <View style={{ flexGrow: 0 }}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={{ flexGrow: 0 }}
          contentContainerStyle={{ 
            flexDirection: "row", 
            gap: 8, 
            paddingHorizontal: 16, 
            paddingVertical: 12 
          }}
        >
          {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          const count = tabCount(tab.key);
          return (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tabChip,
                {
                  backgroundColor: isActive ? theme.colors.primary : theme.colors.surface,
                  borderColor: isActive ? theme.colors.primary : theme.colors.outline,
                },
              ]}
              onPress={() => setActiveTab(tab.key)}
              activeOpacity={0.75}
            >
              <Text style={[styles.tabChipText, { color: isActive ? "#FFF" : theme.colors.onSurface }]}>
                {tab.label}
              </Text>
              {count > 0 && (
                <View style={[styles.tabBadge, { backgroundColor: isActive ? "rgba(255,255,255,0.3)" : theme.colors.primary }]}>
                  <Text style={styles.tabBadgeText}>{count}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
          })}
        </ScrollView>
      </View>

      <ScrollView
        contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        {filtered === undefined ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        ) : filtered.length === 0 ? (
          <View style={styles.emptyWrap}>
            <MaterialCommunityIcons name="file-document-outline" size={64} color={theme.colors.onSurfaceVariant} />
            <Text style={[styles.emptyTitle, { color: theme.colors.onBackground }]}>
              No Applications
            </Text>
            <Text style={[styles.emptySubtitle, { color: theme.colors.onSurfaceVariant }]}>
              {activeTab === "pending" ? "No pending applications at the moment." : `No ${activeTab} applications found.`}
            </Text>
          </View>
        ) : (
          filtered.map((app) => {
            const st = STATUS_CONFIG[app.status] ?? STATUS_CONFIG.pending;
            return (
              <Pressable
                key={app._id}
                onPress={() => router.push({ pathname: "/admin/application-detail", params: { id: app._id } })}
                style={({ pressed }) => [
                  { 
                    opacity: pressed ? 0.8 : 1,
                    transform: [{ scale: pressed ? 0.98 : 1 }]
                  }
                ]}
              >
                <View style={[styles.appCard, { backgroundColor: theme.colors.surface }]}>
                  <View style={styles.appCardHeader}>
                    <View style={[styles.appAvatarCircle, { backgroundColor: "#1A56DB18" }]}>
                      <Text style={styles.appAvatarLetter}>{app.businessName.charAt(0).toUpperCase()}</Text>
                    </View>
                    <View style={styles.appNameRow}>
                      <Text style={[styles.appBusinessName, { color: theme.colors.onSurface }]} numberOfLines={1}>
                        {app.businessName}
                      </Text>
                      <Text style={[styles.appOwnerName, { color: theme.colors.onSurfaceVariant }]}>
                        {app.username || app.ownerName || "Unknown"}
                      </Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: st.bg }]}>
                      <MaterialCommunityIcons name={st.icon as any} size={12} color={st.text} />
                      <Text style={[styles.statusText, { color: st.text }]}>{st.label}</Text>
                    </View>
                  </View>
                  <View style={styles.appMeta}>
                    <MaterialCommunityIcons name="phone-outline" size={13} color={theme.colors.onSurfaceVariant} />
                    <Text style={[styles.appMetaText, { color: theme.colors.onSurfaceVariant }]}>{app.phone}</Text>
                    <Text style={[styles.appDate, { color: theme.colors.onSurfaceVariant, marginLeft: "auto" }]}>
                      {formatDate(app.createdAt)}
                    </Text>
                  </View>
                </View>
              </Pressable>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}
