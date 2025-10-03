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
import { Router } from '@angular/router';

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
  ],
})
export class TabMenuComponent {
  public environmentInjector = inject(EnvironmentInjector);
  private readonly privacyModeService = inject(PrivacyModeService);

  get isPrivacyModeEnabled(): boolean {
    return this.privacyModeService.isEnabled;
  }
}
