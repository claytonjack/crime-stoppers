import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonButton,
  IonIcon,
  IonCardHeader,
  IonRadio,
  IonRadioGroup,
  IonToggle,
  IonCard,
  IonRange,
} from '@ionic/angular/standalone';
import { SettingsManagerService } from '../../services/settings/settings-manager.service';
import { ThemeType } from '../../services/settings/theme.service';
import { FontSizeOption } from '../../services/settings/font-size.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings-menu',
  templateUrl: './settings-menu.component.html',
  styleUrls: ['./settings-menu.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
    IonCardHeader,
    IonItem,
    IonLabel,
    IonButton,
    IonIcon,
    IonRadio,
    IonRadioGroup,
    IonToggle,
    IonCard,
    IonRange,
  ],
})
export class SettingsMenuComponent implements OnInit {
  currentTheme: ThemeType = 'system';
  currentFontSize: FontSizeOption = 'medium';
  fontSizeValue: number = 1; // Default to medium (1)
  privacyMode: boolean = false;

  constructor(
    private settingsManager: SettingsManagerService,
    private router: Router
  ) {}

  ngOnInit() {
    this.settingsManager.settings$.subscribe((settings) => {
      this.currentTheme = settings.theme;
      this.currentFontSize = settings.fontSize;
      this.privacyMode = settings.privacyMode;

      switch (settings.fontSize) {
        case 'small':
          this.fontSizeValue = 0;
          break;
        case 'medium':
          this.fontSizeValue = 1;
          break;
        case 'large':
          this.fontSizeValue = 2;
          break;
      }
    });
  }

  onThemeChange(event: CustomEvent) {
    const theme = event.detail.value as ThemeType;
    this.settingsManager.setTheme(theme);
  }

  onFontSizeRangeChange(event: CustomEvent) {
    const value = event.detail.value as number;
    let fontSize: FontSizeOption;

    switch (value) {
      case 0:
        fontSize = 'small';
        break;
      case 1:
        fontSize = 'medium';
        break;
      case 2:
        fontSize = 'large';
        break;
      default:
        fontSize = 'medium';
    }

    this.settingsManager.setFontSize(fontSize);
  }

  getFontSizeLabel(): string {
    switch (this.currentFontSize) {
      case 'small':
        return 'Small';
      case 'medium':
        return 'Medium';
      case 'large':
        return 'Large';
      default:
        return 'Medium';
    }
  }

  onPrivacyModeChange(event: CustomEvent) {
    const enabled = event.detail.checked;
    this.settingsManager.setPrivacyMode(enabled);

    if (enabled) {
      this.router.navigate(['/privacy-mode']);
    } else {
      this.router.navigate(['/']);
    }
  }

  resetSettings() {
    this.settingsManager.resetAllSettings();

    if (this.privacyMode) {
      this.router.navigate(['/']);
    }
  }
}
