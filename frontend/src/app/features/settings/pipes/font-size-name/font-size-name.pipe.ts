import { Pipe, PipeTransform } from '@angular/core';
import { FontSizeOption } from '../../models/settings.model';

@Pipe({
  name: 'fontSizeName',
  standalone: true,
})
export class FontSizeNamePipe implements PipeTransform {
  public transform(value: unknown): string {
    if (!value || typeof value !== 'string') {
      return 'Medium';
    }
    if (value === 'small') {
      return 'Small';
    } else if (value === 'large') {
      return 'Large';
    } else {
      return 'Medium';
    }
  }
}
