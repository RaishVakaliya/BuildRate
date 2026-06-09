import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

// RateGuru brand palette
export const COLORS = {
  primary: '#1A56DB',       // Deep blue
  primaryDark: '#1240A8',
  primaryLight: '#E8F0FE',
  secondary: '#F97316',     // Construction orange
  secondaryLight: '#FFF4EC',
  success: '#16A34A',
  successLight: '#DCFCE7',
  warning: '#D97706',
  warningLight: '#FEF3C7',
  error: '#DC2626',
  errorLight: '#FEE2E2',
  surface: '#FFFFFF',
  background: '#F5F7FA',
  onSurface: '#111827',
  onSurfaceVariant: '#6B7280',
  outline: '#E5E7EB',
  outlineVariant: '#F3F4F6',
  inverseSurface: '#1F2937',
  inverseOnSurface: '#F9FAFB',
};

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: COLORS.primary,
    primaryContainer: COLORS.primaryLight,
    secondary: COLORS.secondary,
    secondaryContainer: COLORS.secondaryLight,
    background: COLORS.background,
    surface: COLORS.surface,
    surfaceVariant: COLORS.outlineVariant,
    outline: COLORS.outline,
    error: COLORS.error,
    errorContainer: COLORS.errorLight,
    onPrimary: '#FFFFFF',
    onPrimaryContainer: COLORS.primaryDark,
    onSecondary: '#FFFFFF',
    onBackground: COLORS.onSurface,
    onSurface: COLORS.onSurface,
    onSurfaceVariant: COLORS.onSurfaceVariant,
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#4F8EF7',
    primaryContainer: '#1240A8',
    secondary: '#FB923C',
    secondaryContainer: '#7C2D12',
    background: '#0F172A',
    surface: '#1E293B',
    surfaceVariant: '#334155',
    outline: '#475569',
    error: '#F87171',
    onPrimary: '#FFFFFF',
    onBackground: '#F8FAFC',
    onSurface: '#F8FAFC',
    onSurfaceVariant: '#94A3B8',
  },
};

export type AppTheme = typeof lightTheme;
