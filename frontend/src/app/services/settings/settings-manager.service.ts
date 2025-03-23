import { Injectable } from '@angular/core';
import { ThemeService, ThemeType } from './theme.service';
import { FontSizeService, FontSizeOption } from './font-size.service';
import { PrivacyModeService } from './privacy-mode.service';
import { combineLatest, Observable, map } from 'rxjs';

export interface AppSettings {
  theme: ThemeType;
  fontSize: FontSizeOption;
  privacyMode: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class SettingsManagerService {
  public settings$: Observable<AppSettings>;

  constructor(
    private themeService: ThemeService,
    private fontSizeService: FontSizeService,
    private privacyModeService: PrivacyModeService
  ) {
    this.initializeServices();

    this.settings$ = combineLatest([
      this.themeService.currentTheme$,
      this.fontSizeService.currentFontSize$,
      this.privacyModeService.privacyMode$,
    ]).pipe(
      map(([theme, fontSize, privacyMode]) => ({
        theme,
        fontSize,
        privacyMode,
      }))
    );
  }

  private initializeServices(): void {}

  async setTheme(theme: ThemeType): Promise<void> {
    await this.themeService.setTheme(theme);
  }

  async setFontSize(size: FontSizeOption): Promise<void> {
    await this.fontSizeService.setFontSize(size);
  }

  async setPrivacyMode(enabled: boolean): Promise<void> {
    await this.privacyModeService.setPrivacyMode(enabled);
  }

  async resetAllSettings(): Promise<void> {
    await this.themeService.setTheme('system');
    await this.fontSizeService.setFontSize('medium');
    await this.privacyModeService.setPrivacyMode(false);
  }
}
