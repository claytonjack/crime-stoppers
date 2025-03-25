import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class PrivacyModeService {
  private _privacyModeEnabled = false;
  private _lastRoute = '/tabs/tab1';

  constructor(private router: Router) {}

  get isEnabled(): boolean {
    return this._privacyModeEnabled;
  }

  updatePrivacyMode(enabled: boolean): void {
    if (
      !this._privacyModeEnabled &&
      enabled &&
      this.router.url !== '/privacy-mode' &&
      this.router.url !== '/settings'
    ) {
      this._lastRoute = this.router.url;
    }

    this._privacyModeEnabled = enabled;

    if (enabled) {
      document.body.classList.add('privacy-mode');
      if (
        this.router.url !== '/privacy-mode' &&
        this.router.url !== '/settings'
      ) {
        this.router.navigate(['/privacy-mode']);
      }
    } else {
      document.body.classList.remove('privacy-mode');
      if (this.router.url === '/privacy-mode') {
        window.location.href = this._lastRoute;
      }
    }
  }

  togglePrivacyMode(): boolean {
    const newState = !this._privacyModeEnabled;
    this.updatePrivacyMode(newState);
    return newState;
  }
}
