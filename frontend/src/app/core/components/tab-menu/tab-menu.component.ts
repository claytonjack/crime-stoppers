import { Component, EnvironmentInjector, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonFab,
  IonFabButton,
} from '@ionic/angular/standalone';
import { PrivacyModeService } from '../../../features/privacy-mode/services/privacy-mode.service';

@Component({
  selector: 'app-tab-menu',
  templateUrl: './tab-menu.component.html',
  styleUrls: ['./tab-menu.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonIcon,
    IonLabel,
    IonFab,
    IonFabButton,
  ],
})
export class TabMenuComponent {
  public environmentInjector = inject(EnvironmentInjector);

  constructor(private privacyModeService: PrivacyModeService) {}

  get isPrivacyModeEnabled(): boolean {
    return this.privacyModeService.isEnabled;
  }
}
