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
export class SideMenuComponent implements OnInit {
  constructor(private menuCtrl: MenuController, private router: Router) {}

  ngOnInit() {}

  async goToSettings() {
    await this.menuCtrl.close('side-menu');
    this.router.navigate(['/settings']);
  }
}
