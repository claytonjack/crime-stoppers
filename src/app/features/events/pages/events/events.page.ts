import {
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonImg,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonSearchbar,
  IonButton,
  IonList,
  IonBadge,
  IonCardContent,
  IonCardSubtitle,
  PopoverController,
  AlertController,
} from '@ionic/angular/standalone';
import { NgIcon } from '@ng-icons/core';
import { CommonModule, NgIf, NgForOf } from '@angular/common';
import {
  Component,
  OnInit,
  ViewChild,
  inject,
  signal,
  computed,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderComponent } from 'src/app/core/components/header/header.component';
import { StrapiService } from 'src/app/core/services/strapi.service';
import { Event } from 'src/app/features/events/models/event.model';
import { StrapiResponse } from 'src/app/core/models/strapi.model';
import { CalendarService } from 'src/app/features/events/calendar.service';
import { EventsFilterComponent } from 'src/app/features/events/components/events-filter.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ScreenReaderService } from 'src/app/core/pages/settings/services/screen-reader.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.page.html',
  styleUrls: ['./events.page.scss'],
  standalone: true,
  imports: [
    IonCardSubtitle,
    IonCardContent,
    FormsModule,
    CommonModule,
    NgIf,
    NgForOf,
    NgIcon,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonImg,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonSearchbar,
    IonButton,
    IonList,
    IonBadge,
    IonBadge,
    HeaderComponent,
    TranslateModule,
  ],
})
export class EventsPage implements OnInit {
  @ViewChild(IonInfiniteScroll, { static: true })
  infiniteScroll!: IonInfiniteScroll;

  private readonly strapiService = inject(StrapiService);
  private readonly router = inject(Router);
  private readonly calendarService = inject(CalendarService);
  private readonly alertController = inject(AlertController);
  private readonly popoverController = inject(PopoverController);
  private readonly translate = inject(TranslateService);
  private readonly screenReader = inject(ScreenReaderService);

  readonly searchTerm = signal<string>('');
  get searchQuery() {
    return this.searchTerm();
  }
  set searchQuery(value: string) {
    this.searchTerm.set(value);
  }

  readonly selectedEventType = signal<string>('');

  async onSearchChange(event: any) {
    const value = event.detail?.value ?? event.target?.value ?? '';
    this.searchTerm.set(value);
    await this.screenReader.speak(
      value ? `Searching events for ${value}` : 'Search cleared'
    );
  }

  async onEventTypeChange(type: string) {
    this.selectedEventType.set(type);
    await this.screenReader.speak(
      type === 'upcoming'
        ? 'Filter applied: Upcoming events'
        : type === 'past'
        ? 'Filter applied: Past events'
        : 'Filter cleared: All events'
    );
  }

  async clearFilters() {
    this.selectedEventType.set('');
    this.searchTerm.set('');
    await this.screenReader.speak('All filters cleared');
  }

  readonly allEvents = signal<Event[]>([]);
  readonly displayedEvents = signal<Event[]>([]);
  readonly isLoading = signal<boolean>(false);
  readonly hasMoreData = signal<boolean>(true);
  private readonly currentPage = signal<number>(1);
  private readonly pageSize = 5;

  readonly filteredEvents = computed(() => {
    let events = this.displayedEvents();
    const term = this.searchTerm().toLowerCase();
    const type = this.selectedEventType();

    if (type === 'upcoming') {
      events = events.filter(
        (e: Event) => new Date(e.Event_Time) >= new Date()
      );
    } else if (type === 'past') {
      events = events.filter((e: Event) => new Date(e.Event_Time) < new Date());
    }

    if (term) {
      events = events.filter(
        (e: Event) =>
          (e.Title || '').toLowerCase().includes(term) ||
          (e.Location || '').toLowerCase().includes(term)
      );
    }

    if (type === 'upcoming') {
      events = events.sort(
        (a: Event, b: Event) =>
          new Date(a.Event_Time).getTime() - new Date(b.Event_Time).getTime()
      );
    } else if (type === 'past') {
      events = events.sort(
        (a: Event, b: Event) =>
          new Date(b.Event_Time).getTime() - new Date(a.Event_Time).getTime()
      );
    }

    return events;
  });

  async ngOnInit() {
    await this.loadEvents();
    await this.screenReader.speak('Events loaded');
  }

  private async loadEvents() {
    if (this.isLoading()) return;
    this.isLoading.set(true);

    try {
      const response = (await this.strapiService
        .getEvents()
        .toPromise()) as StrapiResponse<Event[]>;

      if (response?.data) {
        const sortedEvents = response.data.sort(
          (a, b) =>
            new Date(b.Event_Time).getTime() - new Date(a.Event_Time).getTime()
        );
        this.allEvents.set(sortedEvents);
        this.displayedEvents.set([]);
        this.hasMoreData.set(true);
        this.loadMoreEvents();
        await this.screenReader.speak(
          `${this.displayedEvents().length} events loaded`
        );
      }
    } catch (error) {
      this.allEvents.set([]);
      this.displayedEvents.set([]);
      this.hasMoreData.set(false);
      await this.screenReader.speak('Failed to load events');
    } finally {
      this.isLoading.set(false);
    }
  }

  private loadMoreEvents() {
    const currentDisplayed = this.displayedEvents();
    const allEvents = this.allEvents();
    const startIndex = currentDisplayed.length;
    const endIndex = Math.min(startIndex + this.pageSize, allEvents.length);

    if (startIndex < allEvents.length) {
      const newEvents = allEvents.slice(startIndex, endIndex);
      this.displayedEvents.update((current) => [...current, ...newEvents]);

      if (endIndex >= allEvents.length) {
        this.hasMoreData.set(false);
      }
    } else {
      this.hasMoreData.set(false);
    }
  }

  loadMore(event: any) {
    this.loadMoreEvents();
    try {
      event?.target?.complete?.();
      if (!this.hasMoreData()) {
        if (event?.target) event.target.disabled = true;
      }
    } catch {}
  }

  navigateToDetails(event: Event) {
    this.router.navigate(['/events', 'details', event.documentId]);
    this.screenReader.speak(`Viewing details for event titled ${event.Title}`);
  }

  getImageUrl(event: Event): string {
    if (
      event.Images &&
      Array.isArray(event.Images) &&
      event.Images.length > 0
    ) {
      const firstImage = event.Images[0];
      if (firstImage && firstImage.url) {
        return this.strapiService.getImageUrl(firstImage.url);
      }
    }
    return '';
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

  getTypeBadgeColorSafe(type?: string): string {
    return this.getTypeBadgeColor(type || '');
  }

  getTypeBadgeColor(type: string): string {
    switch ((type || '').toLowerCase()) {
      case 'community':
        return 'primary';
      case 'fundraiser':
        return 'success';
      case 'meeting':
        return 'tertiary';
      case 'training':
        return 'warning';
      default:
        return 'medium';
    }
  }

  async openFilterPopover(event: MouseEvent) {
    const popover = await this.popoverController.create({
      component: EventsFilterComponent,
      event,
      translucent: true,
      componentProps: {
        selectedEventType: this.selectedEventType(),
        onEventTypeChange: (type: string) => this.onEventTypeChange(type),
        clearFilters: () => this.clearFilters(),
      },
    });

    await popover.present();
    await this.screenReader.speak('Filter options opened');
  }

  async addToCalendar(evnt: Event, mouseEvent?: MouseEvent) {
    if (mouseEvent) {
      mouseEvent.stopPropagation();
    }

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
      await this.screenReader.speak('An error occurred while saving the event');
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
