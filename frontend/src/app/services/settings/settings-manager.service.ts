import { Injectable } from '@angular/core';
import { ThemeService, ThemeType } from './theme.service';
import { FontSizeService, FontSizeOption } from './font-size.service';
import { PrivacyModeService } from './privacy-mode.service';
import { Observable, BehaviorSubject, map } from 'rxjs';
import { Preferences } from '@capacitor/preferences';

export interface AppSettings {
  theme: ThemeType;
  fontSize: FontSizeOption;
  privacyMode: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class SettingsManagerService {
  private readonly SETTINGS_KEY = 'app_settings';
  private readonly DEFAULT_SETTINGS: AppSettings = {
    theme: 'system',
    fontSize: 'medium',
    privacyMode: false,
  };

  private settingsSubject = new BehaviorSubject<AppSettings>(
    this.DEFAULT_SETTINGS
  );
  public settings$: Observable<AppSettings> =
    this.settingsSubject.asObservable();

  public theme$: Observable<ThemeType> = this.settings$.pipe(
    map((settings) => settings.theme)
  );
  public fontSize$: Observable<FontSizeOption> = this.settings$.pipe(
    map((settings) => settings.fontSize)
  );
  public privacyMode$: Observable<boolean> = this.settings$.pipe(
    map((settings) => settings.privacyMode)
  );

  constructor(
    private themeService: ThemeService,
    private fontSizeService: FontSizeService,
    private privacyModeService: PrivacyModeService
  ) {
    this.loadSettings();
  }

  private async loadSettings(): Promise<void> {
    const { value } = await Preferences.get({ key: this.SETTINGS_KEY });
    if (value) {
      const settings = JSON.parse(value) as AppSettings;
      this.applySettings(settings);
    } else {
      this.applySettings(this.DEFAULT_SETTINGS);
    }
  }

  private applySettings(settings: AppSettings): void {
    this.themeService.applyTheme(settings.theme);
    this.fontSizeService.applyFontSize(settings.fontSize);
    this.privacyModeService.updatePrivacyMode(settings.privacyMode);

    this.settingsSubject.next(settings);
    this.saveSettings(settings);
  }

  private async saveSettings(settings: AppSettings): Promise<void> {
    await Preferences.set({
      key: this.SETTINGS_KEY,
      value: JSON.stringify(settings),
    });
  }

  async setTheme(theme: ThemeType): Promise<void> {
    const newSettings = {
      ...this.settingsSubject.value,
      theme,
    };
    this.applySettings(newSettings);
  }

  async setFontSize(fontSize: FontSizeOption): Promise<void> {
    const newSettings = {
      ...this.settingsSubject.value,
      fontSize,
    };
    this.applySettings(newSettings);
  }

  async setPrivacyMode(enabled: boolean): Promise<void> {
    const newSettings = {
      ...this.settingsSubject.value,
      privacyMode: enabled,
    };
    this.applySettings(newSettings);
  }

  async resetAllSettings(): Promise<void> {
    this.applySettings(this.DEFAULT_SETTINGS);
  }
}
