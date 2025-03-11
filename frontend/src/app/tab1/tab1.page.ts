import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  InAppBrowser,
  DefaultSystemBrowserOptions,
} from '@capacitor/inappbrowser';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonMenuToggle,
  IonIcon,
  IonSegment,
  IonSegmentButton,
  IonImg,
  ActionSheetController,
} from '@ionic/angular/standalone';
import { TipInfoComponent } from '@components/tip-info/tip-info.component';
import { AboutUsComponent } from '@components/about-us/about-us.component';
import { TipProcedureComponent } from '@components/tip-procedure/tip-procedure.component';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonButton,
    IonMenuToggle,
    IonIcon,
    IonSegment,
    IonSegmentButton,
    IonImg,
    TipInfoComponent,
    AboutUsComponent,
    TipProcedureComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Tab1Page {
  isModalOpen = false;
  selectedSegment: string = 'about-us';

  constructor(private actionSheetCtrl: ActionSheetController) {}

  openTipModal() {
    this.isModalOpen = true;
  }

  closeTipModal() {
    this.isModalOpen = false;
  }

  async openTipOptions() {
    this.isModalOpen = false;

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
      // TODO: Add user feedback
    }
  }
}
