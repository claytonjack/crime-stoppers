import { Injectable } from '@angular/core';
import { ScreenReader } from '@capacitor/screen-reader';
import { Capacitor } from '@capacitor/core';

@Injectable({ providedIn: 'root' })
export class ScreenReaderService {
  private userPrefersSpeech = true;

  private isAvailable(): boolean {
    return (
      Capacitor.isNativePlatform() &&
      Capacitor.isPluginAvailable('ScreenReader')
    );
  }

  async isScreenReaderEnabled(): Promise<boolean> {
    if (!this.isAvailable()) {
      return false;
    }
    try {
      const { value } = await ScreenReader.isEnabled();
      return value;
    } catch {
      return false;
    }
  }

  async speak(text: string): Promise<void> {
    if (!this.userPrefersSpeech || !this.isAvailable()) {
      return;
    }
    try {
      const isEnabled = await this.isScreenReaderEnabled();
      if (isEnabled) {
        await ScreenReader.speak({ value: text });
      }
    } catch {}
  }

  setUserSpeechPreference(enabled: boolean) {
    this.userPrefersSpeech = enabled;
  }
}
