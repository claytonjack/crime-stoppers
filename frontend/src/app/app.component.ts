import { Component, OnInit, inject } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { SideMenuComponent } from './core/components/side-menu/side-menu.component';
import { ThemeService } from './features/settings/services/theme/theme.service';
import { FontSizeService } from './features/settings/services/font-size/font-size.service';
import { PrivacyModeService } from './features/privacy-mode/services/privacy-mode.service';

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

  async ngOnInit() {
    // Initialize theme service to ensure proper theme is applied on startup
    // This will load the saved theme or apply the default theme
    console.log(
      'App initialized, current theme:',
      this.themeService.currentTheme
    );
  }
}
