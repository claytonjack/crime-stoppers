import { Component } from '@angular/core';
import {
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonItem,
  IonLabel,
  IonItemDivider,
} from '@ionic/angular/standalone';
import { HeaderComponent } from '../../../../core/components/header/header.component';

@Component({
  selector: 'app-dontate',
  templateUrl: 'donate.page.html',
  styleUrls: ['donate.page.scss'],
  standalone: true,
  imports: [
    IonLabel,
    IonItem,
    IonCol,
    IonRow,
    IonGrid,
    IonContent,
    HeaderComponent,
    IonItemDivider,
  ],
})
export class DonatePage {}
