import { Component, inject, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import {
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonItem,
  IonLabel,
  IonItemDivider,
  IonButton
} from '@ionic/angular/standalone';
import { HeaderComponent } from '../../../../core/components/header/header.component';
import { TtsService } from '../../../../core/services/tts.service';

@Component({
  selector: 'app-donate',
  templateUrl: 'donate.page.html',
  styleUrls: ['donate.page.scss'],
  standalone: true,
  imports: [
    IonLabel,
    IonItem,
    IonCol,
    IonRow,
    IonGrid,
    IonContent,
    HeaderComponent,
    IonItemDivider,
    IonButton
  ]
})
export class DonatePage implements AfterViewInit {
  private tts = inject(TtsService);

  @ViewChild('donateContent', { read: ElementRef }) donateContent!: ElementRef<HTMLElement>;

  ngAfterViewInit() {
    // Optional: perform any actions after view init
  }

  /**
   * Read the page content aloud
   */
  async readContent() {
    if (!this.donateContent) return;

    // Get all text from the donate content container
    const text = this.donateContent.nativeElement.innerText;
    if (text) {
      await this.tts.speak(text, {
        lang: 'en-US',
        rate: 1.0,
        pitch: 1.0
      });
    }
  }

  /**
   * Stop reading the content
   */
  async stopReading() {
    await this.tts.stop();
  }
}
