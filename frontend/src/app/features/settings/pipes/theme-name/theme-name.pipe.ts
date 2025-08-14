import { Pipe, PipeTransform } from '@angular/core';
import { ThemeType } from '../../models/settings.model';

@Pipe({
  name: 'themeName',
  standalone: true,
})
export class ThemeNamePipe implements PipeTransform {
  public transform(value: unknown): string {
    if (!value || typeof value !== 'string') {
      return 'System';
    }
    if (value === 'dark') {
      return 'Dark';
    } else if (value === 'light') {
      return 'Light';
    } else {
      return 'System';
    }
  }
}
