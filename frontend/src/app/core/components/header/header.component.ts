import { Component, Input, inject } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonMenuToggle,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonMenuToggle,
    NgIcon,
  ],
})
export class HeaderComponent {
  @Input() title: string = '';
}
