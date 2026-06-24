import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNetworkStatus } from "../utils/useNetworkStatus";
import { useAppTheme } from "../context/ThemeContext";

const BANNER_HEIGHT = 36;

export function OfflineBanner() {
  const { isOnline } = useNetworkStatus();
  const insets = useSafeAreaInsets();
  const translateY = useSharedValue(200);
  const { resolvedScheme } = useAppTheme();
  const isDark = resolvedScheme === "dark";

  useEffect(() => {
    translateY.value = withTiming(isOnline ? 200 : 0, {
      duration: 280,
      easing: Easing.out(Easing.cubic),
    });
  }, [isOnline]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const bottomOffset = insets.bottom + 49;

  const bgStyle = {
    backgroundColor: isDark ? "#FFFFFF" : "#1E293B",
  };

  const textAndIconColor = isDark ? "#0F172A" : "#F8FAFC";

  return (
    <Animated.View
      style={[styles.banner, { bottom: bottomOffset }, animatedStyle]}
      pointerEvents="none"
    >
      <View style={[styles.inner, bgStyle]}>
        <MaterialCommunityIcons
          name="wifi-off"
          size={14}
          color={textAndIconColor}
          style={{ marginRight: 6 }}
        />
        <Text style={[styles.label, { color: textAndIconColor }]}>No Connection</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: "absolute",
    left: 16,
    right: 16,
    zIndex: 9998,
    borderRadius: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 6,
  },
  inner: {
    height: BANNER_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
});
