import { Linking } from "react-native";

export const sendWhatsAppCredentials = async (
  phone: string,
  businessName: string,
  password: string,
) => {
  const cleanedPhone = phone.replace(/\D/g, "");

  const formattedPhone =
    cleanedPhone.length === 10 ? `91${cleanedPhone}` : cleanedPhone;

  const message = `Hello ${businessName},\n\nYour BuildRate supplier account has been successfully created!\n\nHere are your login credentials:\n*Phone:* ${phone}\n*Password:* ${password}\n\nPlease login using the BuildRate app to start managing your materials.\n\nWelcome to BuildRate!`;

  const url = `whatsapp://send?phone=${formattedPhone}&text=${encodeURIComponent(message)}`;

  try {
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    } else {
      const webUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(
        message,
      )}`;
      await Linking.openURL(webUrl);
    }
  } catch (error) {
    console.error("Error opening WhatsApp:", error);
    throw new Error("Could not open WhatsApp");
  }
};
