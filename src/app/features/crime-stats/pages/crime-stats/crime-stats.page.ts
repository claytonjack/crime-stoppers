import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonSelect,
  IonSelectOption,
  IonLabel,
  IonItem,
  IonSpinner,
} from '@ionic/angular/standalone';
import { NgxEchartsModule, NGX_ECHARTS_CONFIG } from 'ngx-echarts';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// ✅ Import and register ECharts modules (ESM-safe)
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
  CrimeByType,
  CrimeByMonth,
  TRACKED_CRIME_TYPE_LABELS,
} from '@app/features/crime-stats/services/crime-stats.service';
import { ThemeService } from '@app/core/pages/settings/services/theme.service';

type TrendDirection = 'up' | 'down' | 'flat';

@Component({
  selector: 'app-crime-stats',
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonSelect,
    IonSelectOption,
    IonLabel,
    IonItem,
    IonSpinner,
    NgxEchartsModule,
  ],
  // ✅ Required for standalone components using ngx-echarts
  providers: [{ provide: NGX_ECHARTS_CONFIG, useValue: { echarts } }],
  templateUrl: './crime-stats.page.html',
  styleUrls: ['./crime-stats.page.scss'],
})
export class CrimeStatsPage implements OnInit {
  private crimeStatsService = inject(CrimeStatsService);
  private themeService = inject(ThemeService);
  private destroyRef = inject(DestroyRef);

  selectedCity: string = 'all';
  loading = false;
  incidents: CrimeIncident[] = [];
  visibleIncidents: CrimeIncident[] = [];

  topCrimeType: CrimeByType | null = null;
  timelineSummary: TimelineSummary | null = null;

  crimeTypeChartOption: echarts.EChartsCoreOption = {};
  crimeTimelineChartOption: echarts.EChartsCoreOption = {};

  readonly cities = [
    { value: 'all', label: 'Halton Region' },
    { value: 'Oakville', label: 'Oakville' },
    { value: 'Burlington', label: 'Burlington' },
    { value: 'Milton', label: 'Milton' },
    { value: 'Halton Hills', label: 'Halton Hills' },
  ];

  private readonly excludedCrimeKeywords = [
    'roadside test',
    'roadside screening',
  ];
  private readonly trackedCrimeTypes = TRACKED_CRIME_TYPE_LABELS;
  private readonly trackedCrimeTypeSet = new Set(TRACKED_CRIME_TYPE_LABELS);

