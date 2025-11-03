import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { IonButton, IonSpinner } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { BiometricAuthService } from '@app/core/services/authentication.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-lock-screen',
  standalone: true,
  imports: [CommonModule, IonButton, IonSpinner, TranslateModule],
  templateUrl: './lock-screen.page.html',
  styleUrls: ['./lock-screen.page.scss'],
})
export class LockScreenPage implements OnInit, OnDestroy {
  private readonly biometricAuthService = inject(BiometricAuthService);
  private subscription?: Subscription;
  private autoAttemptTimeout: ReturnType<typeof setTimeout> | null = null;

  public isLocked = false;
  public isAttempting = false;
  public lastError: string | null = null;

  ngOnInit(): void {
    this.subscription = this.biometricAuthService.locked$.subscribe(
      (locked) => {
        this.isLocked = locked;

        if (locked) {
          this.lastError = null;

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

    const success = await this.biometricAuthService.authenticate();

    this.isAttempting = false;

    if (!success) {
      this.lastError = 'core.lockScreen.authFailed';
    }
  }

  private clearAutoAttemptTimeout(): void {
    if (this.autoAttemptTimeout) {
      clearTimeout(this.autoAttemptTimeout);
      this.autoAttemptTimeout = null;
    }
  }
}
