import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
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

  adminPanelBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  adminPanelLeft: { flexDirection: "row", alignItems: "center", gap: 14 },
  adminPanelIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  adminPanelTitle: { color: "#FFF", fontSize: 15, fontWeight: "800" },
  adminPanelSub: {
    color: "rgba(255,255,255,0.65)",
    fontSize: 12,
    fontWeight: "500",
    marginTop: 1,
  },
  categoryWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 4,
  },
  catChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  catText: {
    fontSize: 12,
    fontWeight: "600",
  },
});
