import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  headerSub: {
    fontSize: 13,
    marginTop: 2,
  },
  searchBar: {
    marginTop: 12,
    borderRadius: 14,
  },
  catScroll: {
    paddingHorizontal: 20,
    marginTop: 4,
    marginBottom: 8,
  },
  catChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  catChipText: {
    fontSize: 12,
    fontWeight: "700",
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 12,
  },
  materialCard: {
    borderRadius: 16,
    overflow: "hidden",
  },
  cardMain: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  materialInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
  },
  matName: {
    fontSize: 14,
    fontWeight: "700",
  },
  catBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  catBadgeText: {
    fontSize: 9,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  brandText: {
    fontSize: 12,
    marginTop: 2,
  },
  offersCount: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  offersText: {
    fontSize: 11,
  },
  priceInfo: {
    alignItems: "flex-end",
    marginLeft: 8,
  },
  priceRange: {
    fontSize: 14,
    fontWeight: "800",
  },
  priceUnit: {
    fontSize: 11,
    marginTop: 2,
  },
  expandedPanel: {
    borderTopWidth: 1,
    padding: 12,
    gap: 10,
  },
  expandedTitle: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  offerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  supplierInfo: {
    flex: 1,
    marginRight: 10,
  },
  supplierNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  supplierName: {
    fontSize: 13,
    fontWeight: "600",
  },
  supplierCityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    marginTop: 2,
  },
  supplierCity: {
    fontSize: 11,
  },
  offerRight: {
    alignItems: "flex-end",
  },
  offerPrice: {
    fontSize: 13,
    fontWeight: "700",
  },
  offerStatus: {
    fontSize: 10,
    fontWeight: "600",
    marginTop: 2,
  },
  offerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 6,
  },
  actionCircleBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  compareBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  compareBtnText: {
    fontSize: 10,
    fontWeight: "700",
  },
  emptyWrap: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    paddingHorizontal: 32,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  emptyText: {
    fontSize: 13,
    textAlign: "center",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
});
