import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseImport } from '../../../../core/base-import';
import { StrapiService, Alert } from '../../../../core/services/strapi.service';
import {
  LoadingController,
  AlertController,
  IonIcon,
  IonCard,
  IonSkeletonText,
  IonCardContent,
  IonChip,
  IonLabel,
  IonCardHeader,
  IonCardTitle,
  IonButton,
} from '@ionic/angular/standalone';

@Component({
  standalone: true,
  selector: 'app-alert-details',
  imports: [
    IonButton,
    IonCardTitle,
    IonCardHeader,
    IonLabel,
    IonChip,
    IonCardContent,
    IonSkeletonText,
    IonCard,
    IonIcon,
    ...BaseImport,
  ],
  templateUrl: './alert-details.page.html',
  styleUrls: ['./alert-details.page.scss'],
})
export class AlertDetailsPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly strapiService = inject(StrapiService);
  private readonly loadingController = inject(LoadingController);
  private readonly alertController = inject(AlertController);

  alert: Alert | null = null;
  isLoading = false;
  documentId: string = '';

  ngOnInit() {
    this.documentId = this.route.snapshot.paramMap.get('documentId') || '';
    if (this.documentId) {
      this.loadAlertDetails();
    } else {
      this.showErrorAndGoBack('Invalid alert ID');
    }
  }

  async loadAlertDetails() {
    const loading = await this.loadingController.create({
      message: 'Loading alert details...',
    });
    await loading.present();

    this.isLoading = true;

    this.strapiService.getAlertByDocumentId(this.documentId).subscribe({
      next: (response) => {
        this.alert = response.data;
        this.isLoading = false;
        loading.dismiss();
      },
      error: async (error) => {
        console.error('Error loading alert details:', error);
        this.isLoading = false;
        loading.dismiss();
        this.showErrorAndGoBack('Failed to load alert details');
      },
    });
  }

  async showErrorAndGoBack(message: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: message,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.router.navigate(['/alerts']);
          },
        },
      ],
    });
    await alert.present();
  }

  getImageUrl(): string {
    if (this.alert?.Main_Image?.url) {
      return this.strapiService.getImageUrl(this.alert.Main_Image.url);
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
      weekday: 'long',
      year: 'numeric',
      month: 'long',
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

  goBack() {
    this.router.navigate(['/alerts']);
  }
}
