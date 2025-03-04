import { Component } from '@angular/core';
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
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonButton,
    IonMenuToggle,
    IonIcon,
  ],
})
export class Tab3Page {
  constructor() {}

  async openWebpage() {
    await InAppBrowser.openInSystemBrowser({
      url: 'https://www.google.ca',
      options: DefaultSystemBrowserOptions,
    });
  }
}
