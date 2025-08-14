import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  UrlTree,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { PrivacyModeService } from '../services/privacy-mode.service';

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
      this.privacyModeService.isEnabled &&
      route.routeConfig?.path !== 'settings'
    ) {
      return this.router.parseUrl('/privacy-mode');
    }

    return true;
  }
}
