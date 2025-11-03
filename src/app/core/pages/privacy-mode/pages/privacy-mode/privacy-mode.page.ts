import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonDatetime,
  IonCard,
  IonCardContent,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { HeaderComponent } from 'src/app/core/components/header/header.component';
import { PrivacyModeService } from 'src/app/core/pages/privacy-mode/services/privacy-mode.service';
import { ScreenReaderService } from '@app/core/pages/settings/services/screen-reader.service';

@Component({
  selector: 'app-privacy-mode',
  templateUrl: './privacy-mode.page.html',
  styleUrls: ['./privacy-mode.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonDatetime,
    IonCard,
    IonCardContent,
    HeaderComponent,
    TranslateModule,
  ],
})
export class PrivacyModePage implements OnInit {
  private readonly privacyModeService = inject(PrivacyModeService);
  private readonly screenReader = inject(ScreenReaderService);

  selectedDate: string = '';
  privacyModeEnabled = false;

  constructor() {}

  ngOnInit() {
    this.privacyModeEnabled = this.privacyModeService.isEnabled;
    this.screenReader.speak('Calendar page loaded');
  }

  async onDateChange(event: any) {
    this.selectedDate = event.detail.value;

    if (this.selectedDate) {
      const formattedDate = formatDate(this.selectedDate, 'fullDate', 'en-US');
      await this.screenReader.speak(`You selected ${formattedDate}`);
      await this.screenReader.speak('No events scheduled for this day');
    }
  }
}
