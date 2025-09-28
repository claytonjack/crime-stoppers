import { Component, Input, inject } from '@angular/core';
import { PopoverController } from '@ionic/angular/standalone';
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
export class AlertsFilterComponent {
  @Input() selectedSource = '';
  @Input() availableSources: string[] = [];
  @Input() onSourceChange!: (source: string) => void;
  @Input() clearFilters!: () => void;

  selectedSourceLocal = '';
  private readonly popoverController = inject(PopoverController);

  ngOnInit() {
    this.selectedSourceLocal = this.selectedSource;
  }

  onSelectionChange(event: any) {
    const value = event.detail.value;
    this.selectedSourceLocal = value;
    this.onSourceChange(value);
    this.popoverController.dismiss();
  }

  clearAndClose() {
    this.clearFilters();
    this.popoverController.dismiss();
  }
}
