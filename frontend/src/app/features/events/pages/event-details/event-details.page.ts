import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseImport } from '../../../../core/base-import';
import { StrapiService, Event } from '../../../../core/services/strapi.service';
import {
  LoadingController,
  AlertController,
  IonButton,
  IonCardContent,
  IonSkeletonText,
  IonCard,
  IonIcon,
  IonChip,
  IonLabel,
  IonCardHeader,
  IonCardTitle,
  IonBadge,
} from '@ionic/angular/standalone';

@Component({
  standalone: true,
  selector: 'app-event-details',
  imports: [
    IonBadge,
    IonCardTitle,
    IonCardHeader,
    IonLabel,
    IonChip,
    IonIcon,
    IonCard,
    IonSkeletonText,
    IonCardContent,
    IonButton,
    ...BaseImport,
  ],
  templateUrl: './event-details.page.html',
  styleUrls: ['./event-details.page.scss'],
})
export class EventDetailsPage implements OnInit {
  event: Event | null = null;
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
      this.loadEventDetails();
    } else {
      this.showErrorAndGoBack('Invalid event ID');
    }
  }

  async loadEventDetails() {
    const loading = await this.loadingController.create({
      message: 'Loading event details...',
    });
    await loading.present();

    this.isLoading = true;

    this.strapiService.getEventByDocumentId(this.documentId).subscribe({
      next: (response) => {
        this.event = response.data;
        this.isLoading = false;
        loading.dismiss();
      },
      error: async (error) => {
        console.error('Error loading event details:', error);
        this.isLoading = false;
        loading.dismiss();
        this.showErrorAndGoBack('Failed to load event details');
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
            this.router.navigate(['/events']);
          },
        },
      ],
    });
    await alert.present();
  }

  getImageUrl(): string {
    if (this.event?.Main_Image?.url) {
      return this.strapiService.getImageUrl(this.event.Main_Image.url);
    }
    return 'assets/images/placeholder-event.png';
  }

  onImageError(event: ErrorEvent) {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.src = 'assets/images/placeholder-event.png';
    }
  }

  formatDateTime(dateString: string): string {
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

  formatTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }

  formatDateOnly(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  isSameDay(start: string, end: string): boolean {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return startDate.toDateString() === endDate.toDateString();
  }

  isEventHappening(): boolean {
    if (!this.event) return false;
    const now = new Date();
    const start = new Date(this.event.Start_Time);
    const end = new Date(this.event.End_Time);
    return now >= start && now <= end;
  }

  isEventPast(): boolean {
    if (!this.event) return false;
    const now = new Date();
    const end = new Date(this.event.End_Time);
    return now > end;
  }

  isEventUpcoming(): boolean {
    if (!this.event) return false;
    const now = new Date();
    const start = new Date(this.event.Start_Time);
    return now < start;
  }

  goBack() {
    this.router.navigate(['/events']);
  }
}
