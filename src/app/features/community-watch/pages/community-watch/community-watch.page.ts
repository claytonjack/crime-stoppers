import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BaseImport } from '../../../../core/base-import';
import {
  IonItem,
  IonLabel,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonImg,
  IonItemDivider,
} from '@ionic/angular/standalone';
import {
  InAppBrowser,
  DefaultSystemBrowserOptions,
} from '@capacitor/inappbrowser';

@Component({
  selector: 'app-community-watch',
  standalone: true,
  templateUrl: './community-watch.page.html',
  styleUrls: ['./community-watch.page.scss'],
  imports: [
    ...BaseImport,
    IonItem,
    IonLabel,
    IonButton,
    IonGrid,
    IonRow,
    IonCol,
    IonImg,
    IonItemDivider,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CommunityWatchPage {
  heroImage = 'assets/images/community-watch.png';
  partnerSlides = [
    { src: 'assets/images/cw1-lorex.jpg', alt: 'Lorex Security' },
    { src: 'assets/images/cw2-canada_first.jpg', alt: 'Canada First' },
    { src: 'assets/images/cw3-service_master.jpg', alt: 'ServiceMaster' },
    {
      src: 'assets/images/cw4-halton_regional_police.jpg',
      alt: 'Halton Regional Police',
    },
    {
      src: 'assets/images/cw5-halton_police_board.jpg',
      alt: 'Halton Police Board',
    },
  ];

  async openPdf(url: string) {
    try {
      await InAppBrowser.openInSystemBrowser({
        url: url,
        options: DefaultSystemBrowserOptions,
      });
    } catch (error) {
      console.error('Error opening PDF:', error);
    }
  }

  openHomeInspection(): void {
    const pdfPath = 'assets/HomeInspectionReport.pdf';
    window.open(pdfPath, '_blank');
  }
}
