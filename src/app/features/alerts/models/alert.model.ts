import { StrapiImage } from '../../../core/models/strapi.model';

export interface Alert {
  documentId: string;
  locale: string;
  Title: string;
  publishedAt: string;
  Source: 'Crime Stoppers' | 'Halton Police';
  Body: string;
  Main_Image?: StrapiImage;
}
