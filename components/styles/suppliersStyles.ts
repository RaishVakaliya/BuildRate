import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    zIndex: 10,
  },
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  headerSub: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: 2,
    maxWidth: "80%",
  },
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  roleBadgeText: {
    fontSize: 10,
    fontWeight: "700",
  },
  searchbar: {
    borderRadius: 14,
    elevation: 0,
  },
  searchInput: {
    fontSize: 14,
  },
  adminGoBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  adminGoText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "800",
  },
  categoryScroll: {
    paddingVertical: 8,
  },
  categoryScrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: "700",
  },
  adminFiltersWrap: {
    paddingBottom: 10,
  },
  adminFiltersContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  adminFilterChip: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  adminFilterChipText: {
    fontSize: 10,
    fontWeight: "700",
  },
  scrollView: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  centered: {
    paddingTop: 60,
    alignItems: "center",
  },
  emptyWrap: {
    alignItems: "center",
    paddingTop: 80,
    gap: 12,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  emptySubtitle: {
    fontSize: 13,
    textAlign: "center",
  },
  card: {
    borderRadius: 20,
    padding: 16,
    gap: 12,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarLetter: {
    fontSize: 18,
    fontWeight: "800",
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  businessName: {
    fontSize: 15,
    fontWeight: "700",
  },
  subInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  cityText: {
    fontSize: 12,
    fontWeight: "500",
  },
  myBusinessBadge: {
    backgroundColor: "#1A56DB",
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  myBusinessBadgeText: {
    color: "#FFF",
    fontSize: 9,
    fontWeight: "800",
  },
  adminStatusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  adminStatusBadgeText: {
    fontSize: 8,
    fontWeight: "800",
  },
  categoryWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  catChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  catText: {
    fontSize: 10,
    fontWeight: "600",
  },
  expandedContent: {
    gap: 8,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(0,0,0,0.06)",
    marginVertical: 4,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 2,
  },
  detailTextWrap: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 10,
    fontWeight: "600",
  },
  detailVal: {
    fontSize: 13,
    fontWeight: "600",
    marginTop: 1,
  },
  cardFooterActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  compareBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
  },
  compareBtnText: {
    fontSize: 12,
    fontWeight: "700",
  },
  contactActionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  contactCircleBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  contactCallBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    height: 34,
    borderRadius: 17,
    justifyContent: "center",
  },
  contactCallText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "800",
  },
  cardPressable: {
    width: "100%",
  },
});
