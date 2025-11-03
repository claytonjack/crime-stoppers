import { Component, OnInit, inject } from '@angular/core';
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
import { TranslateModule } from '@ngx-translate/core';
import {
  InAppBrowser,
  DefaultSystemBrowserOptions,
} from '@capacitor/inappbrowser';
import { ScreenReaderService } from '@app/core/pages/settings/services/screen-reader.service';

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
    TranslateModule,
  ],
})
export class VolunteerPage implements OnInit {
  private readonly screenReader = inject(ScreenReaderService);

  async ngOnInit() {
    await this.screenReader.speak('Volunteer page loaded.');
    await this.screenReader.speak(
      'Join Crime Stoppers as a volunteer. Help keep your community safe.'
    );
  }

  async announceSection(sectionName: string) {
    await this.screenReader.speak(`${sectionName} section.`);
  }

  async openPdf(url: string, label: string) {
    try {
      await this.screenReader.speak(`Opening ${label} application PDF.`);
      await InAppBrowser.openInSystemBrowser({
        url: url,
        options: DefaultSystemBrowserOptions,
      });
    } catch (error) {
      console.error('Error opening PDF:', error);
      await this.screenReader.speak('Failed to open PDF. Please try again.');
    }
  }
}
