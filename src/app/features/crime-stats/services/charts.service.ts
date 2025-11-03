import { Injectable, inject } from '@angular/core';
import * as echarts from 'echarts/core';
import { EChartsCoreOption } from 'echarts/core';
import {
  CrimeByType,
  CrimeByTimeframe,
} from '@app/features/crime-stats/services/crime-stats.service';
import { CRIME_LABEL_ABBREVIATIONS } from '@app/features/crime-stats/models/crime-stats.model';
import { TranslateService } from '@ngx-translate/core';

interface ChartTheme {
  accent: string;
  accentBright: string;
  text: string;
  subtleText: string;
  tooltipBackground: string;
  tooltipBorder: string;
  gridLine: string;
  line: string;
  lineBright: string;
  lineBorder: string;
  lineAreaTop: string;
  lineAreaBottom: string;
}

@Injectable({
  providedIn: 'root',
})
export class ChartsService {
  private readonly translate = inject(TranslateService);

  getChartTheme(): ChartTheme {
    const styles = getComputedStyle(document.documentElement);
    const accent = this.getCssVar(styles, '--app-accent-color', '#3880ff');
    const text = this.getCssVar(styles, '--app-text-color', '#1f2937');
    const secondaryText = this.getCssVar(
      styles,
      '--app-text-color-secondary',
      ''
    );
    const cardBg = this.getCssVar(styles, '--ion-card-background', '#ffffff');

    const subtleText =
      secondaryText || this.toRgba(text, 0.7, 'rgba(100, 116, 139, 0.9)');

    return {
      accent,
      accentBright: this.brighten(accent, 1.15),
      text,
      subtleText,
      tooltipBackground: this.toRgba(cardBg, 0.98, 'rgba(15, 23, 42, 0.95)'),
      tooltipBorder: this.toRgba(accent, 0.3, 'rgba(56, 128, 255, 0.3)'),
      gridLine: this.toRgba(text, 0.12, 'rgba(148, 163, 184, 0.15)'),
      line: accent,
      lineBright: this.brighten(accent, 1.2),
      lineBorder: this.toRgba(accent, 0.85, accent),
      lineAreaTop: this.toRgba(accent, 0.35, 'rgba(37, 99, 235, 0.35)'),
      lineAreaBottom: this.toRgba(accent, 0.05, 'rgba(37, 99, 235, 0.05)'),
    };
  }

