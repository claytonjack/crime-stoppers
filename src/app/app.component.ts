import { Component, OnInit, inject } from '@angular/core';
import { IonApp, IonRouterOutlet, Platform } from '@ionic/angular/standalone';
import { SideMenuComponent } from './core/components/side-menu/side-menu.component';
import { ThemeService } from './features/settings/services/theme/theme.service';
import { FontSizeService } from './features/settings/services/font-size/font-size.service';
import { PrivacyModeService } from './features/privacy-mode/services/privacy-mode.service';
import { LocalNotificationsService } from './core/services/local-notifications.service';

import { StatusBar, Style } from '@capacitor/status-bar';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonApp, IonRouterOutlet, SideMenuComponent],
})
export class AppComponent implements OnInit {
  private readonly themeService = inject(ThemeService);
  private readonly fontSizeService = inject(FontSizeService);
  private readonly privacyModeService = inject(PrivacyModeService);
  private readonly platform = inject(Platform);
  private readonly localNotificationsService = inject(
    LocalNotificationsService
  );

  async ngOnInit() {
    console.log(
      'App initialized, current theme:',
      this.themeService.currentTheme
    );

    await this.platform.ready();

    try {
      await StatusBar.setOverlaysWebView({ overlay: false });
      await StatusBar.setStyle({ style: Style.Dark });
      await StatusBar.setBackgroundColor({ color: '#ffffff' });
    } catch (err) {
      console.warn('StatusBar plugin not available:', err);
    }

    try {
      await this.localNotificationsService.init();
    } catch (e) {
      console.error('Failed to init notifications:', e);
    }
  }
}
