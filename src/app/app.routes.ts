import { Routes } from '@angular/router';
import { PrivacyModeGuard } from './features/privacy-mode/guards/privacy-mode.guard';
import { TabMenuComponent } from './core/components/tab-menu/tab-menu.component';

export const routes: Routes = [
  // Privacy Mode Route
  {
    path: 'privacy-mode',
    loadComponent: () =>
      import(
        './features/privacy-mode/pages/privacy-mode/privacy-mode.page'
      ).then((m) => m.PrivacyModePage),
  },

  // Main Application Routes
  {
    path: '',
    canActivate: [PrivacyModeGuard],
    component: TabMenuComponent,
    children: [
      // Tab Pages
      {
        path: 'home',
        loadComponent: () =>
          import('./features/home/pages/home/home.page').then(
            (m) => m.HomePage
          ),
      },
      {
        path: 'alerts',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./features/alerts/pages/alerts/alerts.page').then(
                (m) => m.AlertsPage
              ),
          },
          {
            path: 'details/:documentId',
            loadComponent: () =>
              import(
                './features/alerts/pages/alert-details/alert-details.page'
              ).then((m) => m.AlertDetailsPage),
          },
        ],
      },
      {
        path: 'crime-map',
        loadComponent: () =>
          import('./features/crime-map/pages/crime-map/crime-map.page').then(
            (m) => m.CrimeMapPage
          ),
      },
      {
        path: 'crime-stats',
        loadComponent: () =>
          import(
            './features/crime-stats/pages/crime-stats/crime-stats.page'
          ).then((m) => m.CrimeStatsPage),
      },

      // Detail Pages now nested under tabs

      // Side Menu Pages
      {
        path: 'events',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./features/events/pages/events/events.page').then(
                (m) => m.EventsPage
              ),
          },
          {
            path: 'details/:documentId',
            loadComponent: () =>
              import(
                './features/events/pages/event-details/event-details.page'
              ).then((m) => m.EventDetailsPage),
          },
        ],
      },
      {
        path: 'suspects',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./features/suspects/pages/suspects/suspects.page').then(
                (m) => m.SuspectsPage
              ),
          },
          {
            path: 'details/:documentId',
            loadComponent: () =>
              import(
                './features/suspects/pages/suspect-details/suspect-details.page'
              ).then((m) => m.SuspectDetailsPage),
          },
        ],
      },
      {
        path: 'volunteer',
        loadComponent: () =>
          import('./features/volunteer/pages/volunteer/volunteer.page').then(
            (m) => m.VolunteerPage
          ),
      },
      {
        path: 'donate',
        loadComponent: () =>
          import('./features/donate/pages/donate/donate.page').then(
            (m) => m.DonatePage
          ),
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

      // Default Route
      {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full',
      },
    ],
  },

  // Fallback Route
  {
    path: '**',
    redirectTo: '/home',
  },
];
