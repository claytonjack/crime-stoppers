import { Component } from '@angular/core';
import { 
  IonMenu, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent
} from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
  standalone: true,
  imports: [
    IonMenu, 
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent,
    RouterLink
  ]
})
export class SideMenuComponent {

}
