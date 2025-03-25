import { Injectable } from '@angular/core';

export type ThemeType = 'light' | 'dark' | 'system';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  constructor() {
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', () => {
        const currentTheme =
          document.documentElement.getAttribute('data-theme');
        if (currentTheme === 'system') {
          this.applyTheme('system');
        }
      });
  }

  applyTheme(theme: ThemeType): void {
    const systemThemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const shouldUseDarkTheme =
      theme === 'dark' || (theme === 'system' && systemThemeQuery.matches);

    document.documentElement.setAttribute('data-theme', theme);

    if (shouldUseDarkTheme) {
      document.documentElement.classList.add('ion-palette-dark');
    } else {
      document.documentElement.classList.remove('ion-palette-dark');
    }
  }
}
