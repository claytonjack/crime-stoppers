import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'privacyModeName',
  standalone: true,
})
export class PrivacyModeNamePipe implements PipeTransform {
  public transform(value: unknown): string {
    if (value === true) {
      return 'Enabled';
    } else {
      return 'Disabled';
    }
  }
}
