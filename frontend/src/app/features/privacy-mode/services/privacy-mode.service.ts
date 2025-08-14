import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, distinctUntilChanged } from 'rxjs';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root',
})
export class PrivacyModeService {
  private readonly PRIVACY_MODE_KEY = 'app_privacy_mode';
  private readonly DEFAULT_PRIVACY_MODE = false;

  private readonly privacyModeSubject = new BehaviorSubject<boolean>(
    this.DEFAULT_PRIVACY_MODE
  );
  public readonly privacyMode$: Observable<boolean> = this.privacyModeSubject
    .asObservable()
    .pipe(distinctUntilChanged());

  private _lastRoute = '/home';

  constructor(private router: Router) {
    this.loadPrivacyMode();
  }

  get isEnabled(): boolean {
    return this.privacyModeSubject.value;
  }

  public get currentPrivacyMode(): boolean {
    return this.privacyModeSubject.value;
  }

  public setPrivacyMode(enabled: boolean): void {
    if (this.privacyModeSubject.value !== enabled) {
      this.privacyModeSubject.next(enabled);
      this.updatePrivacyMode(enabled);
      this.savePrivacyMode(enabled);
    }
  }

  public resetToDefault(): void {
    this.setPrivacyMode(this.DEFAULT_PRIVACY_MODE);
  }

  updatePrivacyMode(enabled: boolean): void {
    if (
      !this.privacyModeSubject.value &&
      enabled &&
      this.router.url !== '/privacy-mode' &&
      this.router.url !== '/settings'
    ) {
      this._lastRoute = this.router.url;
    }

    if (enabled) {
      document.body.classList.add('privacy-mode');
      if (this.router.url !== '/privacy-mode') {
        this.router.navigate(['/privacy-mode']);
      }
    } else {
      document.body.classList.remove('privacy-mode');
      if (this.router.url === '/privacy-mode') {
        this.router.navigate([this._lastRoute]);
      }
    }
  }

  togglePrivacyMode(): boolean {
    const newState = !this.privacyModeSubject.value;
    this.setPrivacyMode(newState);
    return newState;
  }

  getLastRoute(): string {
    return this._lastRoute;
  }

  private async loadPrivacyMode(): Promise<void> {
    try {
      const { value } = await Preferences.get({ key: this.PRIVACY_MODE_KEY });
      const privacyMode = value === 'true' || this.DEFAULT_PRIVACY_MODE;
      this.privacyModeSubject.next(privacyMode);
      this.updatePrivacyMode(privacyMode);
    } catch (error) {
      console.error('Failed to load privacy mode:', error);
      this.privacyModeSubject.next(this.DEFAULT_PRIVACY_MODE);
      this.updatePrivacyMode(this.DEFAULT_PRIVACY_MODE);
    }
  }

  private async savePrivacyMode(enabled: boolean): Promise<void> {
    try {
      await Preferences.set({
        key: this.PRIVACY_MODE_KEY,
        value: enabled.toString(),
      });
    } catch (error) {
      console.error('Failed to save privacy mode:', error);
    }
  }
}
