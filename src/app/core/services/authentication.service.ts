import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { Preferences } from '@capacitor/preferences';
import {
  BiometricAuth,
  BiometryType,
  BiometryErrorType,
  CheckBiometryResult,
} from '@aparajita/capacitor-biometric-auth';
import { Platform } from '@ionic/angular/standalone';

const AUTH_ENABLED_KEY = 'biometric_auth_enabled';

@Injectable({
  providedIn: 'root',
})
export class BiometricAuthService {
  private readonly platform = inject(Platform);

  private readonly authEnabledSubject = new BehaviorSubject<boolean>(false);
  private readonly authenticatedSubject = new BehaviorSubject<boolean>(false);

  public readonly authEnabled$: Observable<boolean> =
    this.authEnabledSubject.asObservable();
  public readonly authenticated$: Observable<boolean> =
    this.authenticatedSubject.asObservable();
  public readonly locked$: Observable<boolean> = combineLatest([
    this.authEnabledSubject.asObservable(),
    this.authenticatedSubject.asObservable(),
  ]).pipe(
    map(([enabled, authenticated]) => enabled && !authenticated),
    distinctUntilChanged()
  );

  constructor() {
    this.loadAuthEnabled();
  }

  private async loadAuthEnabled(): Promise<void> {
    const { value } = await Preferences.get({ key: AUTH_ENABLED_KEY });
    const enabled = value === 'true';
    this.authEnabledSubject.next(enabled);

    if (enabled) {
      this.authenticatedSubject.next(false);
    } else {
      this.authenticatedSubject.next(true);
    }
  }

  public markAsUnauthenticated(): void {
    if (this.authEnabledSubject.value) {
      this.authenticatedSubject.next(false);
    }
  }

  public async checkBiometryAvailability(): Promise<CheckBiometryResult> {
    try {
      return await BiometricAuth.checkBiometry();
    } catch (error) {
      console.error('Error checking biometry availability:', error);
      return {
        isAvailable: false,
        biometryType: BiometryType.none,
        biometryTypes: [],
        strongBiometryIsAvailable: false,
        deviceIsSecure: false,
        reason: '',
        code: BiometryErrorType.none,
      };
    }
  }

  public async getBiometryTypeName(): Promise<string> {
    const result = await this.checkBiometryAvailability();

    if (!result.isAvailable) {
      return 'None';
    }

    switch (result.biometryType) {
      case BiometryType.fingerprintAuthentication:
        return 'Fingerprint';
      case BiometryType.faceAuthentication:
        return 'Face ID';
      case BiometryType.irisAuthentication:
        return 'Iris';
      default:
        return 'Biometric';
    }
  }

  public async enableAuth(): Promise<boolean> {
    const availability = await this.checkBiometryAvailability();

    if (!availability.isAvailable) {
      throw new Error(
        'Biometric authentication is not available on this device'
      );
    }

    const success = await this.authenticate('Enable biometric authentication');

    if (success) {
      await Preferences.set({ key: AUTH_ENABLED_KEY, value: 'true' });
      this.authEnabledSubject.next(true);
      this.authenticatedSubject.next(true);
      return true;
    }

    return false;
  }

  public async disableAuth(): Promise<void> {
    await Preferences.set({ key: AUTH_ENABLED_KEY, value: 'false' });
    this.authEnabledSubject.next(false);
    this.authenticatedSubject.next(true);
  }

  public async authenticate(reason?: string): Promise<boolean> {
    try {
      const biometryType = await this.getBiometryTypeName();
      const defaultReason = `Authenticate to access Crime Stoppers`;

      await BiometricAuth.authenticate({
        reason: reason || defaultReason,
        cancelTitle: 'Cancel',
        allowDeviceCredential: true,
        iosFallbackTitle: 'Use Passcode',
        androidTitle: 'Authenticate',
        androidSubtitle: biometryType,
        androidConfirmationRequired: false,
      });

      this.authenticatedSubject.next(true);
      return true;
    } catch (error: any) {
      console.error('Authentication failed:', error);

      if (error.code === 10 || error.code === 13) {
        return false;
      }

      this.authenticatedSubject.next(false);
      return false;
    }
  }

  public isAuthenticated(): boolean {
    return this.authenticatedSubject.value;
  }

  public isAuthEnabled(): boolean {
    return this.authEnabledSubject.value;
  }

  public resetAuthentication(): void {
    if (this.authEnabledSubject.value) {
      this.authenticatedSubject.next(false);
    }
  }
}
