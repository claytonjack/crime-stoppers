import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  bootstrapLightbulbFill,
  bootstrapChevronRight,
  bootstrapBook,
  bootstrapShieldCheck,
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
import { ScreenReaderService } from '@app/core/pages/settings/services/screen-reader.service';
import { TipInfoComponent } from '@app/features/home/components/tip-info/tip-info.component';
import { BaseImport } from '@app/core/base-import';
import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';

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
    TranslatePipe,
  ],
  providers: [
    provideIcons({
      bootstrapLightbulbFill,
      bootstrapChevronRight,
      bootstrapBook,
      bootstrapShieldCheck,
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
      title: 'home.aboutItems.ourStory.title',
      details: 'home.aboutItems.ourStory.details',
      icon: 'bootstrapBook',
    },
    {
      title: 'home.aboutItems.whatWeDo.title',
      details: 'home.aboutItems.whatWeDo.details',
      icon: 'bootstrapShieldCheck',
    },
    {
      title: 'home.aboutItems.communityImpact.title',
      details: 'home.aboutItems.communityImpact.details',
      icon: 'bootstrapEmojiSmile',
    },
  ];

  procedureSteps = [
    {
      title: 'home.procedureSteps.step1.title',
      details: 'home.procedureSteps.step1.details',
      icon: 'bootstrap1Circle',
    },
    {
      title: 'home.procedureSteps.step2.title',
      details: 'home.procedureSteps.step2.details',
      icon: 'bootstrap2Circle',
    },
    {
      title: 'home.procedureSteps.step3.title',
      details: 'home.procedureSteps.step3.details',
      icon: 'bootstrap3Circle',
    },
    {
      title: 'home.procedureSteps.step4.title',
      details: 'home.procedureSteps.step4.details',
      icon: 'bootstrap4Circle',
    },
    {
      title: 'home.procedureSteps.step5.title',
      details: 'home.procedureSteps.step5.details',
      icon: 'bootstrap5Circle',
    },
    {
      title: 'home.procedureSteps.step6.title',
      details: 'home.procedureSteps.step6.details',
      icon: 'bootstrap6Circle',
    },
    {
      title: 'home.procedureSteps.step7.title',
      details: 'home.procedureSteps.step7.details',
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
