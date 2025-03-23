import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { SideMenuComponent } from './components/side-menu/side-menu.component';
import { Router } from '@angular/router';
import { SettingsManagerService } from './services/settings/settings-manager.service';
import { IconsService } from './services/icons.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonApp, IonRouterOutlet, SideMenuComponent],
})
export class AppComponent implements OnInit {
  constructor(
    private router: Router,
    private settingsManager: SettingsManagerService,
    private iconsService: IconsService
  ) {}

  ngOnInit() {
    this.settingsManager.settings$.subscribe((settings) => {
      if (
        settings.privacyMode &&
        this.router.url !== '/privacy-mode' &&
        this.router.url !== '/settings'
      ) {
        this.router.navigate(['/privacy-mode']);
      }
    });
  }
}
