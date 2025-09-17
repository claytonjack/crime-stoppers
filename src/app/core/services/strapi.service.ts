import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StrapiResponse } from '../models/strapi.model';
import { Suspect } from '../../features/suspects/models/suspect.model';
import { Alert } from '../../features/alerts/models/alert.model';
import { Event } from '../../features/events/models/event.model';

export { Suspect } from '../../features/suspects/models/suspect.model';
export { Alert } from '../../features/alerts/models/alert.model';
export { Event } from '../../features/events/models/event.model';

@Injectable({ providedIn: 'root' })
export class StrapiService {
  private readonly http = inject(HttpClient);
  private baseUrl = 'https://codeagainstcrime.com/api';

  getSuspects(): Observable<StrapiResponse<Suspect[]>> {
    return this.http.get<StrapiResponse<Suspect[]>>(
      `${this.baseUrl}/suspects?populate=*`
    );
  }

  getSuspectByDocumentId(
    documentId: string
  ): Observable<StrapiResponse<Suspect>> {
    return this.http.get<StrapiResponse<Suspect>>(
      `${this.baseUrl}/suspects/${documentId}?populate=*`
    );
  }

  getAlerts(): Observable<StrapiResponse<Alert[]>> {
    return this.http.get<StrapiResponse<Alert[]>>(
      `${this.baseUrl}/alerts?populate=*`
    );
  }

  getAlertByDocumentId(documentId: string): Observable<StrapiResponse<Alert>> {
    return this.http.get<StrapiResponse<Alert>>(
      `${this.baseUrl}/alerts/${documentId}?populate=*`
    );
  }

  getEvents(): Observable<StrapiResponse<Event[]>> {
    return this.http.get<StrapiResponse<Event[]>>(
      `${this.baseUrl}/events?populate=*`
    );
  }

  getEventByDocumentId(documentId: string): Observable<StrapiResponse<Event>> {
    return this.http.get<StrapiResponse<Event>>(
      `${this.baseUrl}/events/${documentId}?populate=*`
    );
  }

  getImageUrl(imageUrl: string): string {
    if (!imageUrl) return '';
    if (imageUrl.startsWith('http')) return imageUrl;
    return `https://codeagainstcrime.com${imageUrl}`;
  }
}
