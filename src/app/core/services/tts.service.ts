import { Injectable } from '@angular/core';
import { TextToSpeech } from '@capacitor-community/text-to-speech';

@Injectable({
  providedIn: 'root'
})
export class TtsService {
  private isSpeaking = false;

  async speak(text: string, options?: { lang?: string; rate?: number; pitch?: number }) {
    if (!text) return;

    try {
      this.isSpeaking = true;
      await TextToSpeech.speak({
        text,
        lang: options?.lang || 'en-US',
        rate: options?.rate ?? 1.0,
        pitch: options?.pitch ?? 1.0
      });
      this.isSpeaking = false;
    } catch (err) {
      console.error('TTS Speak Error:', err);
      this.isSpeaking = false;
    }
  }

  async stop() {
    // Only works on Android; iOS may not support stop
    try {
      if (this.isSpeaking) {
        await TextToSpeech.stop?.();
        this.isSpeaking = false;
      }
    } catch (err) {
      console.error('TTS Stop Error:', err);
    }
  }
}
