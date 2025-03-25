import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  UrlTree,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { PrivacyModeService } from '../services/settings/privacy-mode.service';

@Injectable({
  providedIn: 'root',
})
export class PrivacyModeGuard implements CanActivate {
  constructor(
    private privacyModeService: PrivacyModeService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    if (
      route.routeConfig?.path === 'settings' ||
      route.routeConfig?.path === 'privacy-mode'
    ) {
      return true;
    }

    if (this.privacyModeService.isEnabled) {
      return this.router.parseUrl('/privacy-mode');
    }

    return true;
  }
}
