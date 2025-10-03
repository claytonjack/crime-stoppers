import { Injectable, inject } from '@angular/core';
import { Observable, firstValueFrom } from 'rxjs';
import {
  ActionSheetController,
  AlertController,
} from '@ionic/angular/standalone';
import { ThemeService } from './theme.service';
import { FontSizeService } from './font-size.service';
import { PrivacyModeService } from 'src/app/core/pages/privacy-mode/services/privacy-mode.service';
import { LanguageService } from './language.service';
import { TranslateService } from '@ngx-translate/core';
import {
  ThemeType,
  FontSizeOption,
  LanguageOption,
} from 'src/app/core/pages/settings/models/settings.model';

@Injectable({
  providedIn: 'root',
})
export class SettingsPageService {
  private readonly themeService: ThemeService = inject(ThemeService);
  private readonly fontSizeService: FontSizeService = inject(FontSizeService);
  private readonly privacyModeService: PrivacyModeService =
    inject(PrivacyModeService);
  private readonly languageService: LanguageService = inject(LanguageService);
  private readonly actionSheetController: ActionSheetController = inject(
    ActionSheetController
  );
  private readonly alertController: AlertController = inject(AlertController);
  private readonly translate: TranslateService = inject(TranslateService);

  public get theme$(): Observable<ThemeType> {
    return this.themeService.theme$;
  }

  public get fontSize$(): Observable<FontSizeOption> {
    return this.fontSizeService.fontSize$;
  }

  public get privacyMode$(): Observable<boolean> {
    return this.privacyModeService.privacyMode$;
  }

  public get language$(): Observable<LanguageOption> {
    return this.languageService.currentLanguage$;
  }

  public async presentThemeActionSheet(): Promise<void> {
    const [header, light, dark, system] = await Promise.all([
      firstValueFrom(this.translate.get('settings.theme.select')),
      firstValueFrom(this.translate.get('settings.theme.light')),
      firstValueFrom(this.translate.get('settings.theme.dark')),
      firstValueFrom(this.translate.get('settings.theme.system')),
    ]);
    const actionSheet = await this.actionSheetController.create({
      header,
      buttons: [
        {
          text: light,
          handler: (): void => {
            this.setTheme('light');
          },
        },
        {
          text: dark,
          handler: (): void => {
            this.setTheme('dark');
          },
        },
        {
          text: system,
          handler: (): void => {
            this.setTheme('system');
          },
        },
      ],
    });
    await actionSheet.present();
  }

  public async presentFontSizeActionSheet(): Promise<void> {
    const [header, small, medium, large] = await Promise.all([
      firstValueFrom(this.translate.get('settings.fontSize.select')),
      firstValueFrom(this.translate.get('settings.fontSize.small')),
      firstValueFrom(this.translate.get('settings.fontSize.medium')),
      firstValueFrom(this.translate.get('settings.fontSize.large')),
    ]);
    const actionSheet = await this.actionSheetController.create({
      header,
      buttons: [
        {
          text: small,
          handler: (): void => {
            this.setFontSize('small');
          },
        },
        {
          text: medium,
          handler: (): void => {
            this.setFontSize('medium');
          },
        },
        {
          text: large,
          handler: (): void => {
            this.setFontSize('large');
          },
        },
      ],
    });
    await actionSheet.present();
  }

  public async presentLanguageActionSheet(): Promise<void> {
    const languages = this.languageService.getAllLanguages();
    const [header] = await Promise.all([
      firstValueFrom(this.translate.get('settings.language.select')),
    ]);
    const actionSheet = await this.actionSheetController.create({
      header,
      buttons: [
        ...languages.map((lang) => ({
          text: `${lang.nativeName} (${lang.name})`,
          handler: (): void => {
            this.setLanguage(lang.code);
          },
        })),
      ],
    });
    await actionSheet.present();
  }

  public async presentResetSettingsAlert(): Promise<void> {
    const [header, message, cancel, reset] = await Promise.all([
      firstValueFrom(this.translate.get('settings.reset.title')),
      firstValueFrom(this.translate.get('settings.reset.confirm')),
      firstValueFrom(this.translate.get('settings.reset.cancel')),
      firstValueFrom(this.translate.get('settings.reset.reset')),
    ]);
    const alert = await this.alertController.create({
      header,
      message,
      buttons: [
        {
          text: cancel,
          role: 'cancel',
        },
        {
          text: reset,
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

  public async setLanguage(language: LanguageOption): Promise<void> {
    await this.languageService.setLanguage(language);
  }

  public resetAllSettings(): void {
    this.themeService.resetToDefault();
    this.fontSizeService.resetToDefault();
    this.privacyModeService.resetToDefault();
    this.languageService.setLanguage('en');
  }
}
