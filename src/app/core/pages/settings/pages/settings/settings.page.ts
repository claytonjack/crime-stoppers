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

  public notificationPermissionStatus: 'granted' | 'denied' | 'prompt' =
    'prompt';
  public notificationEnabled$ = this.notificationsService.notificationEnabled$;

  constructor() {
    this.checkNotificationPermission();
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

  private readonly displayNames = {
    theme: {
      light: 'Light',
      dark: 'Dark',
      system: 'System',
    } as Record<ThemeType, string>,
    fontSize: {
      small: 'Small',
      medium: 'Medium',
      large: 'Large',
    } as Record<FontSizeOption, string>,
    privacyMode: {
      true: 'Enabled',
      false: 'Disabled',
    },
    language: {
      en: 'English',
      'fr-CA': 'Français (CA)',
      es: 'Español',
    } as Record<LanguageOption, string>,
  };

  public readonly theme$ = this.settingsPageService.theme$;
  public readonly fontSize$ = this.settingsPageService.fontSize$;
  public readonly privacyMode$ = this.settingsPageService.privacyMode$;
  public readonly language$ = this.settingsPageService.language$;

  public readonly themeDisplayName$ = this.theme$.pipe(
    map((theme) => this.displayNames.theme[theme] || 'System')
  );

  public readonly fontSizeDisplayName$ = this.fontSize$.pipe(
    map((fontSize) => this.displayNames.fontSize[fontSize] || 'Medium')
  );

  public readonly languageDisplayName$ = this.language$.pipe(
    map((language) => this.displayNames.language[language] || 'English')
  );

  public async onThemeClick(): Promise<void> {
    await this.settingsPageService.presentThemeActionSheet();
  }

  public async onFontSizeClick(): Promise<void> {
    await this.settingsPageService.presentFontSizeActionSheet();
  }

  public onPrivacyModeToggle(enabled: boolean): void {
    this.settingsPageService.setPrivacyMode(enabled);
    if (enabled) {
      this.router.navigate(['/privacy-mode']);
    }
  }

  public async onResetSettings(): Promise<void> {
    await this.settingsPageService.presentResetSettingsAlert();
  }

  public async onLanguageClick(): Promise<void> {
    await this.settingsPageService.presentLanguageActionSheet();
  }

  public async onScreenReaderClick(): Promise<void> {
    console.log('Screen reader settings clicked');
  }

  public async onLoginAuthClick(): Promise<void> {
    console.log('Login authentication settings clicked');
  }

  public async onNotificationsClick(): Promise<void> {
    console.log('Notifications settings clicked');
  }
}
