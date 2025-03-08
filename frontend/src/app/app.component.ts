import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  menu,
  home,
  newspaper,
  map,
  help,
  information,
  call,
  globe,
  eye,
  compass,
  shield,
  megaphone,
  document,
  share,
  checkmark,
  cash,
  card,
  download,
  happy,
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
    this.registerIcons();
  }

  private registerIcons() {
    addIcons({
      menu,
      home,
      newspaper,
      map,
      help,
      information,
      call,
      globe,
      eye,
      compass,
      shield,
      megaphone,
      document,
      share,
      checkmark,
      cash,
      card,
      download,
      happy,
    });
  }
}
