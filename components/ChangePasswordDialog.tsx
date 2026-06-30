import React, { useState } from "react";
import { View } from "react-native";
import {
  Text,
  TextInput,
  Button,
  Dialog,
  Portal,
  useTheme,
} from "react-native-paper";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import type { Id } from "../convex/_generated/dataModel";

interface Props {
  visible: boolean;
  supplierId: string;
  onDismiss: () => void;
  onSuccess: () => void;
}

export function ChangePasswordDialog({
  visible,
  supplierId,
  onDismiss,
  onSuccess,
}: Props) {
  const theme = useTheme();
  const changePassword = useMutation(api.suppliers.changePassword);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = () => {
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
  };

  const handleDismiss = () => {
    handleReset();
    onDismiss();
  };

  const handleSubmit = async () => {
    if (!oldPassword.trim()) return setError("Old password is required.");
    if (!newPassword.trim()) return setError("New password is required.");
    if (newPassword.trim().length < 6)
      return setError("New password must be at least 6 characters.");
    if (newPassword !== confirmPassword)
      return setError("New passwords do not match.");
    if (newPassword.trim() === oldPassword.trim())
      return setError("New password cannot be the same as the old password.");

    setError("");
    setLoading(true);
    try {
      await changePassword({
        id: supplierId as Id<"suppliers">,
        oldPassword: oldPassword.trim(),
        newPassword: newPassword.trim(),
      });
      handleReset();
      onSuccess();
    } catch (e: any) {
      let msg = e?.message ?? "Failed to change password. Please try again.";
      if (msg.includes("Incorrect old password")) {
        msg = "Old password is incorrect, please enter correct password.";
      } else if (msg.includes("Server Error")) {
        msg = "Failed to change password. Please check your old password and try again.";
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Portal>
      <Dialog
        visible={visible}
        onDismiss={handleDismiss}
        style={{
          borderRadius: 20,
          backgroundColor: theme.colors.surface,
        }}
      >
        <Dialog.Title style={{ fontWeight: "800", fontSize: 18 }}>
          Change Password
        </Dialog.Title>
        <Dialog.Content>
          {error ? (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#FEE2E2",
                padding: 10,
                borderRadius: 8,
                marginBottom: 16,
              }}
            >
              <MaterialCommunityIcons
                name="alert-circle"
                size={16}
                color="#DC2626"
              />
              <Text
                style={{
                  color: "#DC2626",
                  fontSize: 12,
                  fontWeight: "600",
                  marginLeft: 6,
                  flex: 1,
                }}
              >
                {error}
              </Text>
            </View>
          ) : null}

          <View style={{ gap: 12 }}>
            <TextInput
              label="Old Password"
              value={oldPassword}
              onChangeText={(t) => {
                setOldPassword(t);
                setError("");
              }}
              mode="outlined"
              dense
              secureTextEntry={!showOldPassword}
              autoCapitalize="none"
              left={<TextInput.Icon icon="lock" />}
              right={
                <TextInput.Icon
                  icon={showOldPassword ? "eye-off" : "eye"}
                  onPress={() => setShowOldPassword((v) => !v)}
                />
              }
              outlineColor={theme.colors.outline}
              activeOutlineColor={theme.colors.primary}
            />

            <TextInput
              label="New Password"
              value={newPassword}
              onChangeText={(t) => {
                setNewPassword(t);
                setError("");
              }}
              mode="outlined"
              dense
              secureTextEntry={!showNewPassword}
              autoCapitalize="none"
              left={<TextInput.Icon icon="lock-reset" />}
              right={
                <TextInput.Icon
                  icon={showNewPassword ? "eye-off" : "eye"}
                  onPress={() => setShowNewPassword((v) => !v)}
                />
              }
              outlineColor={theme.colors.outline}
              activeOutlineColor={theme.colors.primary}
            />

            <TextInput
              label="Confirm New Password"
              value={confirmPassword}
              onChangeText={(t) => {
                setConfirmPassword(t);
                setError("");
              }}
              mode="outlined"
              dense
              secureTextEntry={!showNewPassword}
              autoCapitalize="none"
              left={<TextInput.Icon icon="check-all" />}
              outlineColor={theme.colors.outline}
              activeOutlineColor={theme.colors.primary}
            />
          </View>
        </Dialog.Content>
        <Dialog.Actions
          style={{ gap: 8, paddingHorizontal: 16, paddingBottom: 16 }}
        >
          <Button
            onPress={handleDismiss}
            disabled={loading}
            textColor={theme.colors.onSurfaceVariant}
          >
            Cancel
          </Button>
          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={loading}
            disabled={loading}
            style={{ borderRadius: 10 }}
            contentStyle={{ height: 42 }}
          >
            {loading ? "Saving..." : "Change Password"}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
