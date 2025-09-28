import { bootstrapApplication } from '@angular/platform-browser';
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
import { provideIcons } from '@ng-icons/core';
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

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { register } from 'swiper/element/bundle';

register();

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(),
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
}).catch((err) => console.error(err));
