import en from "./en";
import gu from "./gu";
import { type Language, type Translations } from "./types";

export type { Language, Translations };

export const locales: Record<Language, Translations> = { en, gu };

export const LANGUAGE_NAMES: Record<Language, string> = {
  en: "English",
  gu: "ગુજરાતી",
};
