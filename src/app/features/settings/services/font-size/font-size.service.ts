import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, distinctUntilChanged } from 'rxjs';
import { Preferences } from '@capacitor/preferences';
import { FontSizeOption, FONT_SIZE_CONFIGS } from '../../models/settings.model';

@Injectable({
  providedIn: 'root',
})
export class FontSizeService {
  private readonly FONT_SIZE_KEY = 'app_font_size';
  private readonly DEFAULT_FONT_SIZE: FontSizeOption = 'medium';

  private readonly fontSizeSubject = new BehaviorSubject<FontSizeOption>(
    this.DEFAULT_FONT_SIZE
  );
  public readonly fontSize$: Observable<FontSizeOption> = this.fontSizeSubject
    .asObservable()
    .pipe(distinctUntilChanged());

  constructor() {
    this.loadFontSize();
  }

  public get currentFontSize(): FontSizeOption {
    return this.fontSizeSubject.value;
  }

  public setFontSize(fontSize: FontSizeOption): void {
    if (this.fontSizeSubject.value !== fontSize) {
      this.fontSizeSubject.next(fontSize);
      this.applyFontSize(fontSize);
      this.saveFontSize(fontSize);
    }
  }

  public resetToDefault(): void {
    this.setFontSize(this.DEFAULT_FONT_SIZE);
  }

  public getFontSizeConfig(size: FontSizeOption) {
    return FONT_SIZE_CONFIGS[size];
  }

  public getFontSizeFromRangeValue(rangeValue: number): FontSizeOption {
    const config = Object.values(FONT_SIZE_CONFIGS).find(
      (config) => config.rangeValue === rangeValue
    );
    return config?.size || this.DEFAULT_FONT_SIZE;
  }

  public getRangeValueFromFontSize(size: FontSizeOption): number {
    return FONT_SIZE_CONFIGS[size]?.rangeValue || 1;
  }

  private async loadFontSize(): Promise<void> {
    try {
      const { value } = await Preferences.get({ key: this.FONT_SIZE_KEY });
      const fontSize = (value as FontSizeOption) || this.DEFAULT_FONT_SIZE;
      this.fontSizeSubject.next(fontSize);
      this.applyFontSize(fontSize);
    } catch (error) {
      console.error('Failed to load font size:', error);
      this.fontSizeSubject.next(this.DEFAULT_FONT_SIZE);
      this.applyFontSize(this.DEFAULT_FONT_SIZE);
    }
  }

  private async saveFontSize(fontSize: FontSizeOption): Promise<void> {
    try {
      await Preferences.set({
        key: this.FONT_SIZE_KEY,
        value: fontSize,
      });
    } catch (error) {
      console.error('Failed to save font size:', error);
    }
  }

  private applyFontSize(size: FontSizeOption): void {
    const config = FONT_SIZE_CONFIGS[size];
    if (!config) {
      console.warn(`Invalid font size: ${size}`);
      return;
    }

    document.documentElement.setAttribute('data-font-size', size);
    document.documentElement.style.setProperty('font-size', config.cssValue);
  }
}
