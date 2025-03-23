import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { BehaviorSubject, Observable } from 'rxjs';

export type FontSizeOption = 'small' | 'medium' | 'large';

@Injectable({
  providedIn: 'root',
})
export class FontSizeService {
  private readonly FONT_SIZE_KEY = 'app_font_size';
  private fontSizeSubject = new BehaviorSubject<FontSizeOption>('medium');

  public currentFontSize$: Observable<FontSizeOption> =
    this.fontSizeSubject.asObservable();

  constructor() {
    this.loadSavedFontSize();
  }

  async loadSavedFontSize(): Promise<void> {
    const { value } = await Preferences.get({ key: this.FONT_SIZE_KEY });
    const fontSize = (value as FontSizeOption) || 'medium';
    this.fontSizeSubject.next(fontSize);
    this.applyFontSize(fontSize);
  }

  async setFontSize(size: FontSizeOption): Promise<void> {
    await Preferences.set({ key: this.FONT_SIZE_KEY, value: size });
    this.fontSizeSubject.next(size);
    this.applyFontSize(size);
  }

  private applyFontSize(size: FontSizeOption): void {
    document.documentElement.setAttribute('data-font-size', size);

    const rootStyle = document.documentElement.style;
    switch (size) {
      case 'small':
        rootStyle.setProperty('font-size', '14px');
        break;
      case 'medium':
        rootStyle.setProperty('font-size', '18px');
        break;
      case 'large':
        rootStyle.setProperty('font-size', '22px');
        break;
    }
  }
}
