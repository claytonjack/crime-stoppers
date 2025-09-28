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
  AlertController, // Make sure this is imported
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
import { HeaderComponent } from '../../../../core/components/header/header.component';
import { StrapiService } from '../../../../core/services/strapi.service';
import { Event } from '../../models/event.model';
import { StrapiResponse } from '../../../../core/models/strapi.model';
import { CalendarService } from '../../calendar.service';
import { EventsFilterComponent } from '../../components/events-filter.component';

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

  readonly searchTerm = signal<string>('');
  get searchQuery() {
    return this.searchTerm();
  }
  set searchQuery(value: string) {
    this.searchTerm.set(value);
  }

  readonly selectedEventType = signal<string>(''); // '', 'upcoming', 'past'

  onSearchChange(event: any) {
    const value = event.detail?.value ?? event.target?.value ?? '';
    this.searchTerm.set(value);
  }

  onEventTypeChange(type: string) {
    this.selectedEventType.set(type);
  }

  clearFilters() {
    this.selectedEventType.set('');
    this.searchTerm.set('');
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

  ngOnInit() {
    this.loadEvents();
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
        this.displayedEvents.set([]); // reset paging
        this.hasMoreData.set(true);
        this.loadMoreEvents();
      }
    } catch (error) {
      this.allEvents.set([]);
      this.displayedEvents.set([]);
      this.hasMoreData.set(false);
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
    this.router.navigate(['/event-details', event.documentId]);
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
  }

  async addToCalendar(evnt: Event, mouseEvent?: MouseEvent) {
    if (mouseEvent) {
      mouseEvent.stopPropagation();
    }

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
