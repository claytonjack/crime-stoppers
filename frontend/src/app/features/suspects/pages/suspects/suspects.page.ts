import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseImport } from '../../../../core/base-import';
import {
  StrapiService,
  Suspect,
} from '../../../../core/services/strapi.service';
import {
  LoadingController,
  AlertController,
  IonRefresher,
  IonRefresherContent,
  IonCard,
  IonCardContent,
  IonSkeletonText,
  IonIcon,
  IonButton,
} from '@ionic/angular/standalone';

@Component({
  standalone: true,
  selector: 'app-suspects',
  imports: [
    IonButton,
    IonIcon,
    IonSkeletonText,
    IonCardContent,
    IonCard,
    IonRefresherContent,
    IonRefresher,
    ...BaseImport,
  ],
  templateUrl: './suspects.page.html',
  styleUrls: ['./suspects.page.scss'],
})
export class SuspectsPage implements OnInit {
  suspects: Suspect[] = [];
  isLoading = false;

  constructor(
    private strapiService: StrapiService,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.loadSuspects();
  }

  async loadSuspects() {
    const loading = await this.loadingController.create({
      message: 'Loading most wanted suspects...',
    });
    await loading.present();

    this.isLoading = true;

    this.strapiService.getSuspects().subscribe({
      next: (response) => {
        this.suspects = response.data;
        this.isLoading = false;
        loading.dismiss();
      },
      error: async (error) => {
        console.error('Error loading suspects:', error);
        this.isLoading = false;
        loading.dismiss();

        const alert = await this.alertController.create({
          header: 'Error',
          message: 'Failed to load suspects. Please try again later.',
          buttons: ['OK'],
        });
        await alert.present();
      },
    });
  }

  viewSuspectDetails(suspect: Suspect) {
    this.router.navigate(['/suspect-details', suspect.documentId]);
  }

  getImageUrl(suspect: Suspect): string {
    if (suspect.Main_Image?.url) {
      return this.strapiService.getImageUrl(suspect.Main_Image.url);
    }
    return 'assets/images/placeholder-suspect.png';
  }

  onImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.src = 'assets/images/placeholder-suspect.png';
    }
  }

  async doRefresh(event: any) {
    this.strapiService.getSuspects().subscribe({
      next: (response) => {
        this.suspects = response.data;
        event.target.complete();
      },
      error: (error) => {
        console.error('Error refreshing suspects:', error);
        event.target.complete();
      },
    });
  }
}
