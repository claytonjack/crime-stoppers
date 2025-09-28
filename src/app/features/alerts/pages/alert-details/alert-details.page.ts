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
import { StrapiService } from '../../../../core/services/strapi.service';
import { Alert } from '../../models/alert.model';
import { StrapiResponse } from '../../../../core/models/strapi.model';
import { HeaderComponent } from '../../../../core/components/header/header.component';
import { register } from 'swiper/element/bundle';
import { SwiperContainer } from 'swiper/element';
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
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AlertDetailsPage implements OnInit {
  private readonly strapiService = inject(StrapiService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly modalController = inject(ModalController);

  readonly alert = signal<Alert | null>(null);
  readonly isLoading = signal<boolean>(true);
  readonly error = signal<string | null>(null);
  readonly selectedImageIndex = signal<number>(0);
  readonly isImageModalOpen = signal<boolean>(false);

  ngOnInit() {
    this.loadAlert();
  }

  private async loadAlert() {
    const documentId = this.route.snapshot.paramMap.get('documentId');

    if (!documentId) {
      this.error.set('Invalid alert ID');
      this.isLoading.set(false);
      return;
    }

    try {
      const response = (await this.strapiService
        .getAlertByDocumentId(documentId)
        .toPromise()) as StrapiResponse<Alert>;

      if (response?.data) {
        this.alert.set(response.data);
      } else {
        this.error.set('Alert not found');
      }
    } catch (error) {
      console.error('Error loading alert:', error);
      this.error.set('Failed to load alert');
    } finally {
      this.isLoading.set(false);
    }
  }

  goBack() {
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
}
