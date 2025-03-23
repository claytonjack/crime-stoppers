import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { BehaviorSubject, Observable } from 'rxjs';

export type ThemeType = 'light' | 'dark' | 'system';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly THEME_KEY = 'app_theme';
  private themeSubject = new BehaviorSubject<ThemeType>('system');

  public currentTheme$: Observable<ThemeType> =
    this.themeSubject.asObservable();

  constructor() {
    this.loadSavedTheme();

    const systemThemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    systemThemeQuery.addEventListener('change', () => {
      if (this.themeSubject.value === 'system') {
        this.applyTheme('system');
      }
    });
  }

  async loadSavedTheme(): Promise<void> {
    const { value } = await Preferences.get({ key: this.THEME_KEY });
    const theme = (value as ThemeType) || 'system';

    this.themeSubject.next(theme);
    this.applyTheme(theme);
  }

  async setTheme(theme: ThemeType): Promise<void> {
    await Preferences.set({ key: this.THEME_KEY, value: theme });
    this.themeSubject.next(theme);
    this.applyTheme(theme);
  }

  private applyTheme(theme: ThemeType): void {
    const systemThemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const shouldUseDarkTheme =
      theme === 'dark' || (theme === 'system' && systemThemeQuery.matches);

    if (shouldUseDarkTheme) {
      document.documentElement.classList.add('ion-palette-dark');
    } else {
      document.documentElement.classList.remove('ion-palette-dark');
    }
  }
}
