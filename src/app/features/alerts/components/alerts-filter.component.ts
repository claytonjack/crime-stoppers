import { Component, Input, inject, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular/standalone';
import { ScreenReaderService } from '@app/core/pages/settings/services/screen-reader.service';

import {
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonRadioGroup,
  IonRadio,
  IonButton,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alerts-filter',
  templateUrl: './alerts-filter.component.html',
  styleUrls: ['./alerts-filter.component.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonRadioGroup,
    IonRadio,
    IonButton,
    IonHeader,
    IonTitle,
    IonToolbar,
    FormsModule,
    CommonModule,
  ],
})
export class AlertsFilterComponent implements OnInit {
  @Input() selectedSource = '';
  @Input() availableSources: string[] = [];
  @Input() onSourceChange!: (source: string) => void;
  @Input() clearFilters!: () => void;

  selectedSourceLocal = '';
  private readonly popoverController = inject(PopoverController);
  private readonly screenReader = inject(ScreenReaderService);

  async ngOnInit() {
    this.selectedSourceLocal = this.selectedSource;
    await this.screenReader.speak('Alert filter options loaded');
  }

  async onSelectionChange(event: any) {
    const value = event.detail.value;
    this.selectedSourceLocal = value;
    this.onSourceChange(value);
    await this.screenReader.speak(value ? `Source set to ${value}` : 'All sources selected');
    this.popoverController.dismiss();
  }

  async clearAndClose() {
    this.clearFilters();
    await this.screenReader.speak('Filters cleared');
    this.popoverController.dismiss();
  }
}
