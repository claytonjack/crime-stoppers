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
  IonToggle,
} from '@ionic/angular/standalone';
import { SettingsPageService } from '../../services/settings-page/settings-page.service';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { ThemeType, FontSizeOption } from '../../models/settings.model';

export const settingsPageSelector = 'app-settings';

@Component({
  selector: settingsPageSelector,
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [
    IonToggle,
    ...BaseImport,
    IonTitle,
    IonToolbar,
    IonHeader,
    CommonModule,
    IonContent,
    IonItem,
    IonLabel,
    NgIcon,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsPage {
  private readonly settingsPageService = inject(SettingsPageService);
  private readonly router = inject(Router);

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

  // For ion-toggle binding
  public notificationEnabled = false;

  public onNotificationEnabledToggle(event: any): void {
    this.notificationEnabled = event.detail.checked;
  }

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

  public async onAppIconClick(): Promise<void> {
    console.log('clicked');
    await this.settingsPageService.presentAppIconAlert();
    console.log('test----App icon settings clicked');
  }
}
