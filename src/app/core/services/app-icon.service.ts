import { Injectable } from '@angular/core';
import { registerPlugin } from '@capacitor/core';

type AppIconPluginType = {
  setIcon: (opts: { iconName: string }) => Promise<void>;
};

const AppIcon = registerPlugin('AppIcon') as unknown as AppIconPluginType;

@Injectable({ providedIn: 'root' })
export class AppIconService {
  async setIcon(iconName: string): Promise<void> {
    try {
      if (!AppIcon || !AppIcon.setIcon) {
        console.warn('AppIcon plugin not available on this platform');
        return;
      }
      await AppIcon.setIcon({ iconName });
    } catch (err) {
      console.error('AppIcon.setIcon error', err);
      throw err;
    }
  }
}
