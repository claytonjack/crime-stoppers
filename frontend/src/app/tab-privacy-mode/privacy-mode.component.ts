import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonDatetime,
  IonCard,
  IonCardContent,
} from '@ionic/angular/standalone';
import { HeaderComponent } from '../components/header/header.component';

@Component({
  selector: 'app-privacy-mode',
  templateUrl: './privacy-mode.component.html',
  styleUrls: ['./privacy-mode.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonDatetime,
    HeaderComponent,
    IonCard,
    IonCardContent,
  ],
})
export class PrivacyModeComponent {
  selectedDate: string = '';

  constructor() {
    this.selectedDate = '';
  }

  onDateChange(event: any) {
    this.selectedDate = event.detail.value;
  }
}
