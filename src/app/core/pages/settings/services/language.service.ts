import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Preferences } from '@capacitor/preferences';
import { BehaviorSubject, Observable } from 'rxjs';

export type LanguageOption = 'en' | 'fr-CA' | 'es';

export interface AppSettings {
  theme: string;
  fontSize: string;
  privacyMode: boolean;
  notificationEnabled: boolean;
  language: LanguageOption;
}

export interface LanguageConfig {
  code: LanguageOption;
  name: string;
  nativeName: string;
}

const LANGUAGE_KEY = 'app_language';

export const AVAILABLE_LANGUAGES: LanguageConfig[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'fr-CA', name: 'French (CA)', nativeName: 'Fran\u00e7ais (CA)' },
  { code: 'es', name: 'Spanish', nativeName: 'Espa\u00f1ol' },
];

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private readonly translate = inject(TranslateService);
  private readonly currentLanguageSubject = new BehaviorSubject<LanguageOption>(
    'en'
  );

  public readonly currentLanguage$: Observable<LanguageOption> =
    this.currentLanguageSubject.asObservable();

  constructor() {
    this.initializeLanguage();
  }

  private async initializeLanguage(): Promise<void> {
    this.translate.addLangs(['en', 'fr-CA', 'es']);
    this.translate.setDefaultLang('en');

    const savedLanguage = await this.getSavedLanguage();
    const languageToUse = savedLanguage || 'en';

    this.setLanguage(languageToUse);
  }

  private async getSavedLanguage(): Promise<LanguageOption | null> {
    try {
      const { value } = await Preferences.get({ key: LANGUAGE_KEY });
      if (value && this.isValidLanguage(value)) {
        return value as LanguageOption;
      }
    } catch (error) {
      console.error('Error loading saved language:', error);
    }
    return null;
  }

  private isValidLanguage(lang: string): boolean {
    return AVAILABLE_LANGUAGES.some((l) => l.code === lang);
  }

  public async setLanguage(language: LanguageOption): Promise<void> {
    if (!this.isValidLanguage(language)) {
      console.warn(`Invalid language: ${language}, falling back to English`);
      language = 'en';
    }

    try {
      await Preferences.set({ key: LANGUAGE_KEY, value: language });
      this.translate.use(language);
      this.currentLanguageSubject.next(language);

      console.log(`Language changed to: ${language}`);
    } catch (error) {
      console.error('Error setting language:', error);
    }
  }

  public getCurrentLanguage(): LanguageOption {
    return this.currentLanguageSubject.value;
  }

  public getLanguageConfig(code: LanguageOption): LanguageConfig | undefined {
    return AVAILABLE_LANGUAGES.find((l) => l.code === code);
  }

  public getAllLanguages(): LanguageConfig[] {
    return AVAILABLE_LANGUAGES;
  }
}
