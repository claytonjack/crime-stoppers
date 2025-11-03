import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { BiometricAuthService } from '../services/biometric-auth.service';

export const BiometricAuthGuard: CanActivateFn = async (route, state) => {
  const authService = inject(BiometricAuthService);

  // If auth is not enabled, allow access
  if (!authService.isAuthEnabled()) {
    return true;
  }

  if (!authService.isAuthenticated()) {
    authService.markAsUnauthenticated();
  }

  return true;
};