  ngOnInit() {
    this.themeService.theme$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.updateCharts());
    this.loadCrimeData();
  }

  onCityChange(event: any) {
    this.selectedCity = event.detail.value;
    this.loadCrimeData();
  }

  loadCrimeData() {
    this.loading = true;
    const city = this.selectedCity === 'all' ? undefined : this.selectedCity;

    this.crimeStatsService.getCrimeIncidents(city).subscribe({
      next: (incidents) => {
        this.incidents = incidents;
        this.visibleIncidents = this.filterIncidents(incidents);
        this.updateCharts();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading crime data:', error);
        this.loading = false;
      },
    });
  }

  private updateCharts() {
    const incidents = this.visibleIncidents ?? [];
    this.updateCrimeTypeChart(incidents);
    this.updateCrimeTimelineChart(incidents);
  }

  private updateCrimeTypeChart(incidents: CrimeIncident[]) {
    const crimesByType =
      this.crimeStatsService.getCrimesByType(incidents) ?? [];
    const trackedCrimes = this.trackedCrimeTypes.map((label) => {
      const match = crimesByType.find((crime) => crime.type === label);
      return {
        type: label,
        count: match?.count ?? 0,
      };
    });
    const otherTotal = crimesByType
      .filter((crime) => !this.trackedCrimeTypeSet.has(crime.type))
      .reduce((sum, crime) => sum + crime.count, 0);
    const chartCrimes =
      otherTotal > 0
        ? [...trackedCrimes, { type: 'Other', count: otherTotal }]
        : trackedCrimes;
    this.topCrimeType = crimesByType[0] ?? chartCrimes[0] ?? null;

    const theme = this.getThemeTokens();

    this.crimeTypeChartOption = {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        backgroundColor: theme.tooltipBackground,
        borderColor: theme.tooltipBorder,
        textStyle: { color: theme.text },
      },
      grid: {
        left: '3%',
        right: '3%',
        bottom: '3%',
        top: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'value',
        axisLabel: { color: theme.subtleText, fontSize: 12 },
        splitLine: { lineStyle: { color: theme.gridLine } },
        axisLine: { lineStyle: { color: theme.gridLine } },
        axisTick: { show: false },
      },
      yAxis: {
        type: 'category',
        data: chartCrimes.map((c) => this.truncateLabel(c.type, 30)),
        axisLabel: {
          color: theme.text,
          fontSize: 12,
          lineHeight: 16,
        },
        axisLine: { show: false },
        axisTick: { show: false },
      },
      series: [
        {
          name: 'Incidents',
          type: 'bar',
          data: chartCrimes.map((c) => c.count),
          barWidth: 14,
          itemStyle: {
            color: theme.accent,
            borderRadius: [4, 4, 4, 4],
          },
          label: {
            show: true,
            position: 'right',
            fontSize: 11,
            color: theme.text,
          },
        },
      ],
    };
  }

  private updateCrimeTimelineChart(incidents: CrimeIncident[]) {
    const crimesByMonth =
      this.crimeStatsService.getCrimesByMonth(incidents) ?? [];
    const theme = this.getThemeTokens();

    this.timelineSummary = this.buildTimelineSummary(crimesByMonth);

    this.crimeTimelineChartOption = {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        backgroundColor: theme.tooltipBackground,
        borderColor: theme.tooltipBorder,
        textStyle: { color: theme.text },
      },
      grid: {
        left: '3%',
        right: '3%',
        bottom: '15%',
        top: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: crimesByMonth.map((c) => this.formatMonth(c.month)),
        axisLabel: {
          rotate: 45,
          color: theme.subtleText,
          fontSize: 11,
        },
        axisLine: { lineStyle: { color: theme.gridLine } },
        axisTick: { show: false },
      },
      yAxis: {
        type: 'value',
        axisLabel: { color: theme.subtleText, fontSize: 11 },
        splitLine: { lineStyle: { color: theme.gridLine } },
      },
      series: [
        {
          name: 'Total Crimes',
          type: 'line',
          data: crimesByMonth.map((c) => c.count),
          smooth: true,
          symbolSize: 8,
          lineStyle: { color: theme.line },
          itemStyle: {
            color: theme.line,
            borderWidth: 2,
            borderColor: theme.lineBorder,
          },
          areaStyle: {
            color: theme.lineArea,
          },
        },
      ],
    };
  }

  private filterIncidents(incidents: CrimeIncident[]): CrimeIncident[] {
    return incidents.filter((incident) => {
      const description = incident.DESCRIPTION?.toLowerCase() ?? '';
      return !this.excludedCrimeKeywords.some((keyword) =>
        description.includes(keyword)
      );
    });
  }

  private buildTimelineSummary(
    crimesByMonth: CrimeByMonth[]
  ): TimelineSummary | null {
    if (!crimesByMonth.length) {
      return null;
    }

    const latest = crimesByMonth[crimesByMonth.length - 1];
    const previous =
      crimesByMonth.length > 1 ? crimesByMonth[crimesByMonth.length - 2] : null;

    const label = this.formatMonth(latest.month);
    const previousLabel = previous ? this.formatMonth(previous.month) : null;
    const changePercent =
      previous && previous.count
        ? ((latest.count - previous.count) / previous.count) * 100
        : null;

    const trend: TrendDirection =
      changePercent === null
        ? 'flat'
        : changePercent > 0.5
        ? 'up'
        : changePercent < -0.5
        ? 'down'
        : 'flat';

    return {
      label,
      previousLabel,
      count: latest.count,
      changePercent,
      previousCount: previous?.count ?? null,
      trend,
    };
  }

  private truncateLabel(label: string, maxLength: number): string {
    return label.length > maxLength
      ? label.substring(0, maxLength) + '...'
      : label;
  }

  private formatMonth(monthKey: string): string {
    const [year, month] = monthKey.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
    });
  }

  private getThemeTokens(): ThemeTokens {
    const styles = getComputedStyle(document.documentElement);
    const accent = this.getCssValue(styles, '--app-accent-color', '#3880ff');
    const text = this.getCssValue(styles, '--app-text-color', '#1f2937');
    const secondaryVar = this.getCssValue(
      styles,
      '--app-text-color-secondary',
      ''
    );
    const cardBackground = this.getCssValue(
      styles,
      '--ion-card-background',
      '#ffffff'
    );

    const subtleText =
      secondaryVar || this.toRgba(text, 0.7, 'rgba(100, 116, 139, 0.9)');

    return {
      accent,
      text,
      subtleText,
      tooltipBackground: this.toRgba(
        cardBackground,
        0.96,
        'rgba(15, 23, 42, 0.92)'
      ),
      tooltipBorder: this.toRgba(accent, 0.4, 'rgba(56, 128, 255, 0.4)'),
      gridLine: this.toRgba(text, 0.15, 'rgba(148, 163, 184, 0.18)'),
      line: accent,
      lineBorder: this.toRgba(accent, 0.75, accent),
      lineArea: this.toRgba(accent, 0.18, 'rgba(37, 99, 235, 0.18)'),
    };
  }

  private getCssValue(
    styles: CSSStyleDeclaration,
    variable: string,
    fallback: string
  ): string {
    const value = styles.getPropertyValue(variable);
    return value?.trim() || fallback;
  }

  private toRgba(color: string, alpha: number, fallback: string): string {
    const rgb = this.parseColor(color);
    if (!rgb) {
      return fallback;
    }
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
  }

  private parseColor(
    color: string
  ): { r: number; g: number; b: number } | null {
    if (!color) {
      return null;
    }

    const normalized = color.trim();

    if (normalized.startsWith('#')) {
      let hex = normalized.slice(1);
      if (hex.length === 3) {
        hex = hex
          .split('')
          .map((char) => char + char)
          .join('');
      }

      if (hex.length !== 6) {
        return null;
      }

      const intVal = parseInt(hex, 16);
      return {
        r: (intVal >> 16) & 255,
        g: (intVal >> 8) & 255,
        b: intVal & 255,
      };
    }

    const rgbMatch =
      normalized.match(
        /rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*[\d.]+\s*)?\)/
      ) ?? null;

    if (rgbMatch) {
      return {
        r: Number(rgbMatch[1]),
        g: Number(rgbMatch[2]),
        b: Number(rgbMatch[3]),
      };
    }

    return null;
  }
}

interface TimelineSummary {
  label: string;
  previousLabel: string | null;
  count: number;
  changePercent: number | null;
  previousCount: number | null;
  trend: TrendDirection;
}

interface ThemeTokens {
  accent: string;
  text: string;
  subtleText: string;
  tooltipBackground: string;
  tooltipBorder: string;
  gridLine: string;
  line: string;
  lineBorder: string;
  lineArea: string;
}
