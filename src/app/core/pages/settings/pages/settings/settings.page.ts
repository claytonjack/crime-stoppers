import { LocalNotifications } from '@capacitor/local-notifications';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIcon } from '@ng-icons/core';
import { TranslatePipe } from '@ngx-translate/core';
import { BaseImport } from 'src/app/core/base-import';
import {
  IonContent,
  IonItem,
  IonLabel,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonToggle,
  AlertController,
} from '@ionic/angular/standalone';
import { SettingsPageService } from 'src/app/core/pages/settings/services/settings-page.service';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import {
  ThemeType,
  FontSizeOption,
  LanguageOption,
} from 'src/app/core/pages/settings/models/settings.model';
import { Preferences } from '@capacitor/preferences';
import { NotificationsService } from '@app/core/pages/settings/services/notifications.service';
import { BiometricAuthService } from '@app/core/services/authentication.service';
import { ScreenReaderService } from '@app/core/pages/settings/services/screen-reader.service';

export const settingsPageSelector = 'app-settings';

@Component({
  selector: settingsPageSelector,
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [
    ...BaseImport,
    IonTitle,
    IonToolbar,
    IonHeader,
    CommonModule,
    IonContent,
    IonItem,
    IonLabel,
    NgIcon,
    IonToggle,
    TranslatePipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsPage {
  private readonly settingsPageService = inject(SettingsPageService);
  private readonly router = inject(Router);
  private readonly notificationsService = inject(NotificationsService);
  private readonly biometricAuthService = inject(BiometricAuthService);
  private readonly alertController = inject(AlertController);
  private readonly screenReader = inject(ScreenReaderService);

  public notificationPermissionStatus: 'granted' | 'denied' | 'prompt' =
    'prompt';
  public notificationEnabled$ = this.notificationsService.notificationEnabled$;
  public biometricAuthEnabled$ = this.biometricAuthService.authEnabled$;
  public biometricTypeName$ = new Promise<string>((resolve) => {
    this.biometricAuthService.getBiometryTypeName().then(resolve);
  });

  constructor() {
    this.checkNotificationPermission();
    this.announcePageLoad();
  }

  private async announcePageLoad() {
    await this.screenReader.speak('Settings page loaded');
  }

  public async onNotificationEnabledToggle(event: any) {
    const checked = event.detail.checked;
    await this.notificationsService.setEnabled(checked);
  }

  private async checkNotificationPermission() {
    try {
      const result = await LocalNotifications.checkPermissions();
      this.notificationPermissionStatus =
        result.display === 'granted'
          ? 'granted'
          : result.display === 'denied'
          ? 'denied'
          : 'prompt';
    } catch (e) {
      this.notificationPermissionStatus = 'prompt';
    }
  }

  public async onNotificationPermissionToggle(event: any) {
    if (event.detail.checked) {
      const result = await LocalNotifications.requestPermissions();
      this.notificationPermissionStatus =
        result.display === 'granted'
          ? 'granted'
          : result.display === 'denied'
          ? 'denied'
          : 'prompt';
    } else {
      this.notificationPermissionStatus = 'denied';
      alert('To fully disable notifications, please use your device settings.');
    }
  }

  public async onBiometricAuthToggle(event: any) {
    const checked = event.detail.checked;

    if (checked) {
      // Try to enable biometric auth
      const availability =
        await this.biometricAuthService.checkBiometryAvailability();

      if (!availability.isAvailable) {
        // Show alert that biometrics are not available
        const alert = await this.alertController.create({
          header: 'Biometric Authentication Unavailable',
          message:
            'Biometric authentication is not available on this device. Please ensure you have set up fingerprint, face recognition, or a device PIN/password in your device settings.',
          buttons: ['OK'],
        });
        await alert.present();

        // Reset toggle
        event.target.checked = false;
        return;
      }

      try {
        const success = await this.biometricAuthService.enableAuth();
        if (!success) {
          // User cancelled or authentication failed
          event.target.checked = false;
        }
      } catch (error) {
        console.error('Error enabling biometric auth:', error);
        const alert = await this.alertController.create({
          header: 'Error',
          message:
            'Failed to enable biometric authentication. Please try again.',
          buttons: ['OK'],
        });
        await alert.present();
        event.target.checked = false;
      }
    } else {
      // Disable biometric auth
      await this.biometricAuthService.disableAuth();
    }
  }

  private readonly displayNames = {
    theme: {
      light: 'core.settings.theme.light',
      dark: 'core.settings.theme.dark',
      system: 'core.settings.theme.system',
    } as Record<ThemeType, string>,
    fontSize: {
      small: 'core.settings.fontSize.small',
      medium: 'core.settings.fontSize.medium',
      large: 'core.settings.fontSize.large',
    } as Record<FontSizeOption, string>,
    privacyMode: {
      true: 'Enabled',
      false: 'Disabled',
    },
    language: {
      en: 'core.settings.language.options.en',
      'fr-CA': 'core.settings.language.options.fr-CA',
      es: 'core.settings.language.options.es',
    } as Record<LanguageOption, string>,
  };

  public readonly theme$ = this.settingsPageService.theme$;
  public readonly fontSize$ = this.settingsPageService.fontSize$;
  public readonly privacyMode$ = this.settingsPageService.privacyMode$;
  public readonly language$ = this.settingsPageService.language$;

  public readonly themeDisplayName$ = this.theme$.pipe(
    map(
      (theme) => this.displayNames.theme[theme] || 'core.settings.theme.system'
    )
  );

  public readonly fontSizeDisplayName$ = this.fontSize$.pipe(
    map(
      (fontSize) =>
        this.displayNames.fontSize[fontSize] || 'core.settings.fontSize.medium'
    )
  );

  public readonly languageDisplayName$ = this.language$.pipe(
    map(
      (language) =>
        this.displayNames.language[language] ||
        'core.settings.language.options.en'
    )
  );

  public async onThemeClick(): Promise<void> {
    await this.screenReader.speak('Theme settings clicked');
    await this.settingsPageService.presentThemeActionSheet();
  }

  public async onFontSizeClick(): Promise<void> {
    await this.screenReader.speak('Font size settings clicked');
    await this.settingsPageService.presentFontSizeActionSheet();
  }

  public onPrivacyModeToggle(enabled: boolean): void {
    this.settingsPageService.setPrivacyMode(enabled);
    if (enabled) {
      this.router.navigate(['/privacy-mode']);
    }
  }

  public async onResetSettings(): Promise<void> {
    await this.screenReader.speak('Reset settings clicked');
    await this.settingsPageService.presentResetSettingsActionSheet();
  }

  public async onLanguageClick(): Promise<void> {
    await this.screenReader.speak('Language settings clicked');
    await this.settingsPageService.presentLanguageActionSheet();
  }

  public async onScreenReaderClick(): Promise<void> {
    await this.screenReader.speak('Screen reader settings clicked');
    console.log('Screen reader settings clicked');
  }

  public async onLoginAuthClick(): Promise<void> {
    await this.screenReader.speak('Authentication settings clicked');
    console.log('Login authentication settings clicked');
  }

  public async onNotificationsClick(): Promise<void> {
    await this.screenReader.speak('Notifications settings clicked');
    console.log('Notifications settings clicked');
  }
}
