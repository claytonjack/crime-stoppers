import { Component } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { HeaderComponent } from '../../../../core/components/header/header.component';

@Component({
  selector: 'app-support',
  templateUrl: 'support.page.html',
  styleUrls: ['support.page.scss'],
  imports: [IonContent, HeaderComponent],
})
export class SupportPage {
  constructor() {}
}
