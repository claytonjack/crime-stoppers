import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  ViewChild,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { HeaderComponent } from 'src/app/core/components/header/header.component';
import { StrapiService } from 'src/app/core/services/strapi.service';
import {
  LanguageService,
  LanguageOption,
} from 'src/app/core/pages/settings/services/language.service';
import { StrapiResponse } from 'src/app/core/models/strapi.model';
import { PopoverController } from '@ionic/angular';
import { Alert } from 'src/app/features/alerts/models/alert.model';
import { AlertsFilterComponent } from 'src/app/features/alerts/components/alerts-filter.component';
import { Subscription } from 'rxjs';
import {
  IonImg,
  IonBadge,
  IonCardHeader,
  IonCardTitle,
  IonList,
  IonButton,
  IonContent,
  IonCard,
  IonCardSubtitle,
  IonInfiniteScrollContent,
  IonInfiniteScroll,
  IonCardContent,
  IonSearchbar,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { ScreenReaderService } from 'src/app/core/pages/settings/services/screen-reader.service';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.page.html',
  styleUrls: ['./alerts.page.scss'],
  standalone: true,
  imports: [
    IonSearchbar,
    IonCardContent,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonCardSubtitle,
    IonCard,
    IonContent,
    IonButton,
    IonList,
    IonCardTitle,
    IonCardHeader,
    IonBadge,
    IonImg,
    CommonModule,
    FormsModule,
    NgIcon,
    HeaderComponent,
    TranslateModule,
  ],
  providers: [PopoverController],
})
export class AlertsPage implements OnInit, OnDestroy {
  @ViewChild(IonInfiniteScroll, { static: true })
  infiniteScroll!: IonInfiniteScroll;

  private readonly strapiService = inject(StrapiService);
  private readonly languageService = inject(LanguageService);
  private readonly router = inject(Router);
  private readonly popoverController = inject(PopoverController);
  private readonly screenReader = inject(ScreenReaderService);

  private languageSubscription?: Subscription;

  private readonly allAlerts = signal<Alert[]>([]);
  readonly searchTerm = signal<string>('');

  get searchQuery() {
    return this.searchTerm();
  }
  set searchQuery(value: string) {
    this.searchTerm.set(value);
  }

  readonly selectedSource = signal<string>('');
  readonly isLoading = signal<boolean>(false);
  readonly hasMoreData = signal<boolean>(true);
  private readonly currentPage = signal<number>(1);
  private readonly pageSize = 5;

  readonly filteredAlerts = computed(() => {
    let alerts = this.allAlerts();
    const search = this.searchTerm().toLowerCase();
    if (search) {
      alerts = alerts.filter(
        (alert) =>
          alert.Title.toLowerCase().includes(search) ||
          alert.Body.toLowerCase().includes(search)
      );
    }
    const source = this.selectedSource();
    if (source) {
      alerts = alerts.filter((alert) => alert.Source === source);
    }
    return alerts;
  });

  readonly uniqueSources = computed(() => {
    const sources = this.allAlerts().map((alert) => alert.Source);
    return [...new Set(sources)].sort();
  });

  async ngOnInit() {
    // Set initial locale in Strapi service
    const currentLang: LanguageOption =
      this.languageService.getCurrentLanguage();
    this.strapiService.setLocale(currentLang);

    // Load alerts with current locale
    await this.loadAlerts();
    await this.screenReader.speak('Alerts loaded');

    // Subscribe to language changes and reload alerts
    this.languageSubscription = this.languageService.currentLanguage$.subscribe(
      async (language: LanguageOption) => {
        console.log(
          'Language changed, reloading alerts with locale:',
          language
        );
        this.strapiService.setLocale(language);
        await this.loadAlerts(1); // Reload from page 1
        await this.screenReader.speak(
          `Language changed. Alerts reloaded in ${language}`
        );
      }
    );
  }

  ngOnDestroy() {
    // Clean up subscription
    this.languageSubscription?.unsubscribe();
  }

  async loadMore(event: any) {
    try {
      event?.target?.complete?.();
      if (!this.hasMoreData()) {
        if (event?.target) event.target.disabled = true;
      }
    } catch (err) {}
  }

  private async loadAlerts(page: number = 1) {
    if (this.isLoading()) return;

    this.isLoading.set(true);

    try {
      const response = (await this.strapiService
        .getAlerts()
        .toPromise()) as StrapiResponse<Alert[]>;

      if (response?.data) {
        // Sort by createdAt only, descending (newest first)
        const sortedAlerts = response.data.sort(
          (a: Alert, b: Alert) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        if (page === 1) {
          this.allAlerts.set(sortedAlerts);
        } else {
          this.allAlerts.update((current) => [...current, ...sortedAlerts]);
        }

        this.hasMoreData.set(false);

        await this.screenReader.speak(`${sortedAlerts.length} alerts loaded`);
      }
    } catch (error) {
      console.error('Error loading alerts:', error);
      await this.screenReader.speak('Error loading alerts');
    }

    this.isLoading.set(false);
  }

  async onSearchChange(event: any) {
    this.searchTerm.set(event.detail?.value ?? event.target?.value ?? '');
    await this.screenReader.speak(
      this.searchTerm()
        ? `Searching alerts for ${this.searchTerm()}`
        : 'Search cleared'
    );
  }

  async openFilterPopover(event: Event) {
    const popover = await this.popoverController.create({
      component: AlertsFilterComponent,
      event: event,
      translucent: true,
      componentProps: {
        selectedSource: this.selectedSource(),
        availableSources: this.uniqueSources(),
        onSourceChange: (source: string) => this.onSourceChange(source),
        clearFilters: () => this.clearFilters(),
      },
    });

    await popover.present();
    await this.screenReader.speak('Filter options opened');
  }

  async onSourceChange(source: string) {
    this.selectedSource.set(source);
    await this.screenReader.speak(
      source ? `Filter applied: ${source}` : 'Filter cleared'
    );
  }

  async clearFilters() {
    this.selectedSource.set('');
    this.searchTerm.set('');
    await this.screenReader.speak('All filters cleared');
  }

  navigateToDetails(alert: Alert) {
    this.router.navigate(['/alerts', 'details', alert.documentId]);
    this.screenReader.speak(`Viewing details for alert titled ${alert.Title}`);
  }

  getImageUrl(alert: Alert): string {
    if (
      alert.Images &&
      Array.isArray(alert.Images) &&
      alert.Images.length > 0
    ) {
      const firstImage = alert.Images[0];
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

  getSourceBadgeColor(source: string): string {
    const colors: { [key: string]: string } = {
      Police: 'primary',
      Community: 'secondary',
      Media: 'tertiary',
      Official: 'success',
    };
    return colors[source] || 'medium';
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
    return `${this.formatDate(dateString)} at ${this.formatTime(dateString)}`;
  }
}
