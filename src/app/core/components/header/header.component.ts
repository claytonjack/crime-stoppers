import { Component, Input } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonMenuToggle,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { ScreenReaderService } from '@app/core/pages/settings/services/screen-reader.service';
import { inject } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonMenuToggle,
    NgIcon,
    TranslateModule,
  ],
})
export class HeaderComponent {
  @Input() title: string = '';
  @Input() showMenuButton: boolean = true;

  private readonly screenReader = inject(ScreenReaderService);

  async ngOnInit() {
    // Announce the current page title when the header loads
    if (this.title) {
      await this.screenReader.speak(`${this.title} page loaded`);
    }
  }

  async onMenuButtonClick() {
    // Announce menu button activation
    await this.screenReader.speak('Opening side menu');
  }
}
