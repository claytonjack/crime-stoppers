import { Injectable } from '@angular/core';
import {
  ActionSheetController,
  AlertController,
} from '@ionic/angular/standalone';

export interface ActionSheetButton {
  text: string;
  handler?: () => void;
  role?: 'cancel' | 'destructive';
}

export interface ActionSheetOptions {
  header?: string;
  buttons: ActionSheetButton[];
}

export interface AlertButton {
  text: string;
  role?: 'cancel' | 'destructive';
  handler?: () => void;
}

export interface AlertOptions {
  header?: string;
  message?: string;
  buttons: AlertButton[];
}

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(
    private actionSheetController: ActionSheetController,
    private alertController: AlertController
  ) {}

  async presentActionSheet(options: ActionSheetOptions): Promise<void> {
    const actionSheet = await this.actionSheetController.create({
      header: options.header,
      buttons: options.buttons,
    });
    await actionSheet.present();
  }

  async presentAlert(options: AlertOptions): Promise<void> {
    const alert = await this.alertController.create({
      header: options.header,
      message: options.message,
      buttons: options.buttons,
    });
    await alert.present();
  }
}
