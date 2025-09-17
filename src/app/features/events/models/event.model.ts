import { StrapiImage } from '../../../core/models/strapi.model';

export interface Event {
  documentId: string;
  locale: string;
  Title: string;
  Start_Time: string;
  End_Time: string;
  Body: string;
  Main_Image?: StrapiImage;
}
