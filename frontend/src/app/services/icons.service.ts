import { Injectable } from '@angular/core';
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
  eyeOff,
  settings,
  refresh,
  text,
} from 'ionicons/icons';

@Injectable({
  providedIn: 'root',
})
export class IconsService {
  private initialized = false;

  constructor() {
    this.registerIcons();
  }

  private registerIcons() {
    if (this.initialized) return;

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
      eyeOff,
      settings,
      refresh,
      text,
    });

    this.initialized = true;
  }
}
