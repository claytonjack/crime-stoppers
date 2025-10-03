import { Component, OnInit, inject } from '@angular/core';
import { IonApp, IonRouterOutlet, Platform } from '@ionic/angular/standalone';
import { SideMenuComponent } from 'src/app/core/components/side-menu/side-menu.component';
import { NotificationsService } from '@app/core/pages/settings/services/notifications.service';
import { StatusBarService } from 'src/app/core/services/status-bar.service';
import { ThemeService } from 'src/app/core/pages/settings/services/theme.service';
import { FontSizeService } from 'src/app/core/pages/settings/services/font-size.service';
import { PrivacyModeService } from 'src/app/core/pages/privacy-mode/services/privacy-mode.service';
import { LanguageService } from 'src/app/core/pages/settings/services/language.service';

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
  private readonly languageService = inject(LanguageService);

  private readonly platform = inject(Platform);
  private readonly notificationsService = inject(NotificationsService);
  private readonly statusBarService = inject(StatusBarService);

  async ngOnInit() {
    await this.platform.ready();

    try {
      await this.statusBarService.init();
    } catch (err) {
      console.warn('StatusBarService not available:', err);
    }

    try {
      await this.notificationsService.init();
    } catch (e) {
      console.error('Failed to init notifications:', e);
    }
  }
}
