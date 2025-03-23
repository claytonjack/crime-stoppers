import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./components/settings-menu/settings-menu.component').then(
        (m) => m.SettingsMenuComponent
      ),
  },
  {
    path: 'privacy-mode',
    loadComponent: () =>
      import('./tab-privacy-mode/privacy-mode.component').then(
        (m) => m.PrivacyModeComponent
      ),
  },
];
