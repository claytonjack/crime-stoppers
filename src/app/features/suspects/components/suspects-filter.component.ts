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
import { ScreenReaderService } from '@app/core/pages/settings/services/screen-reader.service';

@Component({
  selector: 'app-suspects-filter',
  templateUrl: './suspects-filter.component.html',
  styleUrls: ['./suspects-filter.component.scss'],
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
export class SuspectsFilterComponent implements OnInit {
  @Input() selectedScene = '';
  @Input() scenes: string[] = [];
  @Input() onSceneChange!: (scene: string) => void;
  @Input() clearFilters!: () => void;

  selectedSceneLocal = '';
  private readonly popoverController = inject(PopoverController);
  private readonly screenReader = inject(ScreenReaderService);

  ngOnInit() {
    this.selectedSceneLocal = this.selectedScene;
  }

  async onSelectionChange(event: any) {
    const value = event.detail.value;
    this.selectedSceneLocal = value;
    this.onSceneChange(value);
    const announcement = value ? `Location selected: ${value}` : 'All Locations selected';
    await this.screenReader.speak(announcement);
    this.popoverController.dismiss();
    await this.screenReader.speak('Filter popover closed');
  }

  async clearAndClose() {
    this.clearFilters();
    await this.screenReader.speak('Filters cleared');
    await this.popoverController.dismiss();
    await this.screenReader.speak('Filter popover closed');
  }
}
