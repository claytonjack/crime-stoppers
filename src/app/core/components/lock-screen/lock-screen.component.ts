import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { IonButton, IonIcon, IonSpinner } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { refresh, lockClosed } from 'ionicons/icons';
import { Subject, takeUntil } from 'rxjs';
import { BiometricAuthService } from '../../services/biometric-auth.service';

addIcons({ refresh, lockClosed });

@Component({
  selector: 'app-lock-screen',
  standalone: true,
  imports: [CommonModule, IonSpinner, IonButton, IonIcon],
  templateUrl: './lock-screen.component.html',
  styleUrls: ['./lock-screen.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LockScreenComponent implements OnInit, OnDestroy {
  private readonly biometricAuthService = inject(BiometricAuthService);
  private readonly destroy$ = new Subject<void>();
  private readonly visibilityListener = () => this.onVisibilityChange();

  protected isLocked = false;
  protected isAttempting = false;
  protected lastError: string | null = null;
  protected autoAttempted = false;

  ngOnInit(): void {
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', this.visibilityListener);
    }

    this.biometricAuthService.locked$
      .pipe(takeUntil(this.destroy$))
      .subscribe((locked) => {
        this.isLocked = locked;

        if (!locked) {
          this.isAttempting = false;
          this.lastError = null;
          this.autoAttempted = false;
          return;
        }

        this.maybeAutoAuthenticate();
      });
  }

  ngOnDestroy(): void {
    if (typeof document !== 'undefined') {
      document.removeEventListener(
        'visibilitychange',
        this.visibilityListener
      );
    }

    this.destroy$.next();
    this.destroy$.complete();
  }

  protected async tryAuthenticate(): Promise<void> {
    if (this.isAttempting || !this.isLocked) {
      return;
    }

    this.isAttempting = true;
    this.lastError = null;

    const authenticated = await this.biometricAuthService.authenticate(
      'Unlock Crime Stoppers'
    );

    this.isAttempting = false;

    if (!authenticated && this.isLocked) {
      this.lastError = 'Authentication was cancelled or failed.';
    }
  }

  private maybeAutoAuthenticate(): void {
    if (this.autoAttempted || !this.isLocked) {
      return;
    }

    if (typeof document !== 'undefined' && document.visibilityState === 'hidden') {
      return;
    }

    this.autoAttempted = true;
    void this.tryAuthenticate();
  }

  private onVisibilityChange(): void {
    if (
      typeof document !== 'undefined' &&
      document.visibilityState === 'visible'
    ) {
      this.autoAttempted = false;
      this.maybeAutoAuthenticate();
    }
  }
}
