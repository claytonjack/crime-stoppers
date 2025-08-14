import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StrapiResponse } from '../models';
import { Suspect } from '../../features/suspects/models';
import { Alert } from '../../features/alerts/models';
import { Event } from '../../features/events/models';

export { Suspect } from '../../features/suspects/models';
export { Alert } from '../../features/alerts/models';
export { Event } from '../../features/events/models';

@Injectable({ providedIn: 'root' })
export class StrapiService {
  private baseUrl = 'https://codeagainstcrime.com/api';

  constructor(private http: HttpClient) {}

  /**
   * Get all suspects from Strapi v5
   */
  getSuspects(): Observable<StrapiResponse<Suspect[]>> {
    return this.http.get<StrapiResponse<Suspect[]>>(
      `${this.baseUrl}/suspects?populate=*`
    );
  }

  /**
   * Get a single suspect by documentId from Strapi v5
   */
  getSuspectByDocumentId(
    documentId: string
  ): Observable<StrapiResponse<Suspect>> {
    return this.http.get<StrapiResponse<Suspect>>(
      `${this.baseUrl}/suspects/${documentId}?populate=*`
    );
  }

  /**
   * Get all alerts from Strapi v5
   */
  getAlerts(): Observable<StrapiResponse<Alert[]>> {
    return this.http.get<StrapiResponse<Alert[]>>(
      `${this.baseUrl}/alerts?populate=*`
    );
  }

  /**
   * Get a single alert by documentId from Strapi v5
   */
  getAlertByDocumentId(documentId: string): Observable<StrapiResponse<Alert>> {
    return this.http.get<StrapiResponse<Alert>>(
      `${this.baseUrl}/alerts/${documentId}?populate=*`
    );
  }

  /**
   * Get all events from Strapi v5
   */
  getEvents(): Observable<StrapiResponse<Event[]>> {
    return this.http.get<StrapiResponse<Event[]>>(
      `${this.baseUrl}/events?populate=*`
    );
  }

  /**
   * Get a single event by documentId from Strapi v5
   */
  getEventByDocumentId(documentId: string): Observable<StrapiResponse<Event>> {
    return this.http.get<StrapiResponse<Event>>(
      `${this.baseUrl}/events/${documentId}?populate=*`
    );
  }

  /**
   * Helper method to get full image URL
   */
  getImageUrl(imageUrl: string): string {
    if (!imageUrl) return '';
    if (imageUrl.startsWith('http')) return imageUrl;
    return `https://codeagainstcrime.com${imageUrl}`;
  }
}
