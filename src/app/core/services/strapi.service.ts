import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { StrapiResponse } from 'src/app/core/models/strapi.model';
import { Suspect } from 'src/app/features/suspects/models/suspect.model';
import { Alert } from 'src/app/features/alerts/models/alert.model';
import { Event } from 'src/app/features/events/models/event.model';

export { Suspect } from 'src/app/features/suspects/models/suspect.model';
export { Alert } from 'src/app/features/alerts/models/alert.model';
export { Event } from 'src/app/features/events/models/event.model';

export type LanguageOption = 'en' | 'fr-CA' | 'es';

const LOCALE_MAP: Record<LanguageOption, string> = {
  en: 'en',
  'fr-CA': 'fr-CA',
  es: 'es',
};

@Injectable({ providedIn: 'root' })
export class StrapiService {
  private readonly http = inject(HttpClient);
  private baseUrl = 'https://codeagainstcrime.com/api';
  private currentLocale: string = 'en';

  setLocale(language: LanguageOption): void {
    this.currentLocale = LOCALE_MAP[language] || 'en';
  }

  getCurrentLocale(): string {
    return this.currentLocale;
  }

  private buildParams(
    additionalParams?: Record<string, string>,
    localeOverride?: string
  ): HttpParams {
    let params = new HttpParams()
      .set('locale', localeOverride ?? this.currentLocale)
      .set('populate', '*');

    if (additionalParams) {
      Object.entries(additionalParams).forEach(([key, value]) => {
        params = params.set(key, value);
      });
    }

    return params;
  }

  private mergeWithFallback<T>(primary?: T[], fallback?: T[]): T[] {
    const merged = new Map<string | number, T>();

    const setItem = (item: any) => {
      if (!item) {
        return;
      }
      const key = item.documentId ?? item.id;
      if (key === undefined || key === null) {
        return;
      }
      merged.set(key, item);
    };

    fallback?.forEach(setItem);
    primary?.forEach(setItem);

    return Array.from(merged.values());
  }

  private getCollectionWithFallback<T extends { documentId?: string | number }>(
    endpoint: string
  ): Observable<StrapiResponse<T[]>> {
    if (this.currentLocale === 'en') {
      return this.http.get<StrapiResponse<T[]>>(
        `${this.baseUrl}/${endpoint}`,
        { params: this.buildParams(undefined, 'en') }
      );
    }

    const current$ = this.http.get<StrapiResponse<T[]>>(
      `${this.baseUrl}/${endpoint}`,
      { params: this.buildParams(undefined, this.currentLocale) }
    );
    const fallback$ = this.http.get<StrapiResponse<T[]>>(
      `${this.baseUrl}/${endpoint}`,
      { params: this.buildParams(undefined, 'en') }
    );

    return forkJoin({ current: current$, fallback: fallback$ }).pipe(
      map(({ current, fallback }) => ({
        data: this.mergeWithFallback(current?.data, fallback?.data),
        meta: current?.meta ?? fallback?.meta,
      }))
    );
  }

  private getSingleWithFallback<T>(
    endpoint: string,
    documentId: string
  ): Observable<StrapiResponse<T>> {
    if (this.currentLocale === 'en') {
      return this.http.get<StrapiResponse<T>>(
        `${this.baseUrl}/${endpoint}/${documentId}`,
        { params: this.buildParams(undefined, 'en') }
      );
    }

    const fetchFallback = () =>
      this.http.get<StrapiResponse<T>>(
        `${this.baseUrl}/${endpoint}/${documentId}`,
        { params: this.buildParams(undefined, 'en') }
      );

    return this.http
      .get<StrapiResponse<T>>(
        `${this.baseUrl}/${endpoint}/${documentId}`,
        { params: this.buildParams(undefined, this.currentLocale) }
      )
      .pipe(
        switchMap((response) => {
          if (response?.data) {
            return of(response);
          }
          return fetchFallback();
        }),
        catchError(() => fetchFallback())
      );
  }

  getSuspects(): Observable<StrapiResponse<Suspect[]>> {
    return this.getCollectionWithFallback<Suspect>('suspects');
  }

  getSuspectByDocumentId(
    documentId: string
  ): Observable<StrapiResponse<Suspect>> {
    return this.getSingleWithFallback<Suspect>('suspects', documentId);
  }

  getAlerts(): Observable<StrapiResponse<Alert[]>> {
    return this.getCollectionWithFallback<Alert>('alerts');
  }

  getAlertByDocumentId(documentId: string): Observable<StrapiResponse<Alert>> {
    return this.getSingleWithFallback<Alert>('alerts', documentId);
  }

  getEvents(): Observable<StrapiResponse<Event[]>> {
    return this.getCollectionWithFallback<Event>('events');
  }

  getEventByDocumentId(documentId: string): Observable<StrapiResponse<Event>> {
    return this.getSingleWithFallback<Event>('events', documentId);
  }

  getImageUrl(imageUrl: string): string {
    if (!imageUrl) return '';
    if (imageUrl.startsWith('http')) return imageUrl;
    return `https://codeagainstcrime.com${imageUrl}`;
  }
}
