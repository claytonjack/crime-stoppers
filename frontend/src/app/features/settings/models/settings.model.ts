// Core settings types
export type ThemeType = 'light' | 'dark' | 'system';
export type FontSizeOption = 'small' | 'medium' | 'large';

// Main settings interface
export interface AppSettings {
  theme: ThemeType;
  fontSize: FontSizeOption;
  privacyMode: boolean;
}

// Settings change events
export interface SettingsChangeEvent {
  type: 'theme' | 'fontSize' | 'privacyMode';
  value: ThemeType | FontSizeOption | boolean;
}

// Font size configuration
export interface FontSizeConfig {
  size: FontSizeOption;
  label: string;
  cssValue: string;
  rangeValue: number;
}

// Theme configuration
export interface ThemeConfig {
  value: ThemeType;
  label: string;
  icon?: string;
}

// Settings form data
export interface SettingsFormData {
  theme: ThemeType;
  fontSize: FontSizeOption;
  privacyMode: boolean;
}

// Default settings
export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'system',
  fontSize: 'medium',
  privacyMode: false,
};

// Font size configurations
export const FONT_SIZE_CONFIGS: Record<FontSizeOption, FontSizeConfig> = {
  small: {
    size: 'small',
    label: 'Small',
    cssValue: '12px',
    rangeValue: 0,
  },
  medium: {
    size: 'medium',
    label: 'Medium',
    cssValue: '16px',
    rangeValue: 1,
  },
  large: {
    size: 'large',
    label: 'Large',
    cssValue: '20px',
    rangeValue: 2,
  },
};

// Theme configurations
export const THEME_CONFIGS: ThemeConfig[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
];
