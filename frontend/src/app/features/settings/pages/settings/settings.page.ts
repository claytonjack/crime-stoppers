import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseImport } from '../../../../core/base-import';
import {
  IonContent,
  IonItem,
  IonLabel,
  IonIcon,
  IonList,
  IonHeader,
  IonToolbar,
  IonTitle,
} from '@ionic/angular/standalone';
import { SettingsPageService } from '../../services/settings-page/settings-page.service';
import { ThemeNamePipe } from '../../pipes/theme-name/theme-name.pipe';
import { FontSizeNamePipe } from '../../pipes/font-size-name/font-size-name.pipe';
import { PrivacyModeNamePipe } from '../../pipes/privacy-mode-name/privacy-mode-name.pipe';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  sunny,
  text,
  eye,
  refresh,
  settings,
  chevronForward,
} from 'ionicons/icons';

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
    IonIcon,
    IonList,
    ThemeNamePipe,
    FontSizeNamePipe,
    PrivacyModeNamePipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsPage {
  public readonly theme$ = this.settingsPageService.theme$;
  public readonly fontSize$ = this.settingsPageService.fontSize$;
  public readonly privacyMode$ = this.settingsPageService.privacyMode$;

  constructor(
    private readonly settingsPageService: SettingsPageService,
    private readonly router: Router
  ) {
    addIcons({
      sunny,
      chevronForward,
      text,
      eye,
      refresh,
      settings,
    });
  }

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
}
