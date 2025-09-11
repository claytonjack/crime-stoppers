import { Component, ViewChild } from '@angular/core';
import { IonContent, IonButton, IonItem, IonLabel, IonListHeader, IonList, IonCardContent, IonCardHeader, IonCardTitle, IonCard, IonText, IonCardSubtitle, IonIcon, IonModal, IonHeader, IonToolbar, IonTitle, IonButtons } from '@ionic/angular/standalone';
import { HeaderComponent } from '../../../../core/components/header/header.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgIf } from '@angular/common';
import { SafeUrlPipe } from '../../../../core/services/safe-url-pipe'
@Component({
  selector: 'app-support',
  templateUrl: 'support.page.html',
  styleUrls: ['support.page.scss'],
  standalone: true,
  imports: [
    IonContent, HeaderComponent, IonButton, IonItem, IonLabel,
    IonListHeader, IonList, IonCardContent, IonCardHeader,
    IonCardTitle, IonCard, IonText, IonCardSubtitle, IonIcon,
    HttpClientModule, NgIf, SafeUrlPipe,
    IonModal, IonHeader, IonToolbar, IonTitle, IonButtons,

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

  previewForm(file: string) {
    // Local PDF path inside assets/files
    this.pdfUrl = `assets/files/${file}`;
    this.pdfModal.present();
  }

  downloadFile() {
    if (!this.pdfUrl) return;
    // Directly open the local PDF for download
    window.open(this.pdfUrl, '_blank');
  }
}