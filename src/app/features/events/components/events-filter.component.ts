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
  selector: 'app-events-filter',
  templateUrl: './events-filter.component.html',
  styleUrls: ['./events-filter.component.scss'],
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
export class EventsFilterComponent {
  @Input() selectedEventType = '';
  @Input() onEventTypeChange!: (type: string) => void;
  @Input() clearFilters!: () => void;

  selectedType = '';
  private readonly popoverController = inject(PopoverController);

  ngOnInit() {
    this.selectedType = this.selectedEventType;
  }

  onSelectionChange(event: any) {
    const value = event.detail.value;
    this.selectedType = value;
    this.onEventTypeChange(value);
    this.popoverController.dismiss();
  }

  clearAndClose() {
    this.clearFilters();
    this.popoverController.dismiss();
  }
}
