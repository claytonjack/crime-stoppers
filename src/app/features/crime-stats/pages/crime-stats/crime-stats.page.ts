import { Component } from '@angular/core';
import { BaseImport } from 'src/app/core/base-import';

@Component({
  selector: 'app-crime-stats',
  standalone: true,
  templateUrl: './crime-stats.page.html',
  styleUrls: ['./crime-stats.page.scss'],
  imports: [...BaseImport],
})
export class CrimeStatsPage {}
