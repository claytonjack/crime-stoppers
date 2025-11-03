import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { TimeframeValue } from '@app/features/crime-stats/models/crime-stats.model';

export interface CrimeIncident {
  OBJECTID: number;
  CASE_NO: string;
  DATE: number; // Unix timestamp
  DESCRIPTION: string;
  LOCATION: string;
  CITY: string;
  Latitude: string;
  Longitude: string;
}

export interface ArcGISResponse {
  features?: Array<{
    attributes: CrimeIncident;
  }>;
}

export interface CrimeByType {
  type: string;
  count: number;
}

export interface CrimeByTimeframe {
  key: string;
  label: string;
  count: number;
  rangeStart: number;
  rangeEnd: number;
}

export const TRACKED_CRIME_TYPE_LABELS: readonly string[] = [
  'Arson',
  'Attempt Murder',
  'Break and Enter House',
  'Break and Enter Other',
  'Break and Enter Shop',
  'Break and Enter School',
  'Dangerous Operation - Traffic',
  'Federal Stats - Drugs',
  'Homicide',
  'Impaired Driving',
  'MVC - Fatality',
  'MVC - Hit & Run',
  'MVC - PI',
  'Offensive Weapons',
  'Property Damage Over $5,000',
  'Property Damage Under $5,000',
  'Recovered Vehicle Oth Service',
  'Robbery',
  'Theft From Auto',
  'Theft of Bicycle',
  'Theft of Vehicle',
  'Theft Over',
  'Theft Under',
];

const CRIME_TYPE_DISPLAY_LOOKUP = new Map<string, string>([
  ['arson', 'Arson'],
  ['attempt murder', 'Attempt Murder'],
  ['break and enter house', 'Break and Enter House'],
  ['break and enter other', 'Break and Enter Other'],
  ['break and enter shop', 'Break and Enter Shop'],
  ['break and enter school', 'Break and Enter School'],
  ['dangerous operation - traffic', 'Dangerous Operation - Traffic'],
  ['federal stats - drugs', 'Federal Stats - Drugs'],
  ['homicide', 'Homicide'],
  ['impaired driving', 'Impaired Driving'],
  ['mvc - fatality', 'MVC - Fatality'],
  ['mvc - hit & run', 'MVC - Hit & Run'],
  ['mvc - pi', 'MVC - PI'],
  ['offensive weapons', 'Offensive Weapons'],
  ['property damage over $5,000', 'Property Damage Over $5,000'],
  ['property damage under $5,000', 'Property Damage Under $5,000'],
  ['property damage over $5000', 'Property Damage Over $5,000'],
  ['property damage under $5000', 'Property Damage Under $5,000'],
  ['recovered vehicle oth service', 'Recovered Vehicle Oth Service'],
  ['robbery', 'Robbery'],
  ['theft from auto', 'Theft From Auto'],
  ['theft of bicycle', 'Theft of Bicycle'],
  ['theft of vehicle', 'Theft of Vehicle'],
  ['theft over', 'Theft Over'],
  ['theft under', 'Theft Under'],
]);

const LOWERCASE_WORDS = new Set(['and', 'of', 'the', 'in', 'on', 'at']);

const UPPERCASE_WORDS = new Map<string, string>([
  ['mvc', 'MVC'],
  ['pi', 'PI'],
]);

@Injectable({
  providedIn: 'root',
})
export class CrimeStatsService {
  private http = inject(HttpClient);
  private readonly baseUrl =
    'https://services2.arcgis.com/o1LYr96CpFkfsDJS/arcgis/rest/services/Crime_Map/FeatureServer/0/query';
  private readonly pageSize = 2000;
  private readonly roadsideExclusion = "DESCRIPTION NOT LIKE '%ROADSIDE%'";

  /**
   * Fetch crime incidents with optional city filter
   */
  getCrimeIncidents(city?: string): Observable<CrimeIncident[]> {
    const where = this.buildWhereClause(city);
    return this.fetchCrimeIncidents(where);
  }

  /**
   * Process incidents to get crime counts by type
   */
  getCrimesByType(
    incidents: CrimeIncident[],
    options?: { includeEmptyTypes?: boolean }
  ): CrimeByType[] {
    const { includeEmptyTypes = true } = options ?? {};
    const typeCounts = new Map<string, number>();

    incidents.forEach((incident) => {
      const type = this.formatCrimeType(incident.DESCRIPTION || 'Unknown');
      typeCounts.set(type, (typeCounts.get(type) || 0) + 1);
    });

    if (includeEmptyTypes) {
      TRACKED_CRIME_TYPE_LABELS.forEach((type) => {
        if (!typeCounts.has(type)) {
          typeCounts.set(type, 0);
        }
      });
    }

    return Array.from(typeCounts.entries())
      .map(([type, count]) => ({ type, count }))
      .filter((entry) => includeEmptyTypes || entry.count > 0)
      .sort((a, b) => b.count - a.count);
  }

