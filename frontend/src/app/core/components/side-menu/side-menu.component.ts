import { Component, OnInit } from '@angular/core';
import {
  IonMenu,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonIcon,
  IonLabel,
  MenuController,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { PrivacyModeService } from '../../../features/privacy-mode/services/privacy-mode.service';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IonMenu,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonIcon,
    IonLabel,
  ],
})
export class SideMenuComponent {
  constructor(
    private menuCtrl: MenuController,
    private router: Router,
    private privacyModeService: PrivacyModeService
  ) {}

  get isPrivacyModeEnabled(): boolean {
    return this.privacyModeService.isEnabled;
  }

  async goToSuspects() {
    await this.menuCtrl.close('side-menu');
    this.router.navigate(['/suspects']);
  }

  async goToCrimeStats() {
    await this.menuCtrl.close('side-menu');
    this.router.navigate(['/crime-stats']);
  }

  async goToCommunityWatch() {
    await this.menuCtrl.close('side-menu');
    this.router.navigate(['/community-watch']);
  }

  async goToContact() {
    await this.menuCtrl.close('side-menu');
    this.router.navigate(['/contact']);
  }

  async goToSettings() {
    await this.menuCtrl.close('side-menu');
    this.router.navigate(['/settings']);
  }
}
