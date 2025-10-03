import {
  Component,
  OnInit,
  inject,
  ViewChild,
  signal,
  computed,
} from '@angular/core';
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
  IonSearchbar,
  IonButton,
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgIcon } from '@ng-icons/core';
import { HeaderComponent } from 'src/app/core/components/header/header.component';
import { StrapiService } from 'src/app/core/services/strapi.service';
import { StrapiResponse } from 'src/app/core/models/strapi.model';
import { Suspect } from 'src/app/features/suspects/models/suspect.model';
import { SuspectsFilterComponent } from 'src/app/features/suspects/components/suspects-filter.component';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
@Component({
  selector: 'app-suspects',
  templateUrl: './suspects.page.html',
  styleUrls: ['./suspects.page.scss'],
  standalone: true,
  imports: [
    NgIcon,
    HeaderComponent,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonCardSubtitle,
    IonImg,
    IonCardHeader,
    IonCardTitle,
    IonList,
    IonContent,
    IonCard,
    IonSearchbar,
    IonButton,
    FormsModule,
    CommonModule,
  ],
  providers: [PopoverController],
})
export class SuspectsPage implements OnInit {
  private readonly strapiService = inject(StrapiService);
  private readonly router = inject(Router);
  private readonly popoverController = inject(PopoverController);

  private readonly allSuspects = signal<Suspect[]>([]);
  readonly isLoading = signal<boolean>(false);
  readonly hasMoreData = signal<boolean>(true);

  readonly searchTerm = signal<string>('');
  get searchQuery() {
    return this.searchTerm();
  }
  set searchQuery(value: string) {
    this.searchTerm.set(value);
  }

  readonly selectedScene = signal<string>('');

  readonly filteredSuspects = computed(() => {
    let suspects = this.allSuspects();
    const search = this.searchTerm().toLowerCase();
    if (search) {
      suspects = suspects.filter(
        (suspect) =>
          suspect.Name.toLowerCase().includes(search) ||
          suspect.Crime.toLowerCase().includes(search) ||
          suspect.Scene.toLowerCase().includes(search)
      );
    }
    const scene = this.selectedScene();
    if (scene) {
      suspects = suspects.filter((suspect) => suspect.Scene === scene);
    }
    return suspects;
  });
  readonly availableScenes = [
    'Oakville',
    'Burlington',
    'Milton',
    'Halton Hills',
  ];

  onSearchChange(event: any) {
    this.searchTerm.set(event.detail?.value ?? event.target?.value ?? '');
  }

  async openFilterPopover(event: Event) {
    const popover = await this.popoverController.create({
      component: SuspectsFilterComponent,
      event: event,
      translucent: true,
      componentProps: {
        selectedScene: this.selectedScene(),
        scenes: this.availableScenes,
        onSceneChange: (scene: string) => this.onSceneChange(scene),
        clearFilters: () => this.clearFilters(),
      },
    });
    await popover.present();
  }

  onSceneChange(scene: string) {
    this.selectedScene.set(scene);
  }

  clearFilters() {
    this.selectedScene.set('');
    this.searchTerm.set('');
  }

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
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
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
    this.router.navigate(['/suspects/details', suspect.documentId]);
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