  /**
   * Convert crime type from ALL CAPS to Title Case (public method)
   */
  formatCrimeTypePublic(description: string): string {
    return this.formatCrimeType(description);
  }

  private buildWhereClause(city?: string): string {
    const clauses = [this.roadsideExclusion];
    if (city) {
      const sanitizedCity = city.replace(/'/g, "''");
      clauses.unshift(`CITY='${sanitizedCity}'`);
    }
    return clauses.join(' AND ');
  }

  private fetchCrimeIncidents(
    where: string,
    offset = 0,
    acc: CrimeIncident[] = []
  ): Observable<CrimeIncident[]> {
    const params = new HttpParams()
      .set('where', where)
      .set('outFields', '*')
      .set('f', 'json')
      .set('orderByFields', 'OBJECTID')
      .set('resultRecordCount', String(this.pageSize))
      .set('resultOffset', String(offset));

    return this.http.get<ArcGISResponse>(this.baseUrl, { params }).pipe(
      switchMap((response) => {
        if (!response || !Array.isArray(response.features)) {
          console.error('Invalid response:', response);
          return of(acc);
        }

        const incidents = response.features.map(
          (feature) => feature.attributes
        );
        const mergedIncidents = [...acc, ...incidents];

        if (incidents.length < this.pageSize) {
          return of(mergedIncidents);
        }

        return this.fetchCrimeIncidents(
          where,
          offset + this.pageSize,
          mergedIncidents
        );
      })
    );
  }

  /**
   * Convert crime type from ALL CAPS to Title Case
   */
  private formatCrimeType(description: string): string {
    const raw = description?.trim() ?? '';
    if (!raw) {
      return 'Unknown';
    }

    const normalized = raw.toLowerCase();
    const mapped = CRIME_TYPE_DISPLAY_LOOKUP.get(normalized);
    if (mapped) {
      return mapped;
    }

    const tokens = normalized.split(/\s+/);
    const formatted = tokens.map((token, index) => {
      if (UPPERCASE_WORDS.has(token)) {
        return UPPERCASE_WORDS.get(token)!;
      }

      if (index > 0 && LOWERCASE_WORDS.has(token)) {
        return token;
      }

      if (!token) {
        return token;
      }

      return token.charAt(0).toUpperCase() + token.slice(1);
    });

    return formatted.join(' ');
  }

  /**
   * Process incidents to get crime counts by month
   */
  getCrimesByTimeframe(
    incidents: CrimeIncident[],
    timeframe: TimeframeValue
  ): CrimeByTimeframe[] {
    if (!incidents.length) {
      return [];
    }

    const referenceDate = this.getReferenceDate();

    if (timeframe === 'month') {
      return this.buildWeeklyTimeline(incidents, referenceDate);
    }

    return this.buildMonthlyTimeline(incidents, timeframe, referenceDate);
  }

  private getMonthDiff(reference: Date, target: Date): number {
    return (
      (reference.getFullYear() - target.getFullYear()) * 12 +
      (reference.getMonth() - target.getMonth())
    );
  }

  private normalizeDate(date: Date): Date {
    const normalized = new Date(date);
    normalized.setHours(0, 0, 0, 0);
    return normalized;
  }

  private getReferenceDate(): Date {
    return this.normalizeDate(new Date());
  }

  private buildWeeklyTimeline(
    incidents: CrimeIncident[],
    referenceDate: Date
  ): CrimeByTimeframe[] {
    const monthStart = this.getStartOfMonth(referenceDate);
    const totalWeeks = Math.max(1, Math.ceil(referenceDate.getDate() / 7));
    const buckets: CrimeByTimeframe[] = [];
    const millisPerDay = 24 * 60 * 60 * 1000;

    for (let index = 0; index < totalWeeks; index++) {
      const start = this.addDays(monthStart, index * 7);
      let end = this.addDays(start, 6);
      if (end > referenceDate) {
        end = referenceDate;
      }

      const key = `month-week-${start.getFullYear()}-${String(
        start.getMonth() + 1
      ).padStart(2, '0')}-${String(start.getDate()).padStart(2, '0')}`;

      buckets.push({
        key,
        label: this.formatWeekLabel(index, start, end),
        count: 0,
        rangeStart: start.getTime(),
        rangeEnd: end.getTime(),
      });
    }

    incidents.forEach((incident) => {
      const date = this.normalizeIncidentDate(incident);
      if (!date) return;
      if (date < monthStart || date > referenceDate) return;

      const diffDays = Math.floor(
        (date.getTime() - monthStart.getTime()) / millisPerDay
      );
      let bucketIndex = Math.floor(diffDays / 7);
      if (bucketIndex >= buckets.length) {
        bucketIndex = buckets.length - 1;
      }
      if (bucketIndex < 0) {
        bucketIndex = 0;
      }
      buckets[bucketIndex].count += 1;
    });

    return buckets;
  }

  private buildMonthlyTimeline(
    incidents: CrimeIncident[],
    timeframe: 'quarter' | 'year',
    referenceDate: Date
  ): CrimeByTimeframe[] {
    const buckets: CrimeByTimeframe[] = [];
    const bucketMap = new Map<string, CrimeByTimeframe>();

    if (timeframe === 'quarter') {
      for (let offset = 2; offset >= 0; offset--) {
        const start = this.getStartOfMonth(
          new Date(referenceDate.getFullYear(), referenceDate.getMonth() - offset, 1)
        );
        const end = this.getEndOfMonth(start);
        const key = this.getMonthKey(start);
        const bucket = {
          key,
          label: this.formatMonthLabel(start),
          count: 0,
          rangeStart: start.getTime(),
          rangeEnd: end.getTime(),
        };
        buckets.push(bucket);
        bucketMap.set(key, bucket);
      }
    } else {
      const minAllowedStart = this.getStartOfMonth(
        new Date(referenceDate.getFullYear(), referenceDate.getMonth() - 12, 1)
      );
      const earliestDate =
        this.findEarliestIncidentDate(incidents, minAllowedStart) ??
        referenceDate;

      let cursor = this.getStartOfMonth(
        earliestDate.getTime() < minAllowedStart.getTime()
          ? minAllowedStart
          : earliestDate
      );
      const months: Date[] = [];
      while (cursor <= referenceDate) {
        months.push(new Date(cursor));
        cursor = this.getStartOfMonth(
          new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1)
        );
      }

      if (months.length > 1) {
        months.shift();
      }

      if (!months.length) {
        months.push(this.getStartOfMonth(referenceDate));
      }

      months.forEach((start) => {
        const end = this.getEndOfMonth(start);
        const key = this.getMonthKey(start);
        const bucket = {
          key,
          label: this.formatMonthLabel(start),
          count: 0,
          rangeStart: start.getTime(),
          rangeEnd: end.getTime(),
        };
        buckets.push(bucket);
        bucketMap.set(key, bucket);
      });
    }

    incidents.forEach((incident) => {
      const date = this.normalizeIncidentDate(incident);
      if (!date) return;
      if (date > referenceDate) return;

      const key = this.getMonthKey(date);
      const bucket = bucketMap.get(key);
      if (!bucket) return;

      if (timeframe === 'quarter') {
        const diffMonths = this.getMonthDiff(referenceDate, date);
        if (diffMonths > 2) return;
      } else {
        const earliestStart = buckets[0]?.rangeStart ?? 0;
        if (date.getTime() < earliestStart) return;
      }

      bucket.count += 1;
    });

    return buckets;
  }

