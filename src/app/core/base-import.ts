import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './components/header/header.component';
import { IonContent } from '@ionic/angular/standalone';

export const BaseImport = [
  CommonModule,
  FormsModule,
  HeaderComponent,
  IonContent,
];
