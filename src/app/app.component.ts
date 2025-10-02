import { Component, OnInit, inject } from '@angular/core';
import { IonApp, IonRouterOutlet, Platform } from '@ionic/angular/standalone';
import { SideMenuComponent } from './core/components/side-menu/side-menu.component';
import { ThemeService } from './features/settings/services/theme/theme.service';
import { FontSizeService } from './features/settings/services/font-size/font-size.service';
import { PrivacyModeService } from './features/privacy-mode/services/privacy-mode.service';
import { LocalNotificationsService } from './core/services/local-notifications.service';

import { StatusBarService } from './core/services/status-bar.service';

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
  private readonly statusBarService = inject(StatusBarService);

  async ngOnInit() {
    await this.platform.ready();

    try {
      await this.statusBarService.init();
    } catch (err) {
      console.warn('StatusBarService not available:', err);
    }

    try {
      await this.localNotificationsService.init();
    } catch (e) {
      console.error('Failed to init notifications:', e);
    }
  }
}
