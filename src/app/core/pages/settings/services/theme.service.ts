import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, distinctUntilChanged } from 'rxjs';
import { Preferences } from '@capacitor/preferences';
import { ThemeType } from 'src/app/core/pages/settings/models/settings.model';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly THEME_KEY = 'app_theme';
  private readonly DEFAULT_THEME: ThemeType = 'system';

  private readonly themeSubject = new BehaviorSubject<ThemeType>(
    this.DEFAULT_THEME
  );
  public readonly theme$: Observable<ThemeType> = this.themeSubject
    .asObservable()
    .pipe(distinctUntilChanged());

  private mediaQuery: MediaQueryList;

  constructor() {
    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    this.mediaQuery.addEventListener(
      'change',
      this.handleSystemThemeChange.bind(this)
    );
    this.loadTheme();
  }

  public get currentTheme(): ThemeType {
    return this.themeSubject.value;
  }

  public setTheme(theme: ThemeType): void {
    if (this.themeSubject.value !== theme) {
      this.themeSubject.next(theme);
      this.applyTheme(theme);
      this.saveTheme(theme);
    }
  }

  public resetToDefault(): void {
    this.setTheme(this.DEFAULT_THEME);
  }

  private async loadTheme(): Promise<void> {
    try {
      const { value } = await Preferences.get({ key: this.THEME_KEY });
      const theme = (value as ThemeType) || this.DEFAULT_THEME;
      this.themeSubject.next(theme);
      this.applyTheme(theme);
    } catch (error) {
      console.error('Failed to load theme:', error);
      this.themeSubject.next(this.DEFAULT_THEME);
      this.applyTheme(this.DEFAULT_THEME);
    }
  }

  private async saveTheme(theme: ThemeType): Promise<void> {
    try {
      await Preferences.set({
        key: this.THEME_KEY,
        value: theme,
      });
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  }

  private handleSystemThemeChange(): void {
    const currentTheme = this.themeSubject.value;
    if (currentTheme === 'system') {
      this.applyTheme('system');
    }
  }

  private applyTheme(theme: ThemeType): void {
    const shouldUseDarkTheme = this.shouldUseDarkTheme(theme);

    document.documentElement.setAttribute('data-theme', theme);

    if (shouldUseDarkTheme) {
      document.documentElement.classList.add('ion-palette-dark');
    } else {
      document.documentElement.classList.remove('ion-palette-dark');
    }

    document.documentElement.style.setProperty('--theme-applied', theme);

    console.log(`Theme applied: ${theme}, Dark mode: ${shouldUseDarkTheme}`);
  }

  private shouldUseDarkTheme(theme: ThemeType): boolean {
    return theme === 'dark' || (theme === 'system' && this.mediaQuery.matches);
  }
}
