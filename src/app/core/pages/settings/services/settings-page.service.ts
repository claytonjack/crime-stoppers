import { Injectable, inject } from '@angular/core';
import { Observable, firstValueFrom } from 'rxjs';
import { ActionSheetController } from '@ionic/angular/standalone';
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
    const translations = await firstValueFrom(
      this.translate.get([
        'core.settings.theme.select',
        'core.settings.theme.light',
        'core.settings.theme.dark',
        'core.settings.theme.system',
      ])
    );
    const actionSheet = await this.actionSheetController.create({
      header: translations['core.settings.theme.select'],
      buttons: [
        {
          text: translations['core.settings.theme.light'],
          handler: (): void => {
            this.setTheme('light');
          },
        },
        {
          text: translations['core.settings.theme.dark'],
          handler: (): void => {
            this.setTheme('dark');
          },
        },
        {
          text: translations['core.settings.theme.system'],
          handler: (): void => {
            this.setTheme('system');
          },
        },
      ],
    });
    await actionSheet.present();
  }

  public async presentFontSizeActionSheet(): Promise<void> {
    const translations = await firstValueFrom(
      this.translate.get([
        'core.settings.fontSize.select',
        'core.settings.fontSize.small',
        'core.settings.fontSize.medium',
        'core.settings.fontSize.large',
      ])
    );
    const actionSheet = await this.actionSheetController.create({
      header: translations['core.settings.fontSize.select'],
      buttons: [
        {
          text: translations['core.settings.fontSize.small'],
          handler: (): void => {
            this.setFontSize('small');
          },
        },
        {
          text: translations['core.settings.fontSize.medium'],
          handler: (): void => {
            this.setFontSize('medium');
          },
        },
        {
          text: translations['core.settings.fontSize.large'],
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
    const translationKeys = [
      'core.settings.language.select',
      ...languages.map(
        (lang) => `core.settings.language.options.${lang.code}`
      ),
    ];
    const translations = await firstValueFrom(this.translate.get(translationKeys));
    const actionSheet = await this.actionSheetController.create({
      header: translations['core.settings.language.select'],
      buttons: [
        ...languages.map((lang) => ({
          text:
            translations[`core.settings.language.options.${lang.code}`] ||
            lang.nativeName,
          handler: (): void => {
            this.setLanguage(lang.code);
          },
        })),
      ],
    });
    await actionSheet.present();
  }

  public async presentResetSettingsActionSheet(): Promise<void> {
    const translations = await firstValueFrom(
      this.translate.get([
        'core.settings.reset.title',
        'core.settings.reset.reset',
        'core.settings.reset.cancel',
      ])
    );
    const actionSheet = await this.actionSheetController.create({
      header: translations['core.settings.reset.title'],
      buttons: [
        {
          text: translations['core.settings.reset.reset'],
          role: 'destructive',
          handler: (): void => {
            this.resetAllSettings();
          },
        },
        {
          text: translations['core.settings.reset.cancel'],
          role: 'cancel',
        },
      ],
    });
    await actionSheet.present();
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
