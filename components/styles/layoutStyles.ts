import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    borderTopWidth: 1,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  activeIndicator: {
    position: "absolute",
    top: 0,
    height: 3,
    width: 36,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: "600",
    marginTop: 4,
    letterSpacing: 0.2,
  },
});
