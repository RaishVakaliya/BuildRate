import { View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { styles } from "../../components/styles/compareStyles";

export default function CompareScreen() {
  const theme = useTheme();
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.center}>
        <MaterialCommunityIcons
          name="scale-balance"
          size={64}
          color={theme.colors.primary}
        />
        <Text
          variant="headlineSmall"
          style={{
            marginTop: 16,
            color: theme.colors.onBackground,
            fontWeight: "700",
          }}
        >
          Compare Prices
        </Text>
        <Text
          variant="bodyMedium"
          style={{
            color: theme.colors.onSurfaceVariant,
            marginTop: 8,
            textAlign: "center",
          }}
        >
          Compare prices from multiple{"\n"}suppliers side by side
        </Text>
      </View>
    </SafeAreaView>
  );
}
