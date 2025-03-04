import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonIcon,
  IonModal,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  informationCircleOutline,
  callOutline,
  globeOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-tip-modal',
  templateUrl: './tip-modal.component.html',
  styleUrls: ['./tip-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonButton,
    IonModal,
  ],
})
export class TipModalComponent {
  @ViewChild(IonModal) modal!: IonModal;
  @Input()
  set isOpen(value: boolean) {
    if (value && this.modal) {
      this.modal.present();
    } else if (!value && this.modal) {
      this.modal.dismiss();
    }
    this._isOpen = value;
  }
  get isOpen(): boolean {
    return this._isOpen;
  }

  private _isOpen = false;

  @Output() closeModal = new EventEmitter<void>();
  @Output() submitTip = new EventEmitter<void>();

  constructor() {
    addIcons({
      informationCircleOutline,
      callOutline,
      globeOutline,
    });
  }

  close() {
    this.closeModal.emit();
  }

  continueTip() {
    this.submitTip.emit();
  }

  onWillDismiss() {
    this.closeModal.emit();
  }
}
