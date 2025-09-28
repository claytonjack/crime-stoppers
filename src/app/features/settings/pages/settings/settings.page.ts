import { LocalNotifications } from '@capacitor/local-notifications';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIcon } from '@ng-icons/core';
import { BaseImport } from '../../../../core/base-import';
import {
  IonContent,
  IonItem,
  IonLabel,
  IonHeader,
  IonToolbar,
  IonTitle,
} from '@ionic/angular/standalone';
import { SettingsPageService } from '../../services/settings-page/settings-page.service';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { ThemeType, FontSizeOption } from '../../models/settings.model';
import { Preferences } from '@capacitor/preferences';

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
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsPage {
  private readonly settingsPageService = inject(SettingsPageService);
  private readonly router = inject(Router);

  public notificationPermissionStatus: 'granted' | 'denied' | 'prompt' =
    'prompt';
  public notificationEnabled = true;

  constructor() {
    this.checkNotificationPermission();
    this.loadNotificationEnabled();
  }

  private async loadNotificationEnabled() {
    // Try to load from Preferences, fallback to true
    try {
      const { value } = await Preferences.get({ key: 'notificationEnabled' });
      this.notificationEnabled = value === null ? true : value === 'true';
    } catch {
      this.notificationEnabled = true;
    }
  }

  private async saveNotificationEnabled(value: boolean) {
    this.notificationEnabled = value;
    await Preferences.set({
      key: 'notificationEnabled',
      value: value ? 'true' : 'false',
    });
  }
  public async onNotificationEnabledToggle(event: any) {
    const checked = event.detail.checked;
    await this.saveNotificationEnabled(checked);
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
      // Request permission
      const result = await LocalNotifications.requestPermissions();
      this.notificationPermissionStatus =
        result.display === 'granted'
          ? 'granted'
          : result.display === 'denied'
          ? 'denied'
          : 'prompt';
    } else {
      // No API to revoke, so show info and update UI
      this.notificationPermissionStatus = 'denied';
      // Optionally, show a toast or alert to guide user to system settings
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
  };

  public readonly theme$ = this.settingsPageService.theme$;
  public readonly fontSize$ = this.settingsPageService.fontSize$;
  public readonly privacyMode$ = this.settingsPageService.privacyMode$;

  public readonly themeDisplayName$ = this.theme$.pipe(
    map((theme) => this.displayNames.theme[theme] || 'System')
  );

  public readonly fontSizeDisplayName$ = this.fontSize$.pipe(
    map((fontSize) => this.displayNames.fontSize[fontSize] || 'Medium')
  );

  public readonly privacyModeDisplayName$ = this.privacyMode$.pipe(
    map(
      (enabled) =>
        this.displayNames.privacyMode[enabled.toString() as 'true' | 'false'] ||
        'Disabled'
    )
  );

  public async onThemeClick(): Promise<void> {
    await this.settingsPageService.presentThemeActionSheet();
  }

  public async onFontSizeClick(): Promise<void> {
    await this.settingsPageService.presentFontSizeActionSheet();
  }

  public async onPrivacyModeClick(): Promise<void> {
    await this.settingsPageService.presentPrivacyModeActionSheet();
  }

  public async onResetSettings(): Promise<void> {
    await this.settingsPageService.presentResetSettingsAlert();
  }

  public async onLanguageClick(): Promise<void> {
    console.log('Language settings clicked');
  }

  public async onScreenReaderClick(): Promise<void> {
    console.log('Screen reader settings clicked');
  }

  public async onLoginAuthClick(): Promise<void> {
    console.log('Login authentication settings clicked');
  }

  // App icon settings removed

  public async onNotificationsClick(): Promise<void> {
    console.log('Notifications settings clicked');
  }
}
