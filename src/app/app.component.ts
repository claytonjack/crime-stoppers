import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { IonApp, IonRouterOutlet, Platform } from '@ionic/angular/standalone';
import { SideMenuComponent } from 'src/app/core/components/side-menu/side-menu.component';
import { LockScreenComponent } from 'src/app/core/components/lock-screen/lock-screen.component';
import { NotificationsService } from '@app/core/pages/settings/services/notifications.service';
import { StatusBarService } from 'src/app/core/services/status-bar.service';
import { ThemeService } from 'src/app/core/pages/settings/services/theme.service';
import { FontSizeService } from 'src/app/core/pages/settings/services/font-size.service';
import { PrivacyModeService } from 'src/app/core/pages/privacy-mode/services/privacy-mode.service';
import { LanguageService } from 'src/app/core/pages/settings/services/language.service';
import { BiometricAuthService } from 'src/app/core/services/biometric-auth.service';
import { App, AppState } from '@capacitor/app';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonApp, IonRouterOutlet, SideMenuComponent, LockScreenComponent],
})
export class AppComponent implements OnInit, OnDestroy {
  private readonly themeService = inject(ThemeService);
  private readonly fontSizeService = inject(FontSizeService);
  private readonly privacyModeService = inject(PrivacyModeService);
  private readonly languageService = inject(LanguageService);
  private readonly biometricAuthService = inject(BiometricAuthService);

  private readonly platform = inject(Platform);
  private readonly notificationsService = inject(NotificationsService);
  private readonly statusBarService = inject(StatusBarService);

  private appStateListener: any;

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

    // Set up biometric authentication listener
    this.setupBiometricAuthListener();

    console.log('BiometricAuthService initialized');
  }

  ngOnDestroy() {
    if (this.appStateListener) {
      this.appStateListener.remove();
    }
  }

  private setupBiometricAuthListener(): void {
    if (!this.platform.is('capacitor')) {
      return;
    }

    // Listen for app state changes
    this.appStateListener = App.addListener(
      'appStateChange',
      async (state: AppState) => {
        if (!state.isActive) {
          // App went to background - mark as unauthenticated if auth is enabled
          this.biometricAuthService.markAsUnauthenticated();
          return;
        }

        // App came to foreground - allow the lock screen to handle prompting.
        // Reset the authentication flag so the overlay auto-attempts on resume.
        if (this.biometricAuthService.isAuthEnabled()) {
          this.biometricAuthService.markAsUnauthenticated();
        }
      }
    );
  }
}
