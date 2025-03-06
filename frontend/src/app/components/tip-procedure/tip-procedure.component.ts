import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import {
  IonAccordionGroup,
  IonAccordion,
  IonItem,
  IonLabel,
  IonIcon,
  IonCard,
} from '@ionic/angular/standalone';
import {
  documentTextOutline,
  shareOutline,
  checkmarkDoneOutline,
  cashOutline,
  informationCircleOutline,
  cardOutline,
  downloadOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-tip-procedure',
  templateUrl: './tip-procedure.component.html',
  styleUrls: ['./tip-procedure.component.scss'],
  standalone: true,
  imports: [
    IonCard,
    CommonModule,
    IonAccordionGroup,
    IonAccordion,
    IonItem,
    IonLabel,
    IonIcon,
  ],
})
export class TipProcedureComponent {
  steps = [
    {
      title: 'Submit Your Tip',
      details:
        'Submit your tip anonymously and we will issue you a code number that you can use to inquire about the status of your tip.',
      icon: 'document-text-outline',
    },
    {
      title: 'Sharing Your Tip',
      details:
        'The valuable information you provide anonymously is shared with law enforcement.',
      icon: 'share-outline',
    },
    {
      title: 'The Investigation',
      details:
        'Once the investigation is complete, Crime Stoppers of Halton is advised of the case results.',
      icon: 'checkmark-done-outline',
    },
    {
      title: 'Reward Amount',
      details:
        'The usefulness of your tip will be reviewed by Crime Stoppers of Halton to determine the amount of your cash reward.',
      icon: 'cash-outline',
    },
    {
      title: 'Tip Inquiry',
      details:
        'Use your tip number to inquire by phone or online about the status of your tip and possible cash reward up to $2000.',
      icon: 'information-circle-outline',
    },
    {
      title: 'Reward Arranged',
      details:
        'Crime Stoppers of Halton will authorize the bank (or other public outlet) to prepare your cash reward identifiable by your tip number.',
      icon: 'card-outline',
    },
    {
      title: 'Cash Pick-up',
      details:
        'A tip inquiry will tell you the amount of your cash award & where you can pick it up by providing your tip number only – no ID needed.',
      icon: 'download-outline',
    },
  ];

  constructor() {
    addIcons({
      documentTextOutline,
      shareOutline,
      checkmarkDoneOutline,
      cashOutline,
      informationCircleOutline,
      cardOutline,
      downloadOutline,
    });
  }
}
