import { StyleSheet, Dimensions } from "react-native";

export const SCREEN_WIDTH = Dimensions.get("window").width;

export const styles = StyleSheet.create({
  root: { flex: 1 },
  centered: { flex: 1, alignItems: "center", justifyContent: "center" },

  header: {
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  headerSub: {
    fontSize: 13,
    marginTop: 2,
  },
  clearBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
  },
  clearBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#DC2626",
  },

  pillRow: {
    flexDirection: "row",
    gap: 6,
    marginTop: 12,
  },
  pill: {
    height: 4,
    flex: 1,
    borderRadius: 2,
  },

  emptyWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  emptyIconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  emptyTitle: {
    fontWeight: "700",
    textAlign: "center",
  },
  emptyBody: {
    marginTop: 8,
    textAlign: "center",
    lineHeight: 22,
  },
  browseBtn: {
    marginTop: 28,
    borderRadius: 14,
    paddingHorizontal: 24,
    paddingVertical: 13,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  browseBtnText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 15,
  },

  needMoreWrap: {
    margin: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  needMoreText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
  },

  headerCardsRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 2,
    gap: 8,
  },
  supplierCard: {
    borderRadius: 18,
    padding: 14,
    alignItems: "center",
    position: "relative",
  },
  removeBtn: {
    position: "absolute",
    top: 6,
    right: 6,
    borderRadius: 14,
    padding: 8,
    zIndex: 10,
  },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  avatarLetter: {
    fontSize: 22,
    fontWeight: "800",
  },
  supplierName: {
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 17,
  },
  cityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    marginTop: 5,
  },
  cityText: { fontSize: 11 },
  quickContactRow: {
    flexDirection: "row",
    gap: 6,
    marginTop: 10,
  },
  callBtn: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 6,
    alignItems: "center",
  },
  waBtn: {
    flex: 1,
    backgroundColor: "#25D3661B",
    borderRadius: 8,
    paddingVertical: 6,
    alignItems: "center",
  },

  sectionWrap: { marginTop: 16, marginHorizontal: 8 },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  sectionSurface: {
    borderRadius: 16,
    overflow: "hidden",
    paddingVertical: 12,
    gap: 2,
  },

  compareRowWrap: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  compareRowLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  compareRowLabelText: {
    fontSize: 12,
    fontWeight: "600",
  },
  compareRowValues: { flexDirection: "row", gap: 8 },
  compareValueCell: {
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 8,
  },
  compareValueText: { fontSize: 12, fontWeight: "500" },

  materialsGridRow: { flexDirection: "row", paddingHorizontal: 12, gap: 8 },
  materialsCol: { gap: 4 },
  catChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
  },
  catChipText: {
    fontSize: 11,
    fontWeight: "500",
  },

  priceEmptyWrap: { padding: 20, alignItems: "center" },
  priceEmptyText: {
    marginTop: 8,
    fontSize: 13,
    textAlign: "center",
  },
  categorySubHeader: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  categorySubHeaderText: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.7,
  },
  priceRow: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  priceRowName: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
  },
  priceRowUnit: { fontWeight: "400", fontSize: 11 },
  priceRowValues: { flexDirection: "row", gap: 8 },
  priceCell: {
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 8,
  },
  priceValue: {
    fontSize: 14,
    fontWeight: "800",
  },
  bestPriceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    marginTop: 2,
  },
  bestPriceText: {
    fontSize: 9,
    color: "#16A34A",
    fontWeight: "700",
  },
  noPrice: {
    fontSize: 11,
    fontStyle: "italic",
  },
});
