import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BaseImport } from '../../../../core/base-import';
import { StrapiService, Event } from '../../../../core/services/strapi.service';
import {
  LoadingController,
  AlertController,
  IonIcon,
  IonButton,
  IonCard,
  IonCardContent,
  IonRefresher,
  IonSegment,
  IonSegmentButton,
  IonBadge,
  IonLabel,
  IonRefresherContent,
  IonSkeletonText,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-events',
  standalone: true,
  templateUrl: 'events.page.html',
  styleUrls: ['events.page.scss'],
  imports: [
    IonSkeletonText,
    IonRefresherContent,
    IonLabel,
    IonBadge,
    IonSegmentButton,
    IonSegment,
    IonRefresher,
    IonCardContent,
    IonCard,
    IonButton,
    IonIcon,
    ...BaseImport,
  ],
})
export class EventsPage implements OnInit {
  private readonly strapiService = inject(StrapiService);
  private readonly router = inject(Router);
  private readonly loadingController = inject(LoadingController);
  private readonly alertController = inject(AlertController);

  events: Event[] = [];
  upcomingEvents: Event[] = [];
  pastEvents: Event[] = [];
  selectedSegment: string = 'upcoming';
  isLoading = false;

  ngOnInit() {
    this.loadEvents();
  }

  async loadEvents() {
    const loading = await this.loadingController.create({
      message: 'Loading events...',
    });
    await loading.present();

    this.isLoading = true;

    this.strapiService.getEvents().subscribe({
      next: (response) => {
        this.events = response.data;
        this.categorizeEvents();
        this.isLoading = false;
        loading.dismiss();
      },
      error: async (error) => {
        console.error('Error loading events:', error);
        this.isLoading = false;
        loading.dismiss();

        const alert = await this.alertController.create({
          header: 'Error',
          message: 'Failed to load events. Please try again later.',
          buttons: ['OK'],
        });
        await alert.present();
      },
    });
  }

  categorizeEvents() {
    const now = new Date();
    this.upcomingEvents = this.events.filter(
      (event) => new Date(event.Start_Time) >= now
    );
    this.pastEvents = this.events.filter(
      (event) => new Date(event.End_Time) < now
    );
  }

  viewEventDetails(event: Event) {
    this.router.navigate(['/event-details', event.documentId]);
  }

  getImageUrl(event: Event): string {
    if (event.Main_Image?.url) {
      return this.strapiService.getImageUrl(event.Main_Image.url);
    }
    return 'assets/images/placeholder-event.png';
  }

  onImageError(event: ErrorEvent) {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.src = 'assets/images/placeholder-event.png';
    }
  }

  formatEventDate(startTime: string, endTime: string): string {
    const start = new Date(startTime);
    const end = new Date(endTime);

    const startDate = start.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });

    const startTimeStr = start.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    const endTimeStr = end.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    if (start.toDateString() === end.toDateString()) {
      return `${startDate} • ${startTimeStr} - ${endTimeStr}`;
    } else {
      const endDate = end.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
      return `${startDate} ${startTimeStr} - ${endDate} ${endTimeStr}`;
    }
  }

  isEventHappening(startTime: string, endTime: string): boolean {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);
    return now >= start && now <= end;
  }

  onSegmentChange(event: any) {
    this.selectedSegment = event.detail.value;
  }

  async doRefresh(event: CustomEvent) {
    this.strapiService.getEvents().subscribe({
      next: (response) => {
        this.events = response.data;
        this.categorizeEvents();
        event.detail.complete();
      },
      error: (error) => {
        console.error('Error refreshing events:', error);
        event.detail.complete();
      },
    });
  }
}
