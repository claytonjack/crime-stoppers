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
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonBadge,
  IonText,
  IonSpinner,
  IonModal,
  IonImg,
  ModalController,
} from '@ionic/angular/standalone';
import { NgIcon } from '@ng-icons/core';
import { StrapiService } from 'src/app/core/services/strapi.service';
import { Alert } from 'src/app/features/alerts/models/alert.model';
import { StrapiResponse } from 'src/app/core/models/strapi.model';
import { HeaderComponent } from 'src/app/core/components/header/header.component';
import { ScreenReaderService } from 'src/app/core/pages/settings/services/screen-reader.service';
import { register } from 'swiper/element/bundle';
import { SwiperContainer } from 'swiper/element';
import { TranslateModule } from '@ngx-translate/core';
register();

@Component({
  selector: 'app-alert-details',
  templateUrl: './alert-details.page.html',
  styleUrls: ['./alert-details.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonBadge,
    IonText,
    IonSpinner,
    IonModal,
    IonImg,
    NgIcon,
    HeaderComponent,
    TranslateModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AlertDetailsPage implements OnInit {
  private readonly strapiService = inject(StrapiService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly modalController = inject(ModalController);
  private readonly screenReader = inject(ScreenReaderService);

  readonly alert = signal<Alert | null>(null);
  readonly isLoading = signal<boolean>(true);
  readonly error = signal<string | null>(null);
  readonly selectedImageIndex = signal<number>(0);
  readonly isImageModalOpen = signal<boolean>(false);

  ngOnInit() {
    this.loadAlert();
    this.screenReader.speak('Alert details page opened');
  }

  private async loadAlert() {
    const documentId = this.route.snapshot.paramMap.get('documentId');

    if (!documentId) {
      this.error.set('feature.alertDetails.errors.invalidId');
      this.isLoading.set(false);
      await this.screenReader.speak('Invalid alert ID');
      return;
    }

    try {
      const response = (await this.strapiService
        .getAlertByDocumentId(documentId)
        .toPromise()) as StrapiResponse<Alert>;

      if (response?.data) {
        this.alert.set(response.data);
        await this.screenReader.speak(`Alert loaded: ${response.data.Title}`);
      } else {
        this.error.set('feature.alertDetails.errors.notFound');
        await this.screenReader.speak('Alert not found');
      }
    } catch (error) {
      console.error('Error loading alert:', error);
      this.error.set('feature.alertDetails.errors.failed');
      await this.screenReader.speak('Failed to load alert');
    } finally {
      this.isLoading.set(false);
    }
  }

  async goBack() {
    await this.screenReader.speak('Going back');
    this.location.back();
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
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

  getImageUrl(imageUrl: string): string {
    return this.strapiService.getImageUrl(imageUrl);
  }

  async onImageClick(index: number) {
    this.selectedImageIndex.set(index);
    this.isImageModalOpen.set(true);
    await this.screenReader.speak(`Image ${index + 1} opened`);
  }

  async closeImageModal() {
    this.isImageModalOpen.set(false);
    await this.screenReader.speak('Image viewer closed');
  }

  async onSwiperSlideChange(event: any) {
    if (event.detail && event.detail[0]) {
      const newIndex = event.detail[0].activeIndex;
      this.selectedImageIndex.set(newIndex);
      await this.screenReader.speak(`Image ${newIndex + 1} selected`);
    }
  }
}
