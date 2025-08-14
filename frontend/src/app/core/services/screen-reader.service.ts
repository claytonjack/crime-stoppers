import { Injectable } from '@angular/core';
import { ScreenReader } from '@capacitor/screen-reader';

@Injectable({ providedIn: 'root' })
export class ScreenReaderService {
  private userPrefersSpeech = true; // can be tied to a setting later

  async isScreenReaderEnabled(): Promise<boolean> {
    const { value } = await ScreenReader.isEnabled();
    return value;
  }

  async speak(text: string): Promise<void> {
    const isEnabled = await this.isScreenReaderEnabled();
    if (isEnabled && this.userPrefersSpeech) {
      await ScreenReader.speak({ value: text });
    }
  }

  setUserSpeechPreference(enabled: boolean) {
    this.userPrefersSpeech = enabled;
  }
}
