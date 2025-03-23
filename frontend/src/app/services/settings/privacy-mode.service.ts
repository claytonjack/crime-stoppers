import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PrivacyModeService {
  private readonly PRIVACY_MODE_KEY = 'app_privacy_mode';
  private privacyModeSubject = new BehaviorSubject<boolean>(false);

  public privacyMode$: Observable<boolean> =
    this.privacyModeSubject.asObservable();

  constructor() {
    this.loadSavedPrivacyMode();
  }

  async loadSavedPrivacyMode(): Promise<void> {
    const { value } = await Preferences.get({ key: this.PRIVACY_MODE_KEY });
    const isPrivacyMode = value === 'true';
    this.privacyModeSubject.next(value ? isPrivacyMode : false);
  }

  async setPrivacyMode(enabled: boolean): Promise<void> {
    await Preferences.set({
      key: this.PRIVACY_MODE_KEY,
      value: enabled.toString(),
    });
    this.privacyModeSubject.next(enabled);
  }
}
