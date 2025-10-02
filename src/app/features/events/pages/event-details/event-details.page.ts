import {
  Component,
  OnInit,
  inject,
  signal,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import {
  IonContent,
  IonText,
  IonSpinner,
  IonModal,
  IonImg,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  ModalController,
  AlertController,
} from '@ionic/angular/standalone';
import { NgIcon } from '@ng-icons/core';
import { StrapiService } from '../../../../core/services/strapi.service';
import { Event } from '../../models/event.model';
import { StrapiResponse } from '../../../../core/models/strapi.model';
import { HeaderComponent } from '../../../../core/components/header/header.component';
import { CalendarService } from '../../calendar.service';

// Import Swiper modules and components
import { register } from 'swiper/element/bundle';
import { SwiperContainer } from 'swiper/element';

// Register Swiper web components
register();

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.page.html',
  styleUrls: ['./event-details.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonText,
    IonSpinner,
    IonModal,
    IonImg,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    NgIcon,
    HeaderComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class EventDetailsPage implements OnInit {
  private readonly strapiService = inject(StrapiService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly modalController = inject(ModalController);
  private readonly calendarService = inject(CalendarService);
  private readonly alertController = inject(AlertController);

  readonly event = signal<Event | null>(null);
  readonly isLoading = signal<boolean>(true);
  readonly error = signal<string | null>(null);
  readonly selectedImageIndex = signal<number>(0);
  readonly isImageModalOpen = signal<boolean>(false);

  ngOnInit() {
    this.loadEvent();
  }

  private async loadEvent() {
    const documentId = this.route.snapshot.paramMap.get('documentId');

    if (!documentId) {
      this.error.set('Invalid event ID');
      this.isLoading.set(false);
      return;
    }

    try {
      const response = (await this.strapiService
        .getEventByDocumentId(documentId)
        .toPromise()) as StrapiResponse<Event>;

      if (response?.data) {
        this.event.set(response.data);
      } else {
        this.error.set('Event not found');
      }
    } catch (error) {
      console.error('Error loading event:', error);
      this.error.set('Failed to load event');
    } finally {
      this.isLoading.set(false);
    }
  }

  goBack() {
    this.location.back();
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    } as Intl.DateTimeFormatOptions);
  }

  formatTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }

  formatDateTime(dateString: string): string {
    return this.formatDate(dateString);
  }

  getImageUrl(imageUrl: string): string {
    return this.strapiService.getImageUrl(imageUrl);
  }

  onImageClick(index: number) {
    this.selectedImageIndex.set(index);
    this.isImageModalOpen.set(true);
  }

  closeImageModal() {
    this.isImageModalOpen.set(false);
  }

  onSwiperSlideChange(event: any) {
    if (event.detail && event.detail[0]) {
      this.selectedImageIndex.set(event.detail[0].activeIndex);
    }
  }

  async addToCalendar(evnt: Event | null) {
    if (!evnt) return;

    try {
      const startDate = new Date(evnt.Event_Time);
      const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);

      const res = await this.calendarService.addEvent(
        evnt.Title || 'Community Event',
        evnt.Location || '',
        '',
        startDate,
        endDate
      );

      let header = '';
      let message = '';

      if (res?.success) {
        header = 'Saved to calendar';
        message = 'This event was added to your calendar.';
      } else {
        header =
          res?.reason === 'permission' ? 'Permission required' : 'Save failed';
        message = res?.message || 'Could not save this event to your calendar.';
      }

      const alert = await this.alertController.create({
        header,
        message,
        buttons: [
          {
            text: 'Ok',
            role: 'ok',
          },
        ],
        backdropDismiss: false,
      });

      await alert.present();
    } catch (err) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'An unexpected error occurred while saving the event.',
        buttons: ['Ok'],
        backdropDismiss: false,
      });
      await alert.present();
    }
  }
}
