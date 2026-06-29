import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Button, Dialog, Portal, useTheme } from "react-native-paper";
import * as Clipboard from "expo-clipboard";
import { sendWhatsAppCredentials } from "../utils/whatsapp";

interface Props {
  visible: boolean;
  businessName: string;
  phone: string;
  password?: string;
  onDismiss: () => void;
}

export function SupplierSuccessDialog({
  visible,
  businessName,
  phone,
  password = "",
  onDismiss,
}: Props) {
  const theme = useTheme();

  const handleCopy = async () => {
    const creds = `Phone: ${phone}\nPassword: ${password}`;
    await Clipboard.setStringAsync(creds);
  };

  const handleWhatsApp = async () => {
    try {
      await sendWhatsAppCredentials(phone, businessName, password);
    } catch (e) {}
  };

  return (
    <Portal>
      <Dialog
        visible={visible}
        onDismiss={onDismiss}
        style={{ borderRadius: 20, backgroundColor: theme.colors.surface }}
        dismissable={false}
      >
        <Dialog.Title
          style={{
            fontWeight: "800",
            fontSize: 20,
            textAlign: "center",
            color: "#16A34A",
          }}
        >
          Account Created!
        </Dialog.Title>
        <Dialog.Content>
          <Text style={{ textAlign: "center", marginBottom: 20, fontSize: 14 }}>
            Successfully created supplier account for{" "}
            <Text style={{ fontWeight: "700" }}>{businessName}</Text>.
          </Text>

          <View style={styles.credsBox}>
            <View style={styles.credRow}>
              <Text style={styles.credLabel}>Phone:</Text>
              <Text style={styles.credValue}>{phone}</Text>
            </View>
            <View style={styles.credRow}>
              <Text style={styles.credLabel}>Password:</Text>
              <Text style={styles.credValue}>{password}</Text>
            </View>
          </View>
        </Dialog.Content>
        <Dialog.Actions
          style={{
            flexDirection: "column",
            gap: 12,
            paddingHorizontal: 24,
            paddingBottom: 24,
            alignItems: "stretch",
          }}
        >
          <Button
            mode="contained"
            icon="whatsapp"
            onPress={handleWhatsApp}
            buttonColor="#25D366"
            contentStyle={{ height: 48 }}
            labelStyle={{ fontWeight: "700" }}
            style={{ borderRadius: 12, width: "100%" }}
          >
            Send via WhatsApp
          </Button>
          <Button
            mode="outlined"
            icon="content-copy"
            onPress={handleCopy}
            textColor={theme.colors.onSurface}
            style={{
              borderRadius: 12,
              width: "100%",
              borderColor: theme.colors.outlineVariant,
            }}
            contentStyle={{ height: 48 }}
            labelStyle={{ fontWeight: "700" }}
          >
            Copy Credentials
          </Button>
          <Button
            mode="text"
            onPress={onDismiss}
            textColor={theme.colors.primary}
            style={{ marginTop: 8 }}
          >
            Done
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

const styles = StyleSheet.create({
  credsBox: {
    backgroundColor: "rgba(0,0,0,0.04)",
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  credRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  credLabel: {
    fontSize: 14,
    color: "#64748B",
    fontWeight: "600",
  },
  credValue: {
    fontSize: 15,
    fontWeight: "800",
    color: "#1E293B",
  },
});
