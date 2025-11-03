import { Component, Input, inject, OnInit } from '@angular/core';
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
import { TranslateModule } from '@ngx-translate/core';
import { ScreenReaderService } from 'src/app/core/pages/settings/services/screen-reader.service';

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
    TranslateModule,
  ],
})
export class EventsFilterComponent implements OnInit {
  @Input() selectedEventType = '';
  @Input() onEventTypeChange!: (type: string) => void;
  @Input() clearFilters!: () => void;

  selectedType = '';
  private readonly popoverController = inject(PopoverController);
  private readonly screenReader = inject(ScreenReaderService);

  async ngOnInit() {
    this.selectedType = this.selectedEventType;
    await this.screenReader.speak('Event filter options loaded');
  }

  async onSelectionChange(event: any) {
    const value = event.detail.value;
    this.selectedType = value;
    this.onEventTypeChange(value);
    await this.screenReader.speak(
      value === 'upcoming'
        ? 'Upcoming Events selected'
        : value === 'past'
        ? 'Past Events selected'
        : 'All Events selected'
    );
    this.popoverController.dismiss();
  }

  async clearAndClose() {
    this.clearFilters();
    await this.screenReader.speak('Filters cleared');
    this.popoverController.dismiss();
  }
}
