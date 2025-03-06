import { Component } from '@angular/core';
import {
  IonApp,
  IonRouterOutlet,
  IonMenu,
  IonHeader,
  IonToolbar,
  IonTitle,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  menuOutline,
  homeOutline,
  informationCircleOutline,
  callOutline,
  globeOutline,
  eyeOutline,
  compassOutline,
  shieldCheckmarkOutline,
  megaphoneOutline,
  documentTextOutline,
  shareOutline,
  checkmarkDoneOutline,
  cashOutline,
  cardOutline,
  downloadOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonApp, IonRouterOutlet, IonMenu, IonHeader, IonToolbar, IonTitle],
})
export class AppComponent {
  constructor() {
    addIcons({
      menuOutline,
      homeOutline,
      informationCircleOutline,
      callOutline,
      globeOutline,
      eyeOutline,
      compassOutline,
      shieldCheckmarkOutline,
      megaphoneOutline,
      documentTextOutline,
      shareOutline,
      checkmarkDoneOutline,
      cashOutline,
      cardOutline,
      downloadOutline,
    });
  }
}