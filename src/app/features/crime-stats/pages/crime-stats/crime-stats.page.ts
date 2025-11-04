import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from 'src/app/core/components/header/header.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonSelect,
  IonSelectOption,
  IonSpinner,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { NgxEchartsModule, NGX_ECHARTS_CONFIG } from 'ngx-echarts';
import * as echarts from 'echarts/core';
import { use } from 'echarts/core';
import { BarChart, LineChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  BarChart,
  LineChart,
  CanvasRenderer,
]);

import {
  CrimeStatsService,
  CrimeIncident,
  CrimeByTimeframe,
} from '@app/features/crime-stats/services/crime-stats.service';
import { ThemeService } from '@app/core/pages/settings/services/theme.service';
import { ChartsService } from '@app/features/crime-stats/services/charts.service';
import {
  CITIES,
  CRIME_CATEGORIES,
  CRIME_CATEGORY_MAPPING,
  TimelineSummary,
  TIMEFRAMES,
  TimeframeValue,
} from '@app/features/crime-stats/models/crime-stats.model';
import { ScreenReaderService } from '@app/core/pages/settings/services/screen-reader.service';

@Component({
  selector: 'app-crime-stats',
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    HeaderComponent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonSelect,
    IonSelectOption,
    IonSpinner,
    NgxEchartsModule,
    TranslateModule,
  ],
  providers: [{ provide: NGX_ECHARTS_CONFIG, useValue: { echarts } }],
  templateUrl: './crime-stats.page.html',
  styleUrls: ['./crime-stats.page.scss'],
})
export class CrimeStatsPage implements OnInit {
  private crimeStatsService = inject(CrimeStatsService);
  private themeService = inject(ThemeService);
  private chartsService = inject(ChartsService);
  private destroyRef = inject(DestroyRef);
  private readonly screenReader = inject(ScreenReaderService);

  selectedCity = 'all';
  selectedCategory = 'all';
  selectedTimeframe: TimeframeValue = 'year';
  loading = false;

  incidents: CrimeIncident[] = [];
  visibleIncidents: CrimeIncident[] = [];
  timelineSummary: TimelineSummary | null = null;
  timelineData: CrimeByTimeframe[] = [];

  crimeTypeChartOption: echarts.EChartsCoreOption = {};
  crimeTimelineChartOption: echarts.EChartsCoreOption = {};
  crimeTypeChartHeight = 420;

  readonly cities = CITIES;
  readonly categories = CRIME_CATEGORIES;
  readonly timeframes = TIMEFRAMES;
  readonly selectInterfaceOptions = { side: 'end' as const };

  ngOnInit() {
    this.themeService.theme$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.updateCharts());

