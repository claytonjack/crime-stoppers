import { Component, inject, OnInit } from '@angular/core';
import { ScreenReaderService } from '@app/core/pages/settings/services/screen-reader.service';
import { BaseImport } from 'src/app/core/base-import';

@Component({
  selector: 'app-crime-map',
  standalone: true,
  templateUrl: './crime-map.page.html',
  styleUrls: ['./crime-map.page.scss'],
  imports: [...BaseImport],
})
export class CrimeMapPage implements OnInit {
    private readonly screenReader = inject(ScreenReaderService);

  async ngOnInit() {
    await this.screenReader.speak('Crime Map page loaded.');
    await this.screenReader.speak(
      'This page shows an interactive map of recent crime incidents. ' +
      'You can use keyboard navigation or screen reader gestures to explore the map.'
    );
  }
}
