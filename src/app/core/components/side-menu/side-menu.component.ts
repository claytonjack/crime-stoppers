import { Component, inject } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import {
  IonMenu,
  IonContent,
  IonItem,
  IonLabel,
  MenuController,
} from '@ionic/angular/standalone';

import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { PrivacyModeService } from '../../../features/privacy-mode/services/privacy-mode.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
  standalone: true,
  imports: [RouterModule, IonMenu, IonContent, IonItem, IonLabel, NgIcon],
})
export class SideMenuComponent {
  private readonly menuCtrl = inject(MenuController);
  private readonly router = inject(Router);
  private readonly privacyModeService = inject(PrivacyModeService);

  activePage = '';

  constructor() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.activePage = event.urlAfterRedirects.replace('/', '');
      });
  }

  get isPrivacyModeEnabled(): boolean {
    return this.privacyModeService.isEnabled;
  }

  async goToSuspects() {
    this.activePage = 'suspects';
    await this.menuCtrl.close('side-menu');
    this.router.navigate(['/suspects']);
  }

  async goToCrimeStats() {
    this.activePage = 'crime-stats';
    await this.menuCtrl.close('side-menu');
    this.router.navigate(['/crime-stats']);
  }

  async goToCommunityWatch() {
    this.activePage = 'community-watch';
    await this.menuCtrl.close('side-menu');
    this.router.navigate(['/community-watch']);
  }

  async goToContact() {
    this.activePage = 'contact';
    await this.menuCtrl.close('side-menu');
    this.router.navigate(['/contact']);
  }

  async goToSettings() {
    this.activePage = 'settings';
    await this.menuCtrl.close('side-menu');
    this.router.navigate(['/settings']);
  }

  async closeMenu() {
    await this.menuCtrl.close('side-menu');
  }
}
