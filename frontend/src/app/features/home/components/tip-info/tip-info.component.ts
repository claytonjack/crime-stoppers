import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonModal,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-tip-info',
  templateUrl: './tip-info.component.html',
  styleUrls: ['./tip-info.component.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonButton,
    IonModal,
  ],
})
export class TipInfoComponent {
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
