import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  ActionSheetController,
  AlertController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  menuOutline,
  informationCircleOutline,
  callOutline,
  globeOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-tab5',
  templateUrl: 'tab5.page.html',
  styleUrls: ['tab5.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonButton,
    IonMenuToggle,
    IonIcon,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Tab5Page {
  isModalOpen = false;

  constructor(
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController
  ) {
    addIcons({
      menuOutline,
      informationCircleOutline,
      callOutline,
      globeOutline,
    });
  }

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  async openTipModal() {
    this.setOpen(true);
  }

  async openTipOptions() {
    this.setOpen(false);

    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Submit a Tip',
      buttons: [
        {
          text: 'Submit Online',
          icon: 'globe-outline',
          handler: () => {
            this.openWebTip();
          },
        },
        {
          text: 'Call Tip Line',
          icon: 'call-outline',
          handler: () => {
            this.showPhoneNumber();
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
    await InAppBrowser.openInSystemBrowser({
      url: 'https://www.p3tips.com/TipForm.aspx?ID=201',
      options: DefaultSystemBrowserOptions,
    });
  }

  async showPhoneNumber() {
    const alert = await this.alertCtrl.create({
      header: 'Tip Phone Number',
      message: '<strong>1-800-222-8477</strong>',
      buttons: ['Close'],
    });

    await alert.present();
  }
}