  private normalizeIncidentDate(incident: CrimeIncident): Date | null {
    if (!incident?.DATE) return null;
    const value =
      typeof incident.DATE === 'number'
        ? incident.DATE
        : Number(incident.DATE);
    if (Number.isNaN(value)) return null;
    return this.normalizeDate(new Date(value));
  }

  private getStartOfMonth(date: Date): Date {
    return this.normalizeDate(new Date(date.getFullYear(), date.getMonth(), 1));
  }

  private getEndOfMonth(date: Date): Date {
    return this.normalizeDate(
      new Date(date.getFullYear(), date.getMonth() + 1, 0)
    );
  }

  private addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return this.normalizeDate(result);
  }

  private formatWeekLabel(index: number, start: Date, end: Date): string {
    return `Week ${index + 1}`;
  }

  private formatWeekRange(start: Date, end: Date): string {
    const sameMonth =
      start.getMonth() === end.getMonth() &&
      start.getFullYear() === end.getFullYear();

    const startLabel = start.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
    const endLabel = end.toLocaleDateString(
      'en-US',
      sameMonth
        ? { day: 'numeric' }
        : { month: 'short', day: 'numeric' }
    );

    return `${startLabel} – ${endLabel} ${end.getFullYear()}`;
  }

  private formatMonthLabel(date: Date): string {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    });
  }

  private getMonthKey(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      '0'
    )}`;
  }

  private findEarliestIncidentDate(
    incidents: CrimeIncident[],
    minAllowedStart: Date
  ): Date | null {
    const minTime = minAllowedStart.getTime();
    let earliest: Date | null = null;
    incidents.forEach((incident) => {
      const date = this.normalizeIncidentDate(incident);
      if (!date) return;
      if (date.getTime() < minTime) return;
      if (!earliest || date < earliest) {
        earliest = date;
      }
    });
    return earliest;
  }

}
