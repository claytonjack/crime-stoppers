## Initial info

- Trust these instructions. This document gives you everything you need to work efficiently in this repo without costly exploration.
- Prefer Ionic components and theming for UI; avoid raw HTML unless necessary.
- Do not run CI, tests, or local dev browsers in your responses. Provide guidance and code changes; leave execution to the developer.

## About the Crime Stoppers app

- Crime Stoppers of Halton is a non-profit organization that allows the public to submit anonymous tips about crimes to the police, with the possibility of a cash reward for information that leads to an arrest. The app also provides additional features like the ability to view information about recent crimes, upcoming events, most wanted, etc.

## Tech stack

- Node.js: Node 22.x.
- Package manager: npm (lockfiles present).
- Frontend: Angular 20, Ionic 8, Capacitor 7.
- CMS: Strapi 5.19

## Project layout and where to make changes

- Root
  - `package.json` — Angular/Ionic scripts: `start`, `build`, `test`, `lint`.
  - `package-lock.json` — lockfile for the project; avoid unnecessary churn.
  - `angular.json` — Angular build/test configurations; `www/` as output.
  - `eslint.config.mjs` — ESLint flat config.
  - `karma.conf.js` — Jasmine/Karma setup; CI config available via `angular.json`.
  - `cypress/` — E2E specs and support files; `cypress.config.ts` is minimal.
  - `src/` — application source; entry `src/main.ts`, global styles, routes in `src/app/app.routes.ts`, services under `src/app/core/services/*`.
  - Folders: `cms/`.

## Frontend structure and conventions (Angular + Ionic)

- High-level organization under `src/app` follows a core/feature split:
  - `core/` — cross-cutting concerns used app-wide. Typical directories:
    - `services/` — single-responsibility injectable services (API clients, platform utilities, storage, analytics). Use `providedIn: 'root'` and `inject()`.
    - `guards/` — Angular router and HTTP infrastructure as needed.
  - `features/` — user-facing areas grouped by domain (e.g., `alerts/`, `suspects/`, `settings/`). Each feature should encapsulate:
    - UI components (standalone), feature-specific services, and local state.
  - `app.routes.ts` — single source of truth for all application routes. Define top-level routes here and lazy-load features using `loadChildren` or `loadComponent`.
- Other top-level `src/` folders:
  - `assets/` — static assets.
  - `theme/` — Ionic/SCSS theme variables and global theming.
  - `environments/` — environment files (Angular standard).
  - `global.scss` — global styles; prefer Ionic variables and utilities over custom CSS when possible.

## Angular + TypeScript implementation guidelines

Use these conventions when adding or modifying frontend code to keep the app maintainable, performant, and accessible.

- TypeScript

  - Use strict type checking.
  - Prefer type inference when the type is obvious.

- Angular

  - Always use standalone components over NgModules.
  - Use RxJS for state management.
  - Implement lazy loading for feature routes.
  - Do not use `@HostBinding` / `@HostListener`; put host bindings in the `host` object of `@Component`/`@Directive` instead.
  - Use `NgOptimizedImage` for static images (does not support inline base64 images).

- Components

  - Keep components small and single-responsibility.
  - Prefer inline templates for small components.
  - Prefer Reactive Forms over Template-driven forms.
  - Do not use `ngClass`/`ngStyle`; use `[class.*]` and `[style.*]` bindings.

- Ionic UI usage

  - Prefer Ionic components whenever possible for UI (e.g., `ion-button`, `ion-list`, `ion-card`, `ion-modal`) instead of raw HTML equivalents; this ensures platform consistency, accessibility, and theming.
  - Use Ionic layout primitives (`ion-grid`, `ion-row`, `ion-col`) and utilities where they fit. Keep custom CSS minimal and leverage Ionic theme variables.
  - Use `IonRouterLink` for in-app navigation in templates; continue to use Angular Router APIs for programmatic navigation and route configuration.

- Templates

  - Keep templates simple and avoid complex logic.
  - Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`.
  - Use the `async` pipe to handle Observables.

- Services
  - Design services around a single responsibility.
  - Use `providedIn: 'root'` for singletons.
  - Use the `inject()` function instead of constructor injection.
