import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  menu,
  home,
  newspaper,
  map,
  help,
  informationCircle,
  call,
  globe,
  eye,
  compass,
  shieldCheckmark,
  megaphone,
  documentText,
  share,
  checkmarkDone,
  cash,
  card,
  download,
} from 'ionicons/icons';
import { SideMenuComponent } from './components/side-menu/side-menu.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonApp, IonRouterOutlet, SideMenuComponent],
})
export class AppComponent {
  constructor() {
    addIcons({
      menu,
      home,
      newspaper,
      map,
      help,
      informationCircle,
      call,
      globe,
      eye,
      compass,
      shieldCheckmark,
      megaphone,
      documentText,
      share,
      checkmarkDone,
      cash,
      card,
      download,
    });
  }
}