import React from "react";
import { Tabs } from "expo-router";
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
} from "react-native";
import { styles } from "../../components/styles/layoutStyles";
import { useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export default function TabLayout() {
  const theme = useTheme();

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="materials"
        options={{
          title: "Materials",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="package-variant"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="compare"
        options={{
          title: "Compare",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="scale-balance"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="suppliers"
        options={{
          title: "Suppliers",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="store" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: "Account",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="account-circle"
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}

function CustomTabBar({ state, descriptors, navigation }: any) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const bottomPadding = Math.max(insets.bottom, 12);
  const tabBarHeight =
    Platform.OS === "ios" ? 84 + insets.bottom : 64 + bottomPadding;

  return (
    <View
      style={[
        styles.tabBar,
        {
          backgroundColor: theme.colors.surface,
          paddingBottom: bottomPadding,
          height: tabBarHeight,
          borderTopColor: theme.colors.outlineVariant || "rgba(0,0,0,0.06)",
        },
      ]}
    >
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const label = options.title !== undefined ? options.title : route.name;
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        const color = isFocused
          ? theme.colors.primary
          : theme.colors.onSurfaceVariant;

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabItem}
            activeOpacity={0.7}
          >
            {isFocused && (
              <View
                style={[
                  styles.activeIndicator,
                  { backgroundColor: theme.colors.primary },
                ]}
              />
            )}
            <View style={{ marginTop: 8 }}>
              {options.tabBarIcon &&
                options.tabBarIcon({ focused: isFocused, color, size: 24 })}
            </View>
            <Text style={[styles.tabLabel, { color }]}>{label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}


