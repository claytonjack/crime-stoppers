import { Component } from '@angular/core';
import { BaseImport } from 'src/app/core/base-import';

@Component({
  selector: 'app-crime-map',
  standalone: true,
  templateUrl: './crime-map.page.html',
  styleUrls: ['./crime-map.page.scss'],
  imports: [...BaseImport],
})
export class CrimeMapPage {}
