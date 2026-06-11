import { Linking } from "react-native";

export const handleCall = (phone: string, onError?: (msg: string) => void) => {
  Linking.openURL(`tel:${phone.replace(/\s+/g, "")}`).catch(() => {
    if (onError) onError("Could not open dialer.");
  });
};

export const handleEmail = (
  email: string,
  businessName: string,
  onError?: (msg: string) => void,
) => {
  Linking.openURL(
    `mailto:${email}?subject=Inquiry from RateGuru to ${businessName}`,
  ).catch(() => {
    if (onError) onError("Could not open email client.");
  });
};

export const handleWhatsApp = (
  phone: string,
  businessName: string,
  onError?: (msg: string) => void,
) => {
  const cleanPhone = phone.replace(/[^\d+]/g, "");
  const message = encodeURIComponent(
    `Hello ${businessName}, I found your business on RateGuru and would like to inquire about material pricing.`,
  );
  const url = `whatsapp://send?phone=${cleanPhone}&text=${message}`;
  Linking.openURL(url).catch(() => {
    Linking.openURL(`https://wa.me/${cleanPhone}?text=${message}`).catch(
      () => {
        if (onError) onError("WhatsApp is not available.");
      },
    );
  });
};
