import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
} from '@angular/core';
import { BaseImport } from 'src/app/core/base-import';
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
import { ScreenReaderService } from '@app/core/pages/settings/services/screen-reader.service';

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
export class CommunityWatchPage implements OnInit {
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

  private readonly screenReader = inject(ScreenReaderService);

  async ngOnInit() {
    // Announce page load
    await this.screenReader.speak('Community Watch page loaded.');

    // Announce hero content
    await this.screenReader.speak(
      "Join your neighbours in Oakville's Ward 3 for the Community Watch pilot, a partnership with Crime Stoppers of Halton, Halton Regional Police, and the Halton Police Board."
    );
  }

  async openPdf(url: string) {
    try {
      await InAppBrowser.openInSystemBrowser({
        url: url,
        options: DefaultSystemBrowserOptions,
      });
      await this.screenReader.speak(
        'Opened Community Watch inspection report.'
      );
    } catch (error) {
      console.error('Error opening PDF:', error);
      await this.screenReader.speak('Failed to open PDF.');
    }
  }

  async openHomeInspection(): Promise<void> {
    const pdfPath = 'assets/HomeInspectionReport.pdf';
    window.open(pdfPath, '_blank');
    await this.screenReader.speak(
      'Opened Home Inspection report in a new window.'
    );
  }
}
