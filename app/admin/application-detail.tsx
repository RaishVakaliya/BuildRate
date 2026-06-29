import React, { useState } from "react";
import { View, ScrollView, TouchableOpacity, Alert } from "react-native";
import { styles } from "../../components/styles/applicationDetailStyles";
import {
  Text,
  Button,
  TextInput,
  useTheme,
  ActivityIndicator,
} from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useQuery, useMutation } from "convex/react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { api } from "../../convex/_generated/api";
import { useAppTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { ApproveSupplierDialog } from "../../components/ApproveSupplierDialog";
import type { Id } from "../../convex/_generated/dataModel";
import type { SupplierApplicationDoc } from "../../types/convex";

const STATUS_CONFIG: Record<
  string,
  { bg: string; text: string; icon: string; label: string }
> = {
  pending: {
    bg: "#FEF3C7",
    text: "#D97706",
    icon: "clock-outline",
    label: "Pending",
  },
  approved: {
    bg: "#DCFCE7",
    text: "#16A34A",
    icon: "check-circle",
    label: "Approved",
  },
  rejected: {
    bg: "#FEE2E2",
    text: "#DC2626",
    icon: "cancel",
    label: "Rejected",
  },
};

const CATEGORY_ICONS: Record<string, string> = {
  Cement: "circle-outline",
  Steel: "nail",
  RMC: "truck-cargo-container",
  Sand: "wave",
  Aggregate: "terrain",
  Bricks: "wall",
};

function InfoRow({
  icon,
  label,
  value,
  isDark,
  theme,
}: {
  icon: string;
  label: string;
  value: string;
  isDark: boolean;
  theme: any;
}) {
  if (!value) return null;
  return (
    <View style={styles.infoRow}>
      <View
        style={[
          styles.infoIconWrap,
          {
            backgroundColor: isDark
              ? "rgba(255,255,255,0.06)"
              : "rgba(26,86,219,0.07)",
          },
        ]}
      >
        <MaterialCommunityIcons
          name={icon as any}
          size={17}
          color={theme.colors.primary}
        />
      </View>
      <View style={styles.infoTextWrap}>
        <Text
          style={[styles.infoLabel, { color: theme.colors.onSurfaceVariant }]}
        >
          {label}
        </Text>
        <Text style={[styles.infoValue, { color: theme.colors.onSurface }]}>
          {value}
        </Text>
      </View>
    </View>
  );
}

export default function ApplicationDetailScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { resolvedScheme } = useAppTheme();
  const { user } = useAuth();
  const isDark = resolvedScheme === "dark";

  const [approveDialogVisible, setApproveDialogVisible] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejecting, setRejecting] = useState(false);
  const [showRejectInput, setShowRejectInput] = useState(false);

  const rejectApplication = useMutation(
    api.supplierApplications.rejectApplication,
  );

  React.useEffect(() => {
    if (user?.role !== "admin") router.replace("/(tabs)/account");
  }, [user, router]);

  const application = useQuery(
    api.supplierApplications.getApplication,
    id ? { id: id as Id<"supplierApplications"> } : "skip",
  ) as SupplierApplicationDoc | null | undefined;

  const gradientColors = isDark
    ? (["#1b2e2eff", "#0F172A"] as const)
    : (["#D2E9FC", "#F5F7FA"] as const);

  const handleReject = async () => {
    if (!id) return;
    setRejecting(true);
    try {
      await rejectApplication({
        id: id as Id<"supplierApplications">,
        reason: rejectionReason.trim() || undefined,
      });
      router.back();
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? "Failed to reject application.");
    } finally {
      setRejecting(false);
    }
  };

  const handleApproveSuccess = () => {
    setApproveDialogVisible(false);
    router.back();
  };

  if (application === undefined) {
    return (
      <View
        style={[
          styles.centered,
          { flex: 1, backgroundColor: theme.colors.background },
        ]}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!application) {
    return (
      <View
        style={[
          styles.centered,
          { flex: 1, backgroundColor: theme.colors.background },
        ]}
      >
        <Text style={{ color: theme.colors.onBackground }}>
          Application not found.
        </Text>
      </View>
    );
  }

  const st = STATUS_CONFIG[application.status] ?? STATUS_CONFIG.pending;
  const isPending = application.status === "pending";

  const formatDate = (ts: number) =>
    new Date(ts).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

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
          <View style={styles.headerTitleWrap}>
            <Text
              style={[
                styles.headerTitle,
                { color: isDark ? "#FFF" : "#1E3A8A" },
              ]}
              numberOfLines={1}
            >
              {application.businessName}
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
              Applied {formatDate(application.createdAt)}
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: st.bg }]}>
            <MaterialCommunityIcons
              name={st.icon as any}
              size={12}
              color={st.text}
            />
            <Text style={[styles.statusText, { color: st.text }]}>
              {st.label}
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
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[styles.section, { backgroundColor: theme.colors.surface }]}
        >
          <Text
            style={[
              styles.sectionTitle,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            Business Info
          </Text>
          <InfoRow
            icon="store"
            label="Business Name"
            value={application.businessName}
            isDark={isDark}
            theme={theme}
          />
          <View
            style={[
              styles.divider,
              { backgroundColor: theme.colors.outlineVariant },
            ]}
          />
          <InfoRow
            icon="account"
            label="Username"
            value={application.username || application.ownerName || "Unknown"}
            isDark={isDark}
            theme={theme}
          />
          <View
            style={[
              styles.divider,
              { backgroundColor: theme.colors.outlineVariant },
            ]}
          />
          <InfoRow
            icon="map-marker"
            label="Area"
            value={application.area}
            isDark={isDark}
            theme={theme}
          />
          {application.address ? (
            <>
              <View
                style={[
                  styles.divider,
                  { backgroundColor: theme.colors.outlineVariant },
                ]}
              />
              <InfoRow
                icon="home"
                label="Full Address"
                value={application.address}
                isDark={isDark}
                theme={theme}
              />
            </>
          ) : null}
          {application.gstNumber ? (
            <>
              <View
                style={[
                  styles.divider,
                  { backgroundColor: theme.colors.outlineVariant },
                ]}
              />
              <InfoRow
                icon="card-account-details-outline"
                label="GST Number"
                value={application.gstNumber}
                isDark={isDark}
                theme={theme}
              />
            </>
          ) : null}
        </View>

        <View
          style={[styles.section, { backgroundColor: theme.colors.surface }]}
        >
          <Text
            style={[
              styles.sectionTitle,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            Contact
          </Text>
          <InfoRow
            icon="phone"
            label="Phone Number"
            value={application.phone}
            isDark={isDark}
            theme={theme}
          />
          <View
            style={[
              styles.divider,
              { backgroundColor: theme.colors.outlineVariant },
            ]}
          />
          <InfoRow
            icon="email"
            label="Email"
            value={application.email}
            isDark={isDark}
            theme={theme}
          />
        </View>

        <View
          style={[styles.section, { backgroundColor: theme.colors.surface }]}
        >
          <Text
            style={[
              styles.sectionTitle,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            Categories
          </Text>
          <View style={styles.categoryWrap}>
            {application.categories.map((cat) => (
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
                  style={[styles.catText, { color: theme.colors.onSurface }]}
                >
                  {cat}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {application.notes ? (
          <View
            style={[styles.section, { backgroundColor: theme.colors.surface }]}
          >
            <Text
              style={[
                styles.sectionTitle,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              Business Notes
            </Text>
            <Text
              style={{
                color: theme.colors.onSurface,
                fontSize: 14,
                lineHeight: 21,
                marginTop: 4,
              }}
            >
              {application.notes}
            </Text>
          </View>
        ) : null}

        {application.rejectionReason ? (
          <View style={[styles.section, { backgroundColor: "#FEE2E220" }]}>
            <Text style={[styles.sectionTitle, { color: "#DC2626" }]}>
              Rejection Reason
            </Text>
            <Text style={{ color: "#DC2626", fontSize: 14, lineHeight: 21 }}>
              {application.rejectionReason}
            </Text>
          </View>
        ) : null}

        {isPending && (
          <View style={styles.actionSection}>
            <Button
              mode="contained"
              icon="check-circle"
              onPress={() => setApproveDialogVisible(true)}
              style={styles.approveBtn}
              contentStyle={styles.approveBtnContent}
              labelStyle={styles.approveBtnLabel}
              buttonColor="#16A34A"
            >
              Approve & Create Account
            </Button>

            {!showRejectInput ? (
              <Button
                mode="outlined"
                icon="cancel"
                onPress={() => setShowRejectInput(true)}
                style={{ borderRadius: 14, borderColor: "#DC2626" }}
                contentStyle={{ height: 52 }}
                textColor="#DC2626"
              >
                Reject Application
              </Button>
            ) : (
              <View
                style={[
                  styles.rejectCard,
                  { backgroundColor: theme.colors.surface },
                ]}
              >
                <Text
                  style={[
                    styles.rejectTitle,
                    { color: theme.colors.onSurface },
                  ]}
                >
                  Reason for Rejection (optional)
                </Text>
                <TextInput
                  label="Enter reason..."
                  value={rejectionReason}
                  onChangeText={setRejectionReason}
                  mode="outlined"
                  multiline
                  numberOfLines={3}
                  style={styles.rejectInput}
                  outlineColor={theme.colors.outline}
                  activeOutlineColor="#DC2626"
                />
                <View style={{ flexDirection: "row", gap: 10 }}>
                  <Button
                    mode="text"
                    onPress={() => {
                      setShowRejectInput(false);
                      setRejectionReason("");
                    }}
                    textColor={theme.colors.onSurfaceVariant}
                    style={{ flex: 1 }}
                  >
                    Cancel
                  </Button>
                  <Button
                    mode="contained"
                    onPress={handleReject}
                    loading={rejecting}
                    disabled={rejecting}
                    buttonColor="#DC2626"
                    style={[styles.rejectConfirmBtn, { flex: 1 }]}
                    contentStyle={styles.rejectConfirmContent}
                  >
                    Confirm Reject
                  </Button>
                </View>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {application && (
        <ApproveSupplierDialog
          visible={approveDialogVisible}
          application={application}
          onDismiss={() => setApproveDialogVisible(false)}
          onSuccess={handleApproveSuccess}
        />
      )}
    </View>
  );
}
