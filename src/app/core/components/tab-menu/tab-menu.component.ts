import { Component, EnvironmentInjector, inject } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonLabel,
  IonFab,
  IonFabButton,
  IonRouterOutlet,
} from '@ionic/angular/standalone';
import { PrivacyModeService } from 'src/app/core/pages/privacy-mode/services/privacy-mode.service';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { ScreenReaderService } from '@app/core/pages/settings/services/screen-reader.service';

@Component({
  selector: 'app-tab-menu',
  templateUrl: './tab-menu.component.html',
  styleUrls: ['./tab-menu.component.scss'],
  standalone: true,
  imports: [
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonLabel,
    IonFab,
    IonFabButton,
    IonRouterOutlet,
    NgIcon,
    TranslateModule,
  ],
})
export class TabMenuComponent {
  public environmentInjector = inject(EnvironmentInjector);
  private readonly privacyModeService = inject(PrivacyModeService);
  private readonly screenReader = inject(ScreenReaderService);
  private readonly router = inject(Router);

  get isPrivacyModeEnabled(): boolean {
    return this.privacyModeService.isEnabled;
  }

  constructor() {
    // Announce navigation when user switches between tabs
    this.router.events.subscribe((event: any) => {
      if (event.url) {
        const route = event.url.replace('/', '');
        let spokenText = '';

        switch (route) {
          case 'alerts':
            spokenText = 'Alerts tab selected';
            break;
          case 'events':
            spokenText = 'Events tab selected';
            break;
          case 'crime-map':
            spokenText = 'Crime Map tab selected';
            break;
          case 'crime-stats':
            spokenText = 'Crime Statistics tab selected';
            break;
          case 'home':
            spokenText = 'Home screen opened';
            break;
        }

        if (spokenText) {
          this.screenReader.speak(spokenText);
        }
      }
    });
  }

  async onHomeFabClick() {
    await this.screenReader.speak(
      'Home button clicked, navigating to home screen'
    );
  }
}
