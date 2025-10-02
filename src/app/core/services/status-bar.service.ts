import { Injectable } from '@angular/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Platform } from '@ionic/angular';

@Injectable({ providedIn: 'root' })
export class StatusBarService {
  constructor(private platform: Platform) {}

  async init() {
    await this.platform.ready();
    try {
      await StatusBar.setOverlaysWebView({ overlay: false });
      await StatusBar.setStyle({ style: Style.Dark });
      await StatusBar.setBackgroundColor({ color: '#ffffff' });
    } catch (err) {
      console.warn('StatusBar plugin not available:', err);
    }
  }
}
