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
import { TranslateModule } from '@ngx-translate/core';
import { ScreenReaderService } from 'src/app/core/pages/settings/services/screen-reader.service';
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
    TranslateModule,
  ],
  providers: [PopoverController],
})
export class SuspectsPage implements OnInit {
  private readonly strapiService = inject(StrapiService);
  private readonly router = inject(Router);
  private readonly popoverController = inject(PopoverController);
  private readonly screenReader = inject(ScreenReaderService);

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

  async onSearchChange(event: any) {
    this.searchTerm.set(event.detail?.value ?? event.target?.value ?? '');
    await this.screenReader.speak(
      this.searchTerm()
        ? `Searching for ${this.searchTerm()}`
        : 'Search cleared'
    );
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
    await this.screenReader.speak('Filter popover opened');
  }

  async onSceneChange(scene: string) {
    this.selectedScene.set(scene);
    await this.screenReader.speak(
      scene ? `Filter applied: ${scene}` : 'Filters cleared'
    );
  }

  async clearFilters() {
    this.selectedScene.set('');
    this.searchTerm.set('');
    await this.screenReader.speak('Filters cleared');
  }

  async loadMore(event: any) {
    try {
      event?.target?.complete?.();
      if (!this.hasMoreData()) {
        if (event?.target) event.target.disabled = true;
      }
    } catch (err) {}
  }

  async ngOnInit() {
    await this.loadSuspects();
    await this.screenReader.speak('Suspects loaded');
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
        await this.screenReader.speak(
          `${sortedSuspects.length} suspects loaded`
        );
      }
    } catch (error) {
      await this.screenReader.speak('Failed to load suspects');
    }
    this.isLoading.set(false);
  }

  async navigateToDetails(suspect: Suspect) {
    await this.screenReader.speak(`Opening details for ${suspect.Name}`);
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
