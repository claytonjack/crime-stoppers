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
import { StrapiService } from 'src/app/core/services/strapi.service';
import { Event } from 'src/app/features/events/models/event.model';
import { StrapiResponse } from 'src/app/core/models/strapi.model';
import { HeaderComponent } from 'src/app/core/components/header/header.component';
import { CalendarService } from 'src/app/features/events/calendar.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ScreenReaderService } from 'src/app/core/pages/settings/services/screen-reader.service';

import { register } from 'swiper/element/bundle';
import { SwiperContainer } from 'swiper/element';

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
    TranslateModule,
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
  private readonly translate = inject(TranslateService);
  private readonly screenReader = inject(ScreenReaderService);

  readonly event = signal<Event | null>(null);
  readonly isLoading = signal<boolean>(true);
  readonly error = signal<string | null>(null);
  readonly selectedImageIndex = signal<number>(0);
  readonly isImageModalOpen = signal<boolean>(false);

  async ngOnInit() {
    await this.loadEvent();
  }

  private async loadEvent() {
    const documentId = this.route.snapshot.paramMap.get('documentId');

    if (!documentId) {
      this.error.set('feature.eventDetails.errors.invalidId');
      this.isLoading.set(false);
      await this.screenReader.speak('Invalid event ID. Unable to load event.');
      return;
    }

    try {
      const response = (await this.strapiService
        .getEventByDocumentId(documentId)
        .toPromise()) as StrapiResponse<Event>;

      if (response?.data) {
        this.event.set(response.data);
        await this.screenReader.speak(
          `Event ${response.data.Title} loaded successfully`
        );
      } else {
        this.error.set('feature.eventDetails.errors.notFound');
        await this.screenReader.speak('Event not found');
      }
    } catch (error) {
      console.error('Error loading event:', error);
      this.error.set('feature.eventDetails.errors.failed');
      await this.screenReader.speak('Failed to load event due to an error');
    } finally {
      this.isLoading.set(false);
    }
  }

  async goBack() {
    await this.screenReader.speak('Navigated back to the previous page');
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

  async onImageClick(index: number) {
    this.selectedImageIndex.set(index);
    this.isImageModalOpen.set(true);
    await this.screenReader.speak(`Opening image ${index + 1}`);
  }

  async closeImageModal() {
    this.isImageModalOpen.set(false);
    await this.screenReader.speak('Closed image preview');
  }

  async onSwiperSlideChange(event: any) {
    if (event.detail && event.detail[0]) {
      const newIndex = event.detail[0].activeIndex;
      this.selectedImageIndex.set(newIndex);
      await this.screenReader.speak(
        `Image ${newIndex + 1} of ${this.event()?.Images?.length || 0}`
      );
    }
  }

  async addToCalendar(evnt: Event | null) {
    if (!evnt) return;

    try {
      const startDate = new Date(evnt.Event_Time);
      const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);

      const res = await this.calendarService.addEvent(
        evnt.Title ||
          this.translate.instant('feature.events.calendar.defaultTitle'),
        evnt.Location || '',
        '',
        startDate,
        endDate
      );

      let header = '';
      let message = '';

      if (res?.success) {
        header = this.translate.instant('feature.events.calendar.savedTitle');
        message = this.translate.instant(
          'feature.events.calendar.savedMessage'
        );
        await this.screenReader.speak('Event saved to calendar');
      } else {
        header =
          res?.reason === 'permission'
            ? this.translate.instant('feature.events.calendar.permissionTitle')
            : this.translate.instant('feature.events.calendar.failureTitle');
        message =
          res?.message ||
          this.translate.instant('feature.events.calendar.failureMessage');
        await this.screenReader.speak('Failed to save event to calendar');
      }

      const alert = await this.alertController.create({
        header,
        message,
        buttons: [
          {
            text: this.translate.instant('core.common.buttons.ok'),
            role: 'ok',
          },
        ],
        backdropDismiss: false,
      });

      await alert.present();
    } catch (err) {
      await this.screenReader.speak(
        'An unexpected error occurred while saving the event to calendar'
      );
      const alert = await this.alertController.create({
        header: this.translate.instant('core.common.error'),
        message: this.translate.instant('feature.events.calendar.errorMessage'),
        buttons: [this.translate.instant('core.common.buttons.ok')],
        backdropDismiss: false,
      });
      await alert.present();
    }
  }
}
