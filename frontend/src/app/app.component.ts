import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { SideMenuComponent } from './components/side-menu/side-menu.component';
import { SettingsManagerService } from './services/settings/settings-manager.service';
import { IconsService } from './services/icons.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonApp, IonRouterOutlet, SideMenuComponent],
})
export class AppComponent {
  constructor(
    private settingsManager: SettingsManagerService,
    private iconsService: IconsService
  ) {}

  // No ngOnInit needed anymore - routing guard and privacy service handle everything
}
