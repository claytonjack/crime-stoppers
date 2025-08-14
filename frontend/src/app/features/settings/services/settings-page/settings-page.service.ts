import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ThemeService } from '../theme/theme.service';
import { FontSizeService } from '../font-size/font-size.service';
import { PrivacyModeService } from '../../../privacy-mode/services/privacy-mode.service';
import { DialogService } from '../../../../core/services/dialog.service';
import { ThemeType, FontSizeOption } from '../../models/settings.model';

@Injectable({
  providedIn: 'root',
})
export class SettingsPageService {
  constructor(
    private readonly themeService: ThemeService,
    private readonly fontSizeService: FontSizeService,
    private readonly privacyModeService: PrivacyModeService,
    private readonly dialogService: DialogService
  ) {}

  public get theme$(): Observable<ThemeType> {
    return this.themeService.theme$;
  }

  public get fontSize$(): Observable<FontSizeOption> {
    return this.fontSizeService.fontSize$;
  }

  public get privacyMode$(): Observable<boolean> {
    return this.privacyModeService.privacyMode$;
  }

  public async presentThemeActionSheet(): Promise<void> {
    await this.dialogService.presentActionSheet({
      header: 'Select Theme',
      buttons: [
        {
          text: 'Light',
          handler: (): void => {
            this.setTheme('light');
          },
        },
        {
          text: 'Dark',
          handler: (): void => {
            this.setTheme('dark');
          },
        },
        {
          text: 'System',
          handler: (): void => {
            this.setTheme('system');
          },
        },
      ],
    });
  }

  public async presentFontSizeActionSheet(): Promise<void> {
    await this.dialogService.presentActionSheet({
      header: 'Select Font Size',
      buttons: [
        {
          text: 'Small',
          handler: (): void => {
            this.setFontSize('small');
          },
        },
        {
          text: 'Medium',
          handler: (): void => {
            this.setFontSize('medium');
          },
        },
        {
          text: 'Large',
          handler: (): void => {
            this.setFontSize('large');
          },
        },
      ],
    });
  }

  public async presentPrivacyModeActionSheet(): Promise<void> {
    await this.dialogService.presentActionSheet({
      header: 'Privacy Mode',
      buttons: [
        {
          text: 'Enabled',
          handler: (): void => {
            this.setPrivacyMode(true);
          },
        },
        {
          text: 'Disabled',
          handler: (): void => {
            this.setPrivacyMode(false);
          },
        },
      ],
    });
  }

  public async presentResetSettingsAlert(): Promise<void> {
    await this.dialogService.presentAlert({
      header: 'Reset Settings',
      message:
        'Are you sure you want to reset all settings to their default values?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Reset',
          role: 'destructive',
          handler: (): void => {
            this.resetAllSettings();
          },
        },
      ],
    });
  }

  public setTheme(theme: ThemeType): void {
    this.themeService.setTheme(theme);
  }

  public setFontSize(fontSize: FontSizeOption): void {
    this.fontSizeService.setFontSize(fontSize);
  }

  public setPrivacyMode(enabled: boolean): void {
    this.privacyModeService.setPrivacyMode(enabled);
  }

  public resetAllSettings(): void {
    this.themeService.resetToDefault();
    this.fontSizeService.resetToDefault();
    this.privacyModeService.resetToDefault();
  }
}
