import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import {
  RouteReuseStrategy,
  provideRouter,
  withPreloading,
  PreloadAllModules,
} from '@angular/router';
import {
  IonicRouteStrategy,
  provideIonicAngular,
} from '@ionic/angular/standalone';
import { provideHttpClient } from '@angular/common/http';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { provideIcons } from '@ng-icons/core';

import { ThemeService } from 'src/app/core/pages/settings/services/theme.service';
import { FontSizeService } from 'src/app/core/pages/settings/services/font-size.service';
import { PrivacyModeService } from 'src/app/core/pages/privacy-mode/services/privacy-mode.service';
import { NotificationsService } from '@app/core/pages/settings/services/notifications.service';
import { StatusBarService } from 'src/app/core/services/status-bar.service';
import { BiometricAuthService } from '@app/core/services/authentication.service';

import {
  // Navigation Icons
  bootstrapList,
  bootstrapChevronRight,
  bootstrapChevronLeft,
  bootstrapArrowLeft,
  bootstrapX,

  // Tab Menu Icons
  bootstrapHouseFill,
  bootstrapMegaphoneFill,
  bootstrapCalendarFill,
  bootstrapMapFill,
  bootstrapHeartFill,
  bootstrapBarChartFill,

  // Side Menu Icons
  bootstrapPersonBoundingBox,
  bootstrapEye,
  bootstrapCash,
  bootstrapPeople,
  bootstrapEnvelope,
  bootstrapGear,

  // Settings Icons
  bootstrapPalette,
  bootstrapType,
  bootstrapPhone,
  bootstrapTranslate,
  bootstrapSoundwave,
  bootstrapIncognito,
  bootstrapFingerprint,
  bootstrapBell,
  bootstrapArrowClockwise,

  // Home Icons
  bootstrapBook,
  bootstrapShieldCheck,
  bootstrapEmojiSmile,
  bootstrapLightbulbFill,
  bootstrapInfoCircleFill,

  // Alert and Event Icons
  bootstrapFunnel,
  bootstrapCalendarEvent,
  bootstrapGeoAlt,
  bootstrapPlusCircle,

  // Suspect Icons
  bootstrapExclamationTriangle,
  bootstrapPinAngle,
  bootstrapHouseDoor,
  bootstrapCake2,
  bootstrapArrowsExpand,
  bootstrapArrowsExpandVertical,

  // Common UI Icons
  bootstrapInfoCircle,
  bootstrapDownload,
  bootstrapShare,
  bootstrapSearch,
  bootstrapFilter,
  bootstrapThreeDotsVertical,
  bootstrapPersonFill,
  bootstrapGlobe,
  bootstrapTelephone,
  bootstrapEyeSlash,
  bootstrapSun,
  bootstrapMoon,
  bootstrapCircleFill,
} from '@ng-icons/bootstrap-icons';

import { routes } from 'src/app/app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(),

    provideZoneChangeDetection({ eventCoalescing: true }),
    provideTranslateService({
      loader: provideTranslateHttpLoader({
        prefix: '/assets/i18n/',
        suffix: '.json',
      }),
      defaultLanguage: 'en',
    }),

    ThemeService,
    FontSizeService,
    PrivacyModeService,
    NotificationsService,
    StatusBarService,
    BiometricAuthService,

    provideIcons({
      // Navigation Icons
      bootstrapList,
      bootstrapChevronRight,
      bootstrapChevronLeft,
      bootstrapArrowLeft,
      bootstrapX,

      // Tab Menu Icons
      bootstrapHouseFill,
      bootstrapMegaphoneFill,
      bootstrapCalendarFill,
      bootstrapMapFill,
      bootstrapHeartFill,
      bootstrapBarChartFill,

      // Side Menu Icons
      bootstrapPersonBoundingBox,
      bootstrapEye,
      bootstrapCash,
      bootstrapPeople,
      bootstrapEnvelope,
      bootstrapGear,

      // Settings Icons
      bootstrapPalette,
      bootstrapType,
      bootstrapPhone,
      bootstrapTranslate,
      bootstrapSoundwave,
      bootstrapIncognito,
      bootstrapFingerprint,
      bootstrapBell,
      bootstrapArrowClockwise,

      // Home Icons
      bootstrapBook,
      bootstrapShieldCheck,
      bootstrapEmojiSmile,
      bootstrapLightbulbFill,
      bootstrapInfoCircleFill,

      // Alert and Event Icons
      bootstrapFunnel,
      bootstrapCalendarEvent,
      bootstrapGeoAlt,
      bootstrapPlusCircle,

      // Suspect Icons
      bootstrapExclamationTriangle,
      bootstrapPinAngle,
      bootstrapHouseDoor,
      bootstrapCake2,
      bootstrapArrowsExpand,
      bootstrapArrowsExpandVertical,

      // Common UI Icons
      bootstrapInfoCircle,
      bootstrapDownload,
      bootstrapShare,
      bootstrapSearch,
      bootstrapFilter,
      bootstrapThreeDotsVertical,
      bootstrapPersonFill,
      bootstrapGlobe,
      bootstrapTelephone,
      bootstrapEyeSlash,
      bootstrapSun,
      bootstrapMoon,
      bootstrapCircleFill,
    }),
  ],
};
