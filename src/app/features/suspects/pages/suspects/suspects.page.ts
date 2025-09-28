import {
  Component,
  OnInit,
  inject,
  ViewChild,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { HeaderComponent } from '../../../../core/components/header/header.component';
import { StrapiService } from '../../../../core/services/strapi.service';
import { StrapiResponse } from 'src/app/core/models/strapi.model';
import { Suspect } from '../../models/suspect.model';
import {
  IonImg,
  IonCardHeader,
  IonCardTitle,
  IonList,
  IonContent,
  IonCard,
  IonCardSubtitle,
  IonInfiniteScrollContent,
  IonInfiniteScroll,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-suspects',
  templateUrl: './suspects.page.html',
  styleUrls: ['./suspects.page.scss'],
  standalone: true,
  imports: [
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonCardSubtitle,
    IonCard,
    IonContent,
    IonList,
    IonCardTitle,
    IonCardHeader,
    IonImg,
    CommonModule,
    FormsModule,
    NgIcon,
    HeaderComponent,
  ],
})
export class SuspectsPage implements OnInit {
  @ViewChild(IonInfiniteScroll, { static: true })
  infiniteScroll!: IonInfiniteScroll;

  private readonly strapiService = inject(StrapiService);
  private readonly router = inject(Router);

  private readonly allSuspects = signal<Suspect[]>([]);
  readonly isLoading = signal<boolean>(false);
  readonly hasMoreData = signal<boolean>(true);

  readonly filteredSuspects = computed(() => {
    return this.allSuspects();
  });

  async loadMore(event: any) {
    try {
      event?.target?.complete?.();
      if (!this.hasMoreData()) {
        if (event?.target) event.target.disabled = true;
      }
    } catch (err) {}
  }

  ngOnInit() {
    this.loadSuspects();
  }

  private async loadSuspects(page: number = 1) {
    if (this.isLoading()) return;
    this.isLoading.set(true);
    try {
      const response = (await this.strapiService
        .getSuspects()
        .toPromise()) as StrapiResponse<Suspect[]>;
      if (response?.data) {
        const sortedSuspects = response.data.sort(
          (a: Suspect, b: Suspect) =>
            new Date(b.publishedAt || b.createdAt).getTime() -
            new Date(a.publishedAt || a.createdAt).getTime()
        );
        if (page === 1) {
          this.allSuspects.set(sortedSuspects);
        } else {
          this.allSuspects.update((current) => [...current, ...sortedSuspects]);
        }
        this.hasMoreData.set(false);
      }
    } catch (error) {}
    this.isLoading.set(false);
  }

  navigateToDetails(suspect: Suspect) {
    this.router.navigate(['/suspect-details', suspect.documentId]);
  }

  getImageUrl(suspect: Suspect): string {
    if (
      suspect.Images &&
      Array.isArray(suspect.Images) &&
      suspect.Images.length > 0
    ) {
      const firstImage = suspect.Images[0];
      if (firstImage && firstImage.url) {
        return this.strapiService.getImageUrl(firstImage.url);
      }
    }
    return '';
  }
}
