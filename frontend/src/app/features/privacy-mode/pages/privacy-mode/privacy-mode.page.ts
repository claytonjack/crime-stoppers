import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonDatetime,
  IonCard,
  IonCardContent,
} from '@ionic/angular/standalone';
import { HeaderComponent } from '../../../../core/components/header/header.component';
import { PrivacyModeService } from '../../services/privacy-mode.service';

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
  ],
})
export class PrivacyModePage implements OnInit {
  private readonly privacyModeService = inject(PrivacyModeService);

  selectedDate: string = '';
  privacyModeEnabled = false;

  constructor() {}

  ngOnInit() {
    this.privacyModeEnabled = this.privacyModeService.isEnabled;
  }

  onDateChange(event: any) {
    this.selectedDate = event.detail.value;
  }
}
