import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { IonButton, IonSpinner } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { BiometricAuthService } from '@app/core/services/authentication.service';
import { Subscription } from 'rxjs';
import { ScreenReaderService } from '../settings/services/screen-reader.service';

@Component({
  selector: 'app-lock-screen',
  standalone: true,
  imports: [CommonModule, IonButton, IonSpinner, TranslateModule],
  templateUrl: './lock-screen.page.html',
  styleUrls: ['./lock-screen.page.scss'],
})
export class LockScreenPage implements OnInit, OnDestroy {
  private readonly biometricAuthService = inject(BiometricAuthService);
  private readonly screenReader = inject(ScreenReaderService);
  private subscription?: Subscription;
  private autoAttemptTimeout: ReturnType<typeof setTimeout> | null = null;

  public isLocked = false;
  public isAttempting = false;
  public lastError: string | null = null;

  ngOnInit(): void {
    this.subscription = this.biometricAuthService.locked$.subscribe(
      async (locked) => {
        this.isLocked = locked;

        if (locked) {
          this.lastError = null;
          await this.screenReader.speak(
            'Device is locked. Please authenticate.'
          );
          if (this.autoAttemptTimeout) {
            clearTimeout(this.autoAttemptTimeout);
          }

          this.autoAttemptTimeout = setTimeout(() => {
            this.autoAttemptTimeout = null;
            void this.tryAuthenticate();
          }, 300);
        } else {
          this.clearAutoAttemptTimeout();
          this.isAttempting = false;
          this.lastError = null;
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.clearAutoAttemptTimeout();
  }

  public async tryAuthenticate(): Promise<void> {
    if (!this.isLocked || this.isAttempting) {
      return;
    }

    this.lastError = null;
    this.isAttempting = true;
    await this.screenReader.speak('Attempting authentication.');

    const success = await this.biometricAuthService.authenticate();

    this.isAttempting = false;

    if (!success) {
      this.lastError = 'core.lockScreen.authFailed';
      await this.screenReader.speak('Authentication failed. Please try again.');
    } else {
      await this.screenReader.speak(
        'Authentication successful. Unlocking device.'
      );
    }
  }

  private clearAutoAttemptTimeout(): void {
    if (this.autoAttemptTimeout) {
      clearTimeout(this.autoAttemptTimeout);
      this.autoAttemptTimeout = null;
    }
  }
}
