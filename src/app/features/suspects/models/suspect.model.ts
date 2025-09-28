import { StrapiImage } from '../../../core/models/strapi.model';

export interface Suspect {
  id: number;
  documentId: string;
  Name: string;
  Residence: string;
  Scene: string;
  Crime: string;
  Age: string;
  Height: string;
  Weight: string;
  Body: string;
  Images?: StrapiImage[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  localizations?: any[];
}
