import { Component, inject, OnInit } from '@angular/core';
import {
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonItem,
  IonLabel,
  IonItemDivider,
} from '@ionic/angular/standalone';
import { HeaderComponent } from 'src/app/core/components/header/header.component';
import { TranslateModule } from '@ngx-translate/core';
import { ScreenReaderService } from '@app/core/pages/settings/services/screen-reader.service';

@Component({
  selector: 'app-dontate',
  templateUrl: 'donate.page.html',
  styleUrls: ['donate.page.scss'],
  standalone: true,
  imports: [
    IonLabel,
    IonItem,
    IonCol,
    IonRow,
    IonGrid,
    IonContent,
    HeaderComponent,
    IonItemDivider,
    TranslateModule,
  ],
})
export class DonatePage implements OnInit {
  private readonly screenReader = inject(ScreenReaderService);

  async ngOnInit() {
    await this.screenReader.speak(
      'Donate page loaded. Why Donate section displayed.'
    );
  }
}
