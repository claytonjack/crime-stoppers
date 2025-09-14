import { Component, ViewChild } from '@angular/core';
import { IonContent, IonModal, IonCardSubtitle, IonCardContent, IonCard, IonCardHeader, IonCardTitle, IonButton, IonButtons, IonToolbar, IonHeader, IonTitle, IonText, IonItem, IonList } from '@ionic/angular/standalone';
import { HeaderComponent } from '../../../../core/components/header/header.component';
import { NgIf } from '@angular/common';
import { SafeUrlPipe } from '../../../../core/services/safe-url-pipe';
import { SecureStorage } from '@aparajita/capacitor-secure-storage';
import { Capacitor } from '@capacitor/core';
import { IonIcon } from '@ionic/angular';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { FileOpener } from '@capacitor-community/file-opener';
import { Browser } from '@capacitor/browser';

// pdf.js
import * as pdfjsLib from 'pdfjs-dist';

// Set workerSrc to a CDN
(pdfjsLib as any).GlobalWorkerOptions.workerSrc =
  `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${(pdfjsLib as any).version}/pdf.worker.min.js`;

@Component({
  selector: 'app-support',
  templateUrl: 'support.page.html',
  styleUrls: ['support.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    HeaderComponent,
    NgIf,
    SafeUrlPipe,
    IonModal,
    IonCardSubtitle,
    IonCardContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonButton,
    IonButtons,
    IonToolbar,
    IonHeader,
    IonTitle,
    IonText,
    IonItem,
    IonList
  ],
})

export class SupportPage {

  pdfModalOpen = false;
  pdfPages: number[] = [];
  private pdfData: Uint8Array | null = null;
 @ViewChild(IonContent, { static: false }) content!: IonContent;

  // Scroll to section
  scrollTo(section: string) {
    const el = document.getElementById(section);
    if (el && this.content) {
      const y = el.offsetTop;
      this.content.scrollToPoint(0, y, 500); // 500ms animation
    }
  }

    // Open PDF in in-app browser
  async openPdf(url: string) {
  const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
  await Browser.open({ url: viewerUrl });
}

}
