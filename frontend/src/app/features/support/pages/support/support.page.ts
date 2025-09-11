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

  constructor(private http: HttpClient) { }

  scrollTo(section: string) {
    const el = document.getElementById(section);
    if (el) {
      const y = el.offsetTop;
      this.content.scrollToPoint(0, y, 600);
    }
  }

  previewForm(file: string) {
    this.http.get<{ previewUrl: string, downloadUrl: string }>(`http://localhost:3000/api/request-download/${file}`)
      .subscribe({
        next: (res) => {
          this.pdfUrl = `http://localhost:3000${res.previewUrl}`;
          this.pdfModal.present();
        },
        error: () => alert('Could not open file preview.')
      });
  }

  downloadFile() {
    if (!this.pdfUrl) return;
    const downloadUrl = this.pdfUrl.replace('/preview/', '/download/');
    window.open(downloadUrl, '_blank');
  }
}