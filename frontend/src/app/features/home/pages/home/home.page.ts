import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  InAppBrowser,
  DefaultSystemBrowserOptions,
} from '@capacitor/inappbrowser';
import {
  IonButton,
  IonSegment,
  IonSegmentButton,
  IonImg,
  ActionSheetController,
} from '@ionic/angular/standalone';

import { BaseImport } from '../../../../core/base-import';
import { TipInfoComponent } from '@app/features/home/components/tip-info/tip-info.component';
import { AboutUsComponent } from '@app/features/home/components/about-us/about-us.component';
import { TipProcedureComponent } from '@app/features/home/components/tip-procedure/tip-procedure.component';

import { ScreenReaderService } from '@app/core/services/screen-reader.service';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    ...BaseImport,
    IonButton,
    IonSegment,
    IonSegmentButton,
    IonImg,
    TipInfoComponent,
    AboutUsComponent,
    TipProcedureComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomePage {
  isModalOpen = false;
  selectedSegment: string = 'about-us';

  slides = [
    { src: 'assets/images/csh-logo-square.jpg', alt: 'Crime Stoppers Logo' },
    {
      src: 'assets/images/csh-1.jpg',
      alt: 'Crime Stoppers Awareness Campaign',
    },
    { src: 'assets/images/csh-2.jpg', alt: 'Crime Stoppers Police Event' },
    {
      src: 'assets/images/csh-3.jpg',
      alt: 'Crime Stoppers Awareness Campaign',
    },
  ];

  constructor(
    private actionSheetCtrl: ActionSheetController,
    private screenReader: ScreenReaderService
  ) {}

  openTipModal() {
    this.isModalOpen = true;
    this.screenReader.speak('Tip form opened');
  }

  closeTipModal() {
    this.isModalOpen = false;
  }

  async openTipOptions() {
    this.isModalOpen = false;

    await this.screenReader.speak('Choose how to submit your tip');

    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Submit a Tip',
      buttons: [
        {
          text: 'Submit Online',
          icon: 'globe',
          handler: () => {
            this.openWebTip();
          },
        },
        {
          text: 'Call Tip Line',
          icon: 'call',
          handler: () => {
            window.open('tel:18002228477', '_system');
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
        },
      ],
    });

    await actionSheet.present();
  }

  async openWebTip() {
    try {
      await InAppBrowser.openInSystemBrowser({
        url: 'https://www.p3tips.com/TipForm.aspx?ID=201',
        options: DefaultSystemBrowserOptions,
      });
    } catch (error) {
      console.error('Error opening browser:', error);
    }
  }

  onSegmentChanged() {
    const message =
      this.selectedSegment === 'about-us'
        ? 'About Us section selected'
        : 'Tip Procedure section selected';

    this.screenReader.speak(message);
  }
}
