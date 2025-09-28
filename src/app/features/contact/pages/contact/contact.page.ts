import { Component } from '@angular/core';
import { BaseImport } from '../../../../core/base-import';
import { IonList, IonLabel, IonItem } from '@ionic/angular/standalone';

@Component({
  selector: 'app-contact',
  standalone: true,
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
  imports: [IonItem, IonLabel, IonList, ...BaseImport],
})
export class ContactPage {}