  createCrimeTypeChart(
    crimes: CrimeByType[],
    theme: ChartTheme
  ): EChartsCoreOption {
    const incidentsLabel = this.translate.instant(
      'feature.crimeStats.charts.series.incidents'
    );

    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        backgroundColor: theme.tooltipBackground,
        borderColor: theme.tooltipBorder,
        borderWidth: 1,
        textStyle: { color: theme.text, fontSize: 13 },
        padding: [10, 14],
        formatter: (params: any) => {
          const data = params[0];
          const fullType = crimes[data.dataIndex]?.type || data.name;
          return `<strong>${fullType}</strong><br/>${data.seriesName}: <strong>${data.value}</strong>`;
        },
      },
      grid: {
        left: 12,
        right: 28,
        bottom: 16,
        top: 16,
        containLabel: true,
      },
      xAxis: {
        type: 'value',
        axisLabel: { show: false },
        splitLine: { lineStyle: { color: theme.gridLine, type: 'dashed' } },
        axisLine: { show: false },
        axisTick: { show: false },
      },
      yAxis: {
        type: 'category',
        data: crimes.map((c) => this.formatCrimeLabel(c.type)),
        axisLabel: {
          color: theme.text,
          fontSize: 12,
          lineHeight: 18,
          margin: 10,
          fontWeight: 500,
          overflow: 'truncate',
          width: 160,
        },
        axisLine: { show: false },
        axisTick: { show: false },
      },
      series: [
        {
          name: incidentsLabel,
          type: 'bar',
          data: crimes.map((c) => c.count),
          barWidth: 12,
          barCategoryGap: '45%',
          itemStyle: { color: theme.accent, borderRadius: [0, 6, 6, 0] },
          label: {
            show: true,
            position: 'right',
            fontSize: 11,
            fontWeight: 600,
            color: theme.text,
            distance: 8,
          },
          emphasis: { itemStyle: { color: theme.accentBright } },
        },
      ],
    };
  }

  createTimelineChart(
    timelineData: CrimeByTimeframe[],
    theme: ChartTheme
  ): EChartsCoreOption {
    const totalCrimesLabel = this.translate.instant(
      'feature.crimeStats.charts.series.totalCrimes'
    );

    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        backgroundColor: theme.tooltipBackground,
        borderColor: theme.tooltipBorder,
        borderWidth: 1,
        textStyle: { color: theme.text, fontSize: 13 },
        padding: [10, 14],
        formatter: (params: any) => {
          const data = params[0];
          return `<strong>${data.name}</strong><br/>${data.seriesName}: <strong>${data.value}</strong>`;
        },
      },
      grid: {
        left: '3%',
        right: '3%',
        bottom: '18%',
        top: '5%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: timelineData.map((c) => c.label),
        axisLabel: {
          interval: 0,
          rotate: timelineData.length > 6 ? 45 : 0,
          color: theme.subtleText,
          fontSize: 11,
          margin: 12,
          align: timelineData.length > 6 ? 'right' : 'center',
          verticalAlign: timelineData.length > 6 ? 'top' : 'middle',
        },
        axisLine: { lineStyle: { color: theme.gridLine }, show: true },
        axisTick: { show: true, lineStyle: { color: theme.gridLine } },
      },
      yAxis: {
        type: 'value',
        axisLabel: { color: theme.subtleText, fontSize: 12, margin: 8 },
        splitLine: { lineStyle: { color: theme.gridLine, type: 'dashed' } },
        axisLine: { show: false },
      },
      series: [
        {
          name: totalCrimesLabel,
          type: 'line',
          data: timelineData.map((c) => c.count),
          smooth: true,
          smoothMonotone: 'x',
          symbolSize: 8,
          showSymbol: true,
          lineStyle: { color: theme.line, width: 3 },
          itemStyle: {
            color: theme.line,
            borderWidth: 3,
            borderColor: theme.lineBorder,
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: theme.lineAreaTop },
              { offset: 1, color: theme.lineAreaBottom },
            ]),
          },
          emphasis: {
            focus: 'series',
            itemStyle: {
              color: theme.lineBright,
              borderColor: theme.lineBorder,
              shadowBlur: 10,
              shadowColor: theme.lineAreaTop,
            },
          },
        },
      ],
    };
  }

  private formatCrimeLabel(label: string): string {
    if (CRIME_LABEL_ABBREVIATIONS[label]) {
      return CRIME_LABEL_ABBREVIATIONS[label];
    }
    return label.length > 26 ? label.substring(0, 23) + '...' : label;
  }

  private getCssVar(
    styles: CSSStyleDeclaration,
    variable: string,
    fallback: string
  ): string {
    return styles.getPropertyValue(variable)?.trim() || fallback;
  }

  private toRgba(color: string, alpha: number, fallback: string): string {
    const rgb = this.parseColor(color);
    return rgb ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})` : fallback;
  }

  private brighten(color: string, factor: number): string {
    const rgb = this.parseColor(color);
    if (!rgb) return color;

    const adjust = (val: number) => Math.min(255, Math.round(val * factor));
    return `rgb(${adjust(rgb.r)}, ${adjust(rgb.g)}, ${adjust(rgb.b)})`;
  }

  private parseColor(
    color: string
  ): { r: number; g: number; b: number } | null {
    if (!color?.trim()) return null;

    const normalized = color.trim();

    if (normalized.startsWith('#')) {
      let hex = normalized.slice(1);
      if (hex.length === 3) {
        hex = hex
          .split('')
          .map((c) => c + c)
          .join('');
      }
      if (hex.length !== 6) return null;

      const val = parseInt(hex, 16);
      return {
        r: (val >> 16) & 255,
        g: (val >> 8) & 255,
        b: val & 255,
      };
    }

    const match = normalized.match(
      /rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/
    );
    return match ? { r: +match[1], g: +match[2], b: +match[3] } : null;
  }
}
