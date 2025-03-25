import { Injectable } from '@angular/core';

export type FontSizeOption = 'small' | 'medium' | 'large';

@Injectable({
  providedIn: 'root',
})
export class FontSizeService {
  applyFontSize(size: FontSizeOption): void {
    document.documentElement.setAttribute('data-font-size', size);

    const rootStyle = document.documentElement.style;
    switch (size) {
      case 'small':
        rootStyle.setProperty('font-size', '12px');
        break;
      case 'medium':
        rootStyle.setProperty('font-size', '16px');
        break;
      case 'large':
        rootStyle.setProperty('font-size', '20px');
        break;
    }
  }
}
