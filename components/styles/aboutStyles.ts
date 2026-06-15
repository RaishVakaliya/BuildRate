import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  header: {
    paddingBottom: 24,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  scrollView: {
    marginTop: -20,
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 20,
  },
  detailScrollView: {
    flex: 1,
  },
  detailScrollContent: {
    padding: 16,
    paddingTop: 16,
    gap: 16,
  },
  logoCard: {
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  logoImage: {
    width: 120,
    height: 120,
    resizeMode: "contain",
  },
  appName: {
    fontSize: 24,
    fontWeight: "800",
    marginTop: 8,
  },
  versionText: {
    fontSize: 13,
    fontWeight: "500",
    opacity: 0.7,
  },
  menuCard: {
    borderRadius: 18,
    overflow: "hidden",
    padding: 4,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 18,
    paddingHorizontal: 16,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    opacity: 0.08,
  },
  detailCard: {
    borderRadius: 18,
    padding: 20,
    gap: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 8,
    marginBottom: 4,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 22,
    fontWeight: "400",
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    paddingLeft: 4,
  },
  bullet: {
    fontSize: 14,
    lineHeight: 22,
    fontWeight: "bold",
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 22,
  },
  footer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
    gap: 4,
  },
  footerText: {
    fontSize: 12,
    fontWeight: "500",
    opacity: 0.6,
  },
});
