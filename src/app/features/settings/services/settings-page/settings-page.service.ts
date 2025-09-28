import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  ActionSheetController,
  AlertController,
} from '@ionic/angular/standalone';
import { ThemeService } from '../theme/theme.service';
import { FontSizeService } from '../font-size/font-size.service';
import { PrivacyModeService } from '../../../privacy-mode/services/privacy-mode.service';
import { ThemeType, FontSizeOption } from '../../models/settings.model';
import { AppIconService } from '../../../../core/services/app-icon.service';
import { Capacitor } from '@capacitor/core';

@Injectable({
  providedIn: 'root',
})
export class SettingsPageService {
  private readonly themeService = inject(ThemeService);
  private readonly fontSizeService = inject(FontSizeService);
  private readonly privacyModeService = inject(PrivacyModeService);
  private readonly actionSheetController = inject(ActionSheetController);
  private readonly alertController = inject(AlertController);
  private readonly appIconService = inject(AppIconService);

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
    const actionSheet = await this.actionSheetController.create({
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
    await actionSheet.present();
  }

  public async presentFontSizeActionSheet(): Promise<void> {
    const actionSheet = await this.actionSheetController.create({
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
    await actionSheet.present();
  }

  public async presentPrivacyModeActionSheet(): Promise<void> {
    const actionSheet = await this.actionSheetController.create({
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
    await actionSheet.present();
  }

  public async presentResetSettingsAlert(): Promise<void> {
    const alert = await this.alertController.create({
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
    await alert.present();
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

  public async presentAppIconAlert(): Promise<void> {
    const actionSheet = await this.actionSheetController.create({
      header: 'Choose App Icon',
      buttons: [
        {
          text: 'Default',
          handler: () => {
            this.appIconService.setIcon('default');
          },
        },
        {
          text: 'Blue',
          handler: () => {
            this.appIconService.setIcon('blue');
          },
        },
        {
          text: 'Red',
          handler: () => {
            this.appIconService.setIcon('red');
          },
        },
        {
          text: 'Green',
          handler: () => {
            this.appIconService.setIcon('green');
          },
        },
        {
          text: 'Yellow',
          handler: () => {
            this.appIconService.setIcon('yellow');
          },
        },
        {
          text: 'White',
          handler: () => {
            this.appIconService.setIcon('white');
          },
        },
        {
          text: 'Grey',
          handler: () => {
            this.appIconService.setIcon('grey');
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
        },
      ],
    });
    await actionSheet.present();
  }


}