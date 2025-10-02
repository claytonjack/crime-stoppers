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
  selector: 'suspects-filter',
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
export class SuspectsFilterComponent {
  @Input() selectedScene = '';
  @Input() scenes: string[] = [];
  @Input() onSceneChange!: (scene: string) => void;
  @Input() clearFilters!: () => void;

  selectedSceneLocal = '';
  private readonly popoverController = inject(PopoverController);

  ngOnInit() {
    this.selectedSceneLocal = this.selectedScene;
  }

  onSelectionChange(event: any) {
    const value = event.detail.value;
    this.selectedSceneLocal = value;
    this.onSceneChange(value);
    this.popoverController.dismiss();
  }

  clearAndClose() {
    this.clearFilters();
    this.popoverController.dismiss();
  }
}
