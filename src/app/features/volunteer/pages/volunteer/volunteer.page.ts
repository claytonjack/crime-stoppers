import { Component } from '@angular/core';
import {
  IonContent,
  IonButton,
  IonItem,
  IonGrid,
  IonRow,
  IonCol,
  IonLabel,
  IonItemDivider,
  IonText,
} from '@ionic/angular/standalone';
import { HeaderComponent } from 'src/app/core/components/header/header.component';
import {
  InAppBrowser,
  DefaultSystemBrowserOptions,
} from '@capacitor/inappbrowser';

@Component({
  selector: 'app-volunteer',
  templateUrl: 'volunteer.page.html',
  styleUrls: ['volunteer.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    HeaderComponent,
    IonButton,
    IonItem,
    IonGrid,
    IonRow,
    IonCol,
    IonLabel,
    IonItemDivider,
    IonText,
  ],
})
export class VolunteerPage {
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
}
