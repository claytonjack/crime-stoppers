import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  bootstrapLightbulbFill,
  bootstrapChevronRight,
  bootstrapBook,
  bootstrapShield,
  bootstrapEmojiSmile,
  bootstrap1Circle,
  bootstrap2Circle,
  bootstrap3Circle,
  bootstrap4Circle,
  bootstrap5Circle,
  bootstrap6Circle,
  bootstrap7Circle,
} from '@ng-icons/bootstrap-icons';

import {
  IonButton,
  IonSegment,
  IonSegmentButton,
  IonImg,
  IonAccordionGroup,
  IonAccordion,
  IonItem,
  IonLabel,
  ActionSheetController,
} from '@ionic/angular/standalone';

import {
  InAppBrowser,
  DefaultSystemBrowserOptions,
} from '@capacitor/inappbrowser';
import { ScreenReaderService } from '@app/core/services/screen-reader.service';
import { TipInfoComponent } from '@app/features/home/components/tip-info/tip-info.component';
import { BaseImport } from '../../../../core/base-import';

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
    IonAccordionGroup,
    IonAccordion,
    IonItem,
    IonLabel,
    TipInfoComponent,
    NgIcon,
  ],
  providers: [
    provideIcons({
      bootstrapLightbulbFill,
      bootstrapChevronRight,
      bootstrapBook,
      bootstrapShield,
      bootstrapEmojiSmile,
      bootstrap1Circle,
      bootstrap2Circle,
      bootstrap3Circle,
      bootstrap4Circle,
      bootstrap5Circle,
      bootstrap6Circle,
      bootstrap7Circle,
    }),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomePage {
  isModalOpen = false;
  selectedSegment: string = 'about-us';

  slides = [
    { src: 'assets/images/csh-1.jpg', alt: 'Crime Stoppers Logo' },
    {
      src: 'assets/images/csh-2.jpg',
      alt: 'Crime Stoppers Awareness Campaign',
    },
    { src: 'assets/images/csh-3.jpg', alt: 'Crime Stoppers Police Event' },
    {
      src: 'assets/images/csh-4.jpg',
      alt: 'Crime Stoppers Awareness Campaign',
    },
  ];

  aboutItems = [
    {
      title: 'Our Story',
      details:
        'Crime Stoppers of Halton is a non-profit organization with 35+ years of service, working as part of a global network of 1,800 crime prevention programs.',
      icon: 'bootstrapBook',
    },
    {
      title: 'What We Do',
      details:
        'We enable anonymous crime reporting with rewards up to $2,000 for successful tips, connecting citizens with police while guaranteeing complete anonymity.',
      icon: 'bootstrapShield',
    },
    {
      title: 'Community Impact',
      details:
        'Together, we create a safer Halton Region through community-powered crime prevention that protects tipsters while helping solve crimes.',
      icon: 'bootstrapEmojiSmile',
    },
  ];

  procedureSteps = [
    {
      title: 'Submit Your Tip',
      details:
        'Submit your tip anonymously and we will issue you a code number that you can use to inquire about the status of your tip.',
      icon: 'bootstrap1Circle',
    },
    {
      title: 'Sharing Your Tip',
      details:
        'The valuable information you provide anonymously is shared with law enforcement.',
      icon: 'bootstrap2Circle',
    },
    {
      title: 'The Investigation',
      details:
        'Once the investigation is complete, Crime Stoppers of Halton is advised of the case results.',
      icon: 'bootstrap3Circle',
    },
    {
      title: 'Reward Amount',
      details:
        'The usefulness of your tip will be reviewed by Crime Stoppers of Halton to determine the amount of your cash reward.',
      icon: 'bootstrap4Circle',
    },
    {
      title: 'Tip Inquiry',
      details:
        'Use your tip number to inquire by phone or online about the status of your tip and possible cash reward up to $2000.',
      icon: 'bootstrap5Circle',
    },
    {
      title: 'Reward Arranged',
      details:
        'Crime Stoppers of Halton will authorize the bank (or other public outlet) to prepare your cash reward identifiable by your tip number.',
      icon: 'bootstrap6Circle',
    },
    {
      title: 'Cash Pick-up',
      details:
        'A tip inquiry will tell you the amount of your cash award & where you can pick it up by providing your tip number only – no ID needed.',
      icon: 'bootstrap7Circle',
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
