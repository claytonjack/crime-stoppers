import { Component, inject } from '@angular/core';
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
import { ScreenReaderService } from '@app/core/services/screen-reader.service';

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
  private readonly screenReader = inject(ScreenReaderService);
  
  async openPdf(url: string, label: string) {
    try {
      await InAppBrowser.openInSystemBrowser({
        url: url,
        options: DefaultSystemBrowserOptions,
      });
      await this.screenReader.speak(`${label} application PDF opened`);
    } catch (error) {
      console.error('Error opening PDF:', error);
      await this.screenReader.speak(`Failed to open ${label} application PDF`);
    }
  }

  async announceSection(title: string) {
    await this.screenReader.speak(title);
  }
}
