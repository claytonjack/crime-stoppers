import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
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

  private buildParams(additionalParams?: Record<string, string>): HttpParams {
    let params = new HttpParams()
      .set('locale', this.currentLocale)
      .set('populate', '*');

    if (additionalParams) {
      Object.entries(additionalParams).forEach(([key, value]) => {
        params = params.set(key, value);
      });
    }

    return params;
  }

  getSuspects(): Observable<StrapiResponse<Suspect[]>> {
    return this.http.get<StrapiResponse<Suspect[]>>(
      `${this.baseUrl}/suspects`,
      { params: this.buildParams() }
    );
  }

  getSuspectByDocumentId(
    documentId: string
  ): Observable<StrapiResponse<Suspect>> {
    return this.http.get<StrapiResponse<Suspect>>(
      `${this.baseUrl}/suspects/${documentId}`,
      { params: this.buildParams() }
    );
  }

  getAlerts(): Observable<StrapiResponse<Alert[]>> {
    return this.http.get<StrapiResponse<Alert[]>>(`${this.baseUrl}/alerts`, {
      params: this.buildParams(),
    });
  }

  getAlertByDocumentId(documentId: string): Observable<StrapiResponse<Alert>> {
    return this.http.get<StrapiResponse<Alert>>(
      `${this.baseUrl}/alerts/${documentId}`,
      { params: this.buildParams() }
    );
  }

  getEvents(): Observable<StrapiResponse<Event[]>> {
    return this.http.get<StrapiResponse<Event[]>>(`${this.baseUrl}/events`, {
      params: this.buildParams(),
    });
  }

  getEventByDocumentId(documentId: string): Observable<StrapiResponse<Event>> {
    return this.http.get<StrapiResponse<Event>>(
      `${this.baseUrl}/events/${documentId}`,
      { params: this.buildParams() }
    );
  }

  getImageUrl(imageUrl: string): string {
    if (!imageUrl) return '';
    if (imageUrl.startsWith('http')) return imageUrl;
    return `https://codeagainstcrime.com${imageUrl}`;
  }
}
