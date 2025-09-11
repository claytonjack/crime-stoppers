import { Component, ViewChild } from '@angular/core';
import { IonContent, IonModal, IonCardSubtitle, IonCardContent, IonCard, IonCardHeader, IonCardTitle, IonButton, IonButtons, IonToolbar, IonHeader, IonTitle, IonText, IonItem, IonList } from '@ionic/angular/standalone';
import { HeaderComponent } from '../../../../core/components/header/header.component';
import { NgIf } from '@angular/common';
import { SafeUrlPipe } from '../../../../core/services/safe-url-pipe';
import { SecureStorage } from '@aparajita/capacitor-secure-storage';
import { Capacitor } from '@capacitor/core';
import { IonIcon } from "../../../../../../../node_modules/@ionic/angular/standalone/directives/icon";

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
    IonIcon,
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
  @ViewChild(IonContent, { static: false }) content!: IonContent;
  @ViewChild('pdfModal', { static: false }) pdfModal!: IonModal;

  pdfUrl: string | null = null;

  scrollTo(section: string) {
    const el = document.getElementById(section);
    if (el) {
      const y = el.offsetTop;
      this.content.scrollToPoint(0, y, 600);
    }
  }

  async previewForm(filename: string) {
    try {
      // SecureStorage 
      const stored = await SecureStorage.get(filename);
      let base64: string | null = null;

      if (stored) {
        base64 = String(stored);
      } else {
        // fetch from assets and save
        const response = await fetch(`/assets/files/${filename}`);
        const blob = await response.blob();

        base64 = await this.blobToBase64(blob);

        await SecureStorage.set(filename, base64);
      }


      if (!base64) throw new Error('No PDF data found');

      // Convert base64 → Blob → URL
      const blob = this.base64ToBlob(base64);
      this.pdfUrl = URL.createObjectURL(blob);

      await this.pdfModal.present();
    } catch (err) {
      console.error(err);
      alert('Could not open PDF.');
    }
  }

  async downloadFile() {
    if (!this.pdfUrl) return;
    window.open(this.pdfUrl, '_blank');
  }

  private base64ToBlob(base64: string): Blob {
    const byteString = atob(base64.split(',')[1] || base64);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
    return new Blob([ab], { type: 'application/pdf' });
  }

  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
}
