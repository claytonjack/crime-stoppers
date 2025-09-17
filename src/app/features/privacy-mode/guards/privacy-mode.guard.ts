import { Injectable, inject } from '@angular/core';
import {
  CanActivate,
  Router,
  UrlTree,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { PrivacyModeService } from '../services/privacy-mode.service';

@Injectable({
  providedIn: 'root',
})
export class PrivacyModeGuard implements CanActivate {
  private readonly privacyModeService = inject(PrivacyModeService);
  private readonly router = inject(Router);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    if (this.privacyModeService.isEnabled) {
      if (state.url.includes('/settings')) {
        return true;
      }

      return this.router.parseUrl('/privacy-mode');
    }

    return true;
  }
}
