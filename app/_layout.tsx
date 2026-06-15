import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Image, View, Animated as RNAnimated } from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { PaperProvider, ActivityIndicator, Text } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider, useAppTheme } from "../context/ThemeContext";
import { AuthProvider } from "../context/AuthContext";
import { CompareProvider } from "../context/CompareContext";
import { lightTheme, darkTheme } from "../constants/theme";
import * as SplashScreen from "expo-splash-screen";
import Animated, { FadeOut } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

SplashScreen.preventAutoHideAsync().catch(() => {});

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!);

function AppContent() {
  const { resolvedScheme } = useAppTheme();
  const theme = resolvedScheme === "dark" ? darkTheme : lightTheme;
  const isDark = resolvedScheme === "dark";

  const [showCustomSplash, setShowCustomSplash] = useState(true);
  const progress = useRef(new RNAnimated.Value(0)).current;

  useEffect(() => {
    RNAnimated.timing(progress, {
      toValue: 1,
      duration: 2200,
      useNativeDriver: true,
    }).start();

    // Hide native splash screen immediately so the custom animation shows without delay
    SplashScreen.hideAsync().catch((e) => {
      console.warn(e);
    });

    const splashTimer = setTimeout(() => {
      setShowCustomSplash(false);
    }, 2500);

    return () => {
      clearTimeout(splashTimer);
    };
  }, []);

  return (
    <PaperProvider theme={theme}>
      <StatusBar style={resolvedScheme === "dark" ? "light" : "dark"} />
      <Stack screenOptions={{ headerShown: false }} />

      {showCustomSplash && (
        <Animated.View
          exiting={FadeOut.duration(350)}
          style={[
            StyleSheet.absoluteFillObject,
            {
              backgroundColor: isDark ? "#0F172A" : "#FFFFFF",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 9999,
            },
          ]}
        >
          <MaterialCommunityIcons
            name={"wall" as any}
            size={54}
            color={isDark ? "#94A3B8" : "#6B7280"}
            style={{ position: "absolute", top: 80, left: 40, opacity: 0.06 }}
          />
          <MaterialCommunityIcons
            name={"package-variant-closed" as any}
            size={50}
            color={isDark ? "#94A3B8" : "#6B7280"}
            style={{ position: "absolute", top: 140, right: 35, opacity: 0.06 }}
          />
          <MaterialCommunityIcons
            name={"ruler" as any}
            size={46}
            color={isDark ? "#94A3B8" : "#6B7280"}
            style={{ position: "absolute", top: 280, left: 20, opacity: 0.06 }}
          />
          <MaterialCommunityIcons
            name={"truck-delivery" as any}
            size={58}
            color={isDark ? "#94A3B8" : "#6B7280"}
            style={{ position: "absolute", top: 340, right: 20, opacity: 0.06 }}
          />
          <MaterialCommunityIcons
            name={"crane" as any}
            size={72}
            color={isDark ? "#94A3B8" : "#6B7280"}
            style={{
              position: "absolute",
              bottom: 160,
              left: 30,
              opacity: 0.06,
            }}
          />
          <MaterialCommunityIcons
            name={"cone" as any}
            size={44}
            color={isDark ? "#94A3B8" : "#6B7280"}
            style={{
              position: "absolute",
              bottom: 140,
              right: 40,
              opacity: 0.06,
            }}
          />

          <View
            style={{
              position: "absolute",
              alignItems: "center",
              justifyContent: "center",
              width: 180,
              height: 180,
            }}
          >
            <LinearGradient
              colors={
                isDark
                  ? ["rgba(59, 130, 246, 0.15)", "rgba(100, 116, 139, 0.02)"]
                  : ["rgba(59, 130, 246, 0.12)", "rgba(243, 244, 246, 0.05)"]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                position: "absolute",
                width: 180,
                height: 180,
                borderRadius: 90,
              }}
            />
            <Image
              source={require("../assets/CustomSplashScreenImage.png")}
              style={{ width: 160, height: 160, resizeMode: "contain" }}
              alt="BuildRate Splash Logo"
            />
          </View>

          <View
            style={{
              position: "absolute",
              bottom: 110,
              alignItems: "center",
              width: "100%",
            }}
          >
            <Text
              style={{
                fontSize: 32,
                fontWeight: "800",
                color: isDark ? "#F8FAFC" : "#111827",
                letterSpacing: -0.5,
              }}
            >
              BuildRate
            </Text>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "500",
                color: isDark ? "#94A3B8" : "#6B7280",
                marginTop: 8,
              }}
            >
              Find the Best Materials Rates
            </Text>
            <Text
              style={{
                fontSize: 13,
                fontWeight: "500",
                color: isDark ? "#64748B" : "#9CA3AF",
                marginTop: 10,
              }}
            >
              v1.0.0
            </Text>

            <View
              style={{
                width: 220,
                height: 6,
                backgroundColor: isDark ? "#334155" : "#E5E7EB",
                borderRadius: 3,
                marginTop: 24,
                overflow: "hidden",
              }}
            >
              <RNAnimated.View
                style={{
                  height: "100%",
                  width: "100%",
                  backgroundColor: theme.colors.primary,
                  borderRadius: 3,
                  transform: [
                    {
                      translateX: progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-220, 0],
                      }),
                    },
                  ],
                }}
              />
            </View>
          </View>

          <Text
            style={{
              position: "absolute",
              bottom: 48,
              fontSize: 12,
              fontWeight: "600",
              color: isDark ? "#475569" : "#9CA3AF",
              letterSpacing: 1.2,
              textTransform: "uppercase",
            }}
          >
            Trusted Construction Material Comparison
          </Text>
        </Animated.View>
      )}
    </PaperProvider>
  );
}

export default function RootLayout() {
  return (
    <ConvexProvider client={convex}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AuthProvider>
            <CompareProvider>
              <AppContent />
            </CompareProvider>
          </AuthProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </ConvexProvider>
  );
}
