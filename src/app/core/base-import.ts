import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { HeaderComponent } from './components/header/header.component';

export const BaseImport = [
  CommonModule,
  FormsModule,
  TranslateModule,
  HeaderComponent,
  IonContent,
];

export { HeaderComponent };
