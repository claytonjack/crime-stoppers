import { Component, OnInit, inject } from '@angular/core';
import { BaseImport } from 'src/app/core/base-import';
import { IonList, IonLabel, IonItem } from '@ionic/angular/standalone';
import { ScreenReaderService } from '@app/core/pages/settings/services/screen-reader.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
  imports: [IonItem, IonLabel, IonList, ...BaseImport],
})
export class ContactPage implements OnInit {
  private readonly screenReader = inject(ScreenReaderService);

  async ngOnInit() {
    await this.screenReader.speak('Contact Us page loaded.');
    await this.screenReader.speak(
      'Find contact information for Crime Stoppers of Halton staff and board members.'
    );
  }
}
