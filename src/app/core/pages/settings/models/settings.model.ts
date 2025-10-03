export type ThemeType = 'light' | 'dark' | 'system';
export type FontSizeOption = 'small' | 'medium' | 'large';
export type LanguageOption = 'en' | 'fr-CA' | 'es';

export interface AppSettings {
  theme: ThemeType;
  fontSize: FontSizeOption;
  privacyMode: boolean;
  notificationEnabled: boolean;
  language: LanguageOption;
}

export interface SettingsChangeEvent {
  type:
    | 'theme'
    | 'fontSize'
    | 'privacyMode'
    | 'notificationEnabled'
    | 'language';
  value: ThemeType | FontSizeOption | boolean | LanguageOption;
}

export interface FontSizeConfig {
  size: FontSizeOption;
  label: string;
  cssValue: string;
  rangeValue: number;
}

export interface ThemeConfig {
  value: ThemeType;
  label: string;
  icon?: string;
}

export interface LanguageConfig {
  code: LanguageOption;
  name: string;
  nativeName: string;
}

export interface SettingsFormData {
  theme: ThemeType;
  fontSize: FontSizeOption;
  privacyMode: boolean;
  notificationEnabled: boolean;
  language: LanguageOption;
}

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'system',
  fontSize: 'medium',
  privacyMode: false,
  notificationEnabled: true,
  language: 'en',
};

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

export const THEME_CONFIGS: ThemeConfig[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
];

export const AVAILABLE_LANGUAGES: LanguageConfig[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'fr-CA', name: 'French (Canada)', nativeName: 'Français (Canada)' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
];
