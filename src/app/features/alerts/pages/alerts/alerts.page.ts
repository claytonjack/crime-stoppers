import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BaseImport } from '../../../../core/base-import';
import { StrapiService, Alert } from '../../../../core/services/strapi.service';
import {
  LoadingController,
  AlertController,
  IonRefresher,
  IonCardContent,
  IonSkeletonText,
  IonCard,
  IonChip,
  IonIcon,
  IonLabel,
  IonButton,
  IonRefresherContent,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-alerts',
  standalone: true,
  templateUrl: './alerts.page.html',
  styleUrls: ['./alerts.page.scss'],
  imports: [
    IonRefresherContent,
    IonButton,
    IonLabel,
    IonIcon,
    IonChip,
    IonCard,
    IonSkeletonText,
    IonCardContent,
    IonRefresher,
    ...BaseImport,
  ],
})
export class AlertsPage implements OnInit {
  private readonly strapiService = inject(StrapiService);
  private readonly router = inject(Router);
  private readonly loadingController = inject(LoadingController);
  private readonly alertController = inject(AlertController);

  alerts: Alert[] = [];
  isLoading = false;

  ngOnInit() {
    this.loadAlerts();
  }

  async loadAlerts() {
    const loading = await this.loadingController.create({
      message: 'Loading alerts...',
    });
    await loading.present();

    this.isLoading = true;

    this.strapiService.getAlerts().subscribe({
      next: (response) => {
        this.alerts = response.data;
        this.isLoading = false;
        loading.dismiss();
      },
      error: async (error) => {
        console.error('Error loading alerts:', error);
        this.isLoading = false;
        loading.dismiss();

        const alert = await this.alertController.create({
          header: 'Error',
          message: 'Failed to load alerts. Please try again later.',
          buttons: ['OK'],
        });
        await alert.present();
      },
    });
  }

  viewAlertDetails(alert: Alert) {
    this.router.navigate(['/alert-details', alert.documentId]);
  }

  getImageUrl(alert: Alert): string {
    if (alert.Main_Image?.url) {
      return this.strapiService.getImageUrl(alert.Main_Image.url);
    }
    return 'assets/images/placeholder-alert.png';
  }

  onImageError(event: ErrorEvent) {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.src = 'assets/images/placeholder-alert.png';
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  getSourceColor(source: string): string {
    switch (source) {
      case 'Crime Stoppers':
        return 'primary';
      case 'Halton Police':
        return 'secondary';
      default:
        return 'medium';
    }
  }

  async doRefresh(event: CustomEvent) {
    this.strapiService.getAlerts().subscribe({
      next: (response) => {
        this.alerts = response.data;
        event.detail.complete();
      },
      error: (error) => {
        console.error('Error refreshing alerts:', error);
        event.detail.complete();
      },
    });
  }
}