    this.loadCrimeData();
    this.announcePage();
  }

  private async announcePage() {
    await this.screenReader.speak('Crime Stats page loaded.');
    await this.screenReader.speak(
      'You can filter incidents by location, category, and timeframe, and view charts summarizing recent crime data.'
    );

    //Announce empty state if data not loaded yet
    if (!this.visibleIncidents.length && !this.loading) {
      await this.screenReader.speak(
        'No crime incidents available for the selected filters.'
      );
    }
  }

  onCityChange(event: any) {
    this.selectedCity = event.detail.value;
    this.loadCrimeData();
  }

  onCategoryChange(event: any) {
    this.selectedCategory = event.detail.value;
    this.applyFilters();
  }

  onTimeframeChange(event: any) {
    this.selectedTimeframe = event.detail.value;
    this.applyFilters();
  }

  private loadCrimeData() {
    this.loading = true;
    const city = this.selectedCity === 'all' ? undefined : this.selectedCity;

    this.crimeStatsService.getCrimeIncidents(city).subscribe({
      next: (incidents) => {
        this.incidents = incidents;
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading crime data:', error);
        this.loading = false;
      },
    });
  }

  private applyFilters() {
    const normalizedAllowedTypes =
      this.selectedCategory === 'all'
        ? null
        : new Set(
            (CRIME_CATEGORY_MAPPING[this.selectedCategory] || []).map((t) =>
              t.toLowerCase()
            )
          );

    const categoryFiltered = normalizedAllowedTypes
      ? this.incidents.filter((incident) => {
          const formattedType = this.crimeStatsService.formatCrimeTypePublic(
            incident.DESCRIPTION
          );
          return normalizedAllowedTypes.has(formattedType.toLowerCase());
        })
      : this.incidents;

    this.timelineData = this.crimeStatsService.getCrimesByTimeframe(
      categoryFiltered,
      this.selectedTimeframe
    );

    if (this.timelineData.length) {
      const timeframeStart = this.timelineData[0].rangeStart;
      const timeframeEnd =
        this.timelineData[this.timelineData.length - 1].rangeEnd;
      this.visibleIncidents = categoryFiltered.filter((incident) => {
        const timestamp = this.getIncidentTimestamp(incident);
        if (timestamp === null) return false;
        const normalized = this.normalizeTimestamp(timestamp);
        return normalized >= timeframeStart && normalized <= timeframeEnd;
      });
    } else {
      this.visibleIncidents = [];
    }

    this.updateCharts();

    //Announce updated results
    this.announceFilterResults();
  }

  private async announceFilterResults() {
    if (!this.visibleIncidents.length) {
      await this.screenReader.speak('No incidents match the current filters.');
    } else {
      await this.screenReader.speak(
        `${this.visibleIncidents.length} incidents found for the selected filters.`
      );
    }
  }

  private updateCharts() {
    const theme = this.chartsService.getChartTheme();

    const crimesByType = this.crimeStatsService.getCrimesByType(
      this.visibleIncidents,
      { includeEmptyTypes: false }
    );

    this.crimeTypeChartHeight = this.calculateCrimeTypeChartHeight(
      crimesByType.length
    );

    this.crimeTypeChartOption = crimesByType.length
      ? this.chartsService.createCrimeTypeChart(crimesByType, theme)
      : {};

    if (this.timelineData.length) {
      this.timelineSummary = this.buildTimelineSummary(this.timelineData);
      this.crimeTimelineChartOption = this.chartsService.createTimelineChart(
        this.timelineData,
        theme
      );
    } else {
      this.timelineSummary = null;
      this.crimeTimelineChartOption = {};
    }
  }

  private buildTimelineSummary(
    data: CrimeByTimeframe[]
  ): TimelineSummary | null {
    if (!data.length) return null;

    const latest = data[data.length - 1];
    const previous = data.length > 1 ? data[data.length - 2] : null;

    const changePercent = previous?.count
      ? ((latest.count - previous.count) / previous.count) * 100
      : null;

    const trend =
      changePercent === null
        ? 'flat'
        : changePercent > 0.5
        ? 'up'
        : changePercent < -0.5
        ? 'down'
        : 'flat';

    return {
      label: latest.label,
      previousLabel: previous ? previous.label : null,
      count: latest.count,
      changePercent,
      previousCount: previous?.count ?? null,
      trend,
    };
  }

  private getIncidentTimestamp(incident: CrimeIncident): number | null {
    if (!incident?.DATE) {
      return null;
    }

    if (typeof incident.DATE === 'number') {
      return incident.DATE;
    }

    const numeric = Number(incident.DATE);
    if (!Number.isNaN(numeric)) {
      return numeric;
    }

    const parsed = new Date(incident.DATE);
    const time = parsed.getTime();
    return Number.isNaN(time) ? null : time;
  }

  private normalizeTimestamp(timestamp: number): number {
    const normalized = new Date(timestamp);
    normalized.setHours(0, 0, 0, 0);
    return normalized.getTime();
  }

  private calculateCrimeTypeChartHeight(categoryCount: number): number {
    if (!categoryCount) {
      return 220;
    }
    const baseHeight = 220;
    const perCategoryHeight = 34;
    const buffer = 80;
    return Math.max(baseHeight, categoryCount * perCategoryHeight + buffer);
  }
}
