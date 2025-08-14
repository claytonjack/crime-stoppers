import { Component } from '@angular/core';
import { BaseImport } from '../../../../core/base-import';

@Component({
  selector: 'app-community-watch',
  standalone: true,
  templateUrl: './community-watch.page.html',
  styleUrls: ['./community-watch.page.scss'],
  imports: [...BaseImport],
})
export class CommunityWatchPage {}
