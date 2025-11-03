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
import { ScreenReaderService } from 'src/app/core/pages/settings/services/screen-reader.service';

import { register } from 'swiper/element/bundle';
import { SwiperContainer } from 'swiper/element';
import { TranslateModule } from '@ngx-translate/core';

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
    TranslateModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SuspectDetailsPage implements OnInit {
  private readonly strapiService = inject(StrapiService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly modalController = inject(ModalController);
  private readonly screenReader = inject(ScreenReaderService);

  readonly suspect = signal<Suspect | null>(null);
  readonly isLoading = signal<boolean>(true);
  readonly error = signal<string | null>(null);
  readonly selectedImageIndex = signal<number>(0);
  readonly isImageModalOpen = signal<boolean>(false);

  async ngOnInit() {
    await this.loadSuspect();
  }

  private async loadSuspect() {
    const documentId = this.route.snapshot.paramMap.get('documentId');

    if (!documentId) {
      this.error.set('feature.suspectDetails.errors.invalidId');
      this.isLoading.set(false);
      await this.screenReader.speak('Invalid suspect ID');
      return;
    }

    try {
      const response = (await this.strapiService
        .getSuspectByDocumentId(documentId)
        .toPromise()) as StrapiResponse<Suspect>;

      if (response?.data) {
        this.suspect.set(response.data);
        await this.screenReader.speak(
          `Suspect details loaded for ${response.data.Name}`
        );
      } else {
        this.error.set('feature.suspectDetails.errors.notFound');
        await this.screenReader.speak('Suspect not found');
      }
    } catch (error) {
      console.error('Error loading suspect:', error);
      this.error.set('feature.suspectDetails.errors.failed');
      await this.screenReader.speak('Failed to load suspect');
    } finally {
      this.isLoading.set(false);
    }
  }

  async goBack() {
    await this.screenReader.speak('Going back');
    this.location.back();
  }

  getImageUrl(imageUrl: string): string {
    return this.strapiService.getImageUrl(imageUrl);
  }

  async onImageClick(index: number) {
    this.selectedImageIndex.set(index);
    this.isImageModalOpen.set(true);

    const suspectName = this.suspect()?.Name || 'Suspect';
    await this.screenReader.speak(
      `Image ${index + 1} of ${
        this.suspect()?.Images?.length || 0
      } for ${suspectName}`
    );
  }

  async closeImageModal() {
    this.isImageModalOpen.set(false);
    await this.screenReader.speak('Image modal closed');
  }

  async onSwiperSlideChange(event: any) {
    if (event.detail && event.detail[0]) {
      const swiper = event.detail[0];
      const index = swiper.activeIndex ?? 0;
      this.selectedImageIndex.set(index);

      const image = this.suspect()?.Images?.[index];
      if (image) {
        const altText =
          image.alternativeText || this.suspect()?.Name || 'Suspect image';
        await this.screenReader.speak(
          `Slide ${index + 1} of ${this.suspect()?.Images?.length}: ${altText}`
        );
      }
    }
  }
}
