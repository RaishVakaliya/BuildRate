import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  root: { flex: 1 },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  header: { paddingHorizontal: 20, paddingBottom: 24 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
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
    borderRadius: 14,
    marginHorizontal: 16,
    // marginTop: 0,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  addBtnContent: { height: 50 },
  addBtnLabel: { fontSize: 14, fontWeight: "700", letterSpacing: 0.3 },

  scrollView: { marginTop: 0 },
  listContent: { padding: 16, gap: 12 },
  emptyWrap: {
    alignItems: "center",
    paddingTop: 60,
    gap: 10,
    paddingHorizontal: 24,
  },
  emptyTitle: { fontSize: 18, fontWeight: "700" },
  emptySubtitle: { fontSize: 13, textAlign: "center", lineHeight: 18 },

  card: { borderRadius: 18, padding: 16, gap: 12 },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  catBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  catBadgeText: { fontSize: 10, fontWeight: "700" },
  priceContainer: { alignItems: "flex-end" },
  priceTag: { fontSize: 18, fontWeight: "800" },
  unitText: { fontSize: 11 },

  cardBody: { gap: 2 },
  materialName: { fontSize: 16, fontWeight: "700" },
  materialBrand: { fontSize: 12, fontWeight: "600" },

  notesContainer: {
    flexDirection: "row",
    gap: 8,
    borderRadius: 10,
    padding: 10,
  },
  notesText: { flex: 1, fontSize: 12, lineHeight: 16, fontWeight: "500" },

  divider: { height: 1, marginVertical: 2 },

  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusText: { fontSize: 10, fontWeight: "800" },
  cardActions: { flexDirection: "row", gap: 8 },
  circleActionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    justifyContent: "center",
  },
  modalCard: {
    borderRadius: 24,
    padding: 20,
    marginHorizontal: 16,
    gap: 16,
    maxHeight: "85%",
  },
  modalTitle: { fontSize: 18, fontWeight: "800", letterSpacing: -0.3 },
  modalScroll: { marginVertical: 4 },
  modalForm: { gap: 14 },
  fieldLabel: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  input: { backgroundColor: "transparent" },
  rowInputs: { flexDirection: "row", gap: 12 },
  halfInput: { flex: 1 },

  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginVertical: 4,
  },
  catTile: {
    width: "31%",
    alignItems: "center",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 4,
    gap: 4,
  },
  catTileIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  catTileLabel: { fontSize: 10, fontWeight: "700", textAlign: "center" },

  segmented: { borderRadius: 10 },

  formActions: { flexDirection: "row", gap: 10, marginTop: 12 },
  formBtn: { flex: 1, borderRadius: 12 },
  formBtnContent: { height: 48 },
  formBtnLabel: { fontSize: 13, fontWeight: "700" },
});
