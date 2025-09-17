import { Component } from '@angular/core';
import { BaseImport } from '../../../../core/base-import';

@Component({
  selector: 'app-contact',
  standalone: true,
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
  imports: [...BaseImport],
})
export class ContactPage {}
