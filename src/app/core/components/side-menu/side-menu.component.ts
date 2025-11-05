import { NotificationsService } from '@app/core/pages/settings/services/notifications.service';
import { Component, OnInit, inject } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import {
  IonMenu,
  IonContent,
  IonItem,
  IonLabel,
  MenuController,
} from '@ionic/angular/standalone';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { PrivacyModeService } from 'src/app/core/pages/privacy-mode/services/privacy-mode.service';
import { filter } from 'rxjs/operators';
import { TranslateModule } from '@ngx-translate/core';
import { ScreenReaderService } from '@app/core/pages/settings/services/screen-reader.service';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
  standalone: true,
  imports: [
    RouterModule,
    IonMenu,
    IonContent,
    IonItem,
    IonLabel,
    NgIcon,
    TranslateModule,
  ],
})
export class SideMenuComponent implements OnInit {
  private readonly menuCtrl = inject(MenuController);
  private readonly router = inject(Router);
  private readonly privacyModeService = inject(PrivacyModeService);
  private readonly notificationsService = inject(NotificationsService);
  private readonly screenReader = inject(ScreenReaderService);

  activePage = '';

  constructor() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.activePage = event.urlAfterRedirects.replace('/', '');
      });
  }

  ngOnInit() {
    this.menuCtrl
      .get('side-menu')
      .then((menuEl) => {
        if (menuEl) {
          // Listen for Ionic menu lifecycle events
          menuEl.addEventListener('ionDidOpen', () => {
            this.screenReader.speak('Side menu opened');
          });
          menuEl.addEventListener('ionDidClose', () => {
            this.screenReader.speak('Side menu closed');
          });
        }
      })
      .catch(() => {});
  }

  get isPrivacyModeEnabled(): boolean {
    return this.privacyModeService.isEnabled;
  }

  async testWeekly() {
    await this.screenReader.speak('Weekly notification test triggered');
    await this.notificationsService.triggerWeeklyTest();
    await this.menuCtrl.close('side-menu');
  }

  async testMonthly() {
    await this.screenReader.speak('Monthly notification test triggered');
    await this.notificationsService.triggerMonthlyTest();
    await this.menuCtrl.close('side-menu');
  }

  async testInactivity() {
    await this.screenReader.speak('Inactivity notification test triggered');
    await this.notificationsService.triggerInactivityTest();
    await this.menuCtrl.close('side-menu');
  }

  async goToSuspects() {
    await this.screenReader.speak('Navigating to Suspects page');
    this.activePage = 'suspects';
    await this.menuCtrl.close('side-menu');
    this.router.navigate(['/suspects']);
  }

  async goToCrimeStats() {
    await this.screenReader.speak('Navigating to Crime Statistics page');
    this.activePage = 'crime-stats';
    await this.menuCtrl.close('side-menu');
    this.router.navigate(['/crime-stats']);
  }

  async goToCommunityWatch() {
    await this.screenReader.speak('Navigating to Community Watch page');
    this.activePage = 'community-watch';
    await this.menuCtrl.close('side-menu');
    this.router.navigate(['/community-watch']);
  }

  async goToContact() {
    await this.screenReader.speak('Navigating to Contact page');
    this.activePage = 'contact';
    await this.menuCtrl.close('side-menu');
    this.router.navigate(['/contact']);
  }

  async goToSettings() {
    await this.screenReader.speak('Navigating to Settings page');
    this.activePage = 'settings';
    await this.menuCtrl.close('side-menu');
    this.router.navigate(['/settings']);
  }

  async closeMenu() {
    await this.screenReader.speak('Closing side menu');
    await this.menuCtrl.close('side-menu');
  }
}
