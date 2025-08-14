import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { SideMenuComponent } from './core/components/side-menu/side-menu.component';
import { IconsService } from './core/services/icons.service';
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
export class AppComponent {
  constructor(
    private iconsService: IconsService,
    private themeService: ThemeService,
    private fontSizeService: FontSizeService,
    private privacyModeService: PrivacyModeService
  ) {}
}
