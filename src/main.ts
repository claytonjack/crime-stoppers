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
  bootstrapArrowClockwise,

  // Home Icons
  bootstrapBook,
  bootstrapShield,
  bootstrapEmojiSmile,
  bootstrapLightbulbFill,
  bootstrapInfoCircleFill,

  // Common UI Icons
  bootstrapInfoCircle,
  bootstrapExclamationTriangle,
  bootstrapCheckCircle,
  bootstrapXCircle,
  bootstrapDownload,
  bootstrapShare,
  bootstrapSearch,
  bootstrapFilter,
  bootstrapThreeDotsVertical,
  bootstrapGeoAlt,
  bootstrapPersonFill,
  bootstrapCashStack,
  bootstrapCreditCard,
  bootstrapShieldCheck,
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
import { IonicModule } from '@ionic/angular';
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
      bootstrapArrowClockwise,

      // Home Icons
      bootstrapBook,
      bootstrapShield,
      bootstrapEmojiSmile,
      bootstrapLightbulbFill,
      bootstrapInfoCircleFill,

      // Common UI Icons
      bootstrapInfoCircle,
      bootstrapExclamationTriangle,
      bootstrapCheckCircle,
      bootstrapXCircle,
      bootstrapDownload,
      bootstrapShare,
      bootstrapSearch,
      bootstrapFilter,
      bootstrapThreeDotsVertical,
      bootstrapGeoAlt,
      bootstrapPersonFill,
      bootstrapCashStack,
      bootstrapCreditCard,
      bootstrapShieldCheck,
      bootstrapGlobe,
      bootstrapTelephone,
      bootstrapEyeSlash,
      bootstrapSun,
      bootstrapMoon,
      bootstrapCircleFill,
    }),
  ],
}).catch((err) => console.error(err));
