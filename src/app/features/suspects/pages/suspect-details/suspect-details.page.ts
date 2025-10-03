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
  IonText,
  IonSpinner,
  IonModal,
  IonImg,
  ModalController,
} from '@ionic/angular/standalone';
import { NgIcon } from '@ng-icons/core';
import { StrapiService } from 'src/app/core/services/strapi.service';
import { Suspect } from 'src/app/features/suspects/models/suspect.model';
import { StrapiResponse } from 'src/app/core/models/strapi.model';
import { HeaderComponent } from 'src/app/core/components/header/header.component';

import { register } from 'swiper/element/bundle';
import { SwiperContainer } from 'swiper/element';

register();

@Component({
  selector: 'app-suspect-details',
  templateUrl: './suspect-details.page.html',
  styleUrls: ['./suspect-details.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonText,
    IonSpinner,
    IonModal,
    IonImg,
    NgIcon,
    HeaderComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SuspectDetailsPage implements OnInit {
  private readonly strapiService = inject(StrapiService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly modalController = inject(ModalController);

  readonly suspect = signal<Suspect | null>(null);
  readonly isLoading = signal<boolean>(true);
  readonly error = signal<string | null>(null);
  readonly selectedImageIndex = signal<number>(0);
  readonly isImageModalOpen = signal<boolean>(false);

  ngOnInit() {
    this.loadSuspect();
  }

  private async loadSuspect() {
    const documentId = this.route.snapshot.paramMap.get('documentId');

    if (!documentId) {
      this.error.set('Invalid suspect ID');
      this.isLoading.set(false);
      return;
    }

    try {
      const response = (await this.strapiService
        .getSuspectByDocumentId(documentId)
        .toPromise()) as StrapiResponse<Suspect>;

      if (response?.data) {
        this.suspect.set(response.data);
      } else {
        this.error.set('Suspect not found');
      }
    } catch (error) {
      console.error('Error loading suspect:', error);
      this.error.set('Failed to load suspect');
    } finally {
      this.isLoading.set(false);
    }
  }

  goBack() {
    this.location.back();
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
