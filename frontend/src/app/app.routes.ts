import { Routes } from '@angular/router';
import { PrivacyModeGuard } from './features/privacy-mode/guards/privacy-mode.guard';
import { TabMenuComponent } from './core/components/tab-menu/tab-menu.component';

/**
 * Application Routes Configuration
 * All routes are defined in this single file for centralized management.
 */
export const routes: Routes = [
  // ===========================================
  // Public Routes (Outside Main Layout)
  // ===========================================
  {
    path: 'privacy-mode',
    loadComponent: () =>
      import(
        './features/privacy-mode/pages/privacy-mode/privacy-mode.page'
      ).then((m) => m.PrivacyModePage),
  },

  // ===========================================
  // Main Application Layout (Tab-based Navigation)
  // ===========================================
  {
    path: '',
    canActivate: [PrivacyModeGuard],
    component: TabMenuComponent,
    children: [
      // ==============
      // Tab Navigation
      // ==============
      {
        path: 'home',
        loadComponent: () =>
          import('./features/home/pages/home/home.page').then(
            (m) => m.HomePage
          ),
      },
      {
        path: 'alerts',
        loadComponent: () =>
          import('./features/alerts/pages/alerts/alerts.page').then(
            (m) => m.AlertsPage
          ),
      },
      {
        path: 'crime-map',
        loadComponent: () =>
          import('./features/crime-map/pages/crime-map/crime-map.page').then(
            (m) => m.CrimeMapPage
          ),
      },
      {
        path: 'support',
        loadComponent: () =>
          import('./features/support/pages/support/support.page').then(
            (m) => m.SupportPage
          ),
      },

      // ===============
      // Detail Pages
      // ===============
      {
        path: 'alert-details/:documentId',
        loadComponent: () =>
          import(
            './features/alerts/pages/alert-details/alert-details.page'
          ).then((m) => m.AlertDetailsPage),
      },
      {
        path: 'event-details/:documentId',
        loadComponent: () =>
          import(
            './features/events/pages/event-details/event-details.page'
          ).then((m) => m.EventDetailsPage),
      },
      {
        path: 'suspect-details/:documentId',
        loadComponent: () =>
          import(
            './features/suspects/pages/suspect-details/suspect-details.page'
          ).then((m) => m.SuspectDetailsPage),
      },

      // ===============
      // Side Menu Pages
      // ===============
      {
        path: 'events',
        loadComponent: () =>
          import('./features/events/pages/events/events.page').then(
            (m) => m.EventsPage
          ),
      },
      {
        path: 'suspects',
        loadComponent: () =>
          import('./features/suspects/pages/suspects/suspects.page').then(
            (m) => m.SuspectsPage
          ),
      },
      {
        path: 'crime-stats',
        loadComponent: () =>
          import(
            './features/crime-stats/pages/crime-stats/crime-stats.page'
          ).then((m) => m.CrimeStatsPage),
      },
      {
        path: 'community-watch',
        loadComponent: () =>
          import(
            './features/community-watch/pages/community-watch/community-watch.page'
          ).then((m) => m.CommunityWatchPage),
      },
      {
        path: 'contact',
        loadComponent: () =>
          import('./features/contact/pages/contact/contact.page').then(
            (m) => m.ContactPage
          ),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./features/settings/pages/settings/settings.page').then(
            (m) => m.SettingsPage
          ),
      },

      // ===============
      // Default Route
      // ===============
      {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full',
      },
    ],
  },

  // ===========================================
  // Fallback Route
  // ===========================================
  {
    path: '**',
    redirectTo: '/home',
  },
];
