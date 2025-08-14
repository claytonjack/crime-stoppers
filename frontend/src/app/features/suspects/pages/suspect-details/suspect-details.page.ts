import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseImport } from '../../../../core/base-import';
import {
  StrapiService,
  Suspect,
} from '../../../../core/services/strapi.service';
import {
  LoadingController,
  AlertController,
  IonCard,
  IonCardContent,
  IonIcon,
  IonSkeletonText,
  IonCardHeader,
  IonRow,
  IonGrid,
  IonCardTitle,
  IonCol,
  IonButton,
} from '@ionic/angular/standalone';

@Component({
  standalone: true,
  selector: 'app-suspect-details',
  imports: [
    IonButton,
    IonCol,
    IonCardTitle,
    IonGrid,
    IonRow,
    IonCardHeader,
    IonSkeletonText,
    IonIcon,
    IonCardContent,
    IonCard,
    ...BaseImport,
  ],
  templateUrl: './suspect-details.page.html',
  styleUrls: ['./suspect-details.page.scss'],
})
export class SuspectDetailsPage implements OnInit {
  suspect: Suspect | null = null;
  isLoading = false;
  documentId: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private strapiService: StrapiService,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.documentId = this.route.snapshot.paramMap.get('documentId') || '';
    if (this.documentId) {
      this.loadSuspectDetails();
    } else {
      this.showErrorAndGoBack('Invalid suspect ID');
    }
  }

  async loadSuspectDetails() {
    const loading = await this.loadingController.create({
      message: 'Loading suspect details...',
    });
    await loading.present();

    this.isLoading = true;

    this.strapiService.getSuspectByDocumentId(this.documentId).subscribe({
      next: (response) => {
        this.suspect = response.data;
        this.isLoading = false;
        loading.dismiss();
      },
      error: async (error) => {
        console.error('Error loading suspect details:', error);
        this.isLoading = false;
        loading.dismiss();
        this.showErrorAndGoBack('Failed to load suspect details');
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
            this.router.navigate(['/suspects']);
          },
        },
      ],
    });
    await alert.present();
  }

  getImageUrl(): string {
    if (this.suspect?.Main_Image?.url) {
      return this.strapiService.getImageUrl(this.suspect.Main_Image.url);
    }
    return 'assets/images/placeholder-suspect.png';
  }

  onImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.src = 'assets/images/placeholder-suspect.png';
    }
  }

  goBack() {
    this.router.navigate(['/suspects']);
  }

  async callContact() {
    if (this.suspect?.Contact) {
      const phoneRegex = /(\d{3}[-.]?\d{3}[-.]?\d{4})/;
      const match = this.suspect.Contact.match(phoneRegex);

      if (match) {
        const phoneNumber = match[1].replace(/[-.\s]/g, '');
        window.open(`tel:${phoneNumber}`, '_system');
      } else {
        const alert = await this.alertController.create({
          header: 'Contact Information',
          message: this.suspect.Contact,
          buttons: ['OK'],
        });
        await alert.present();
      }
    }
  }
}
