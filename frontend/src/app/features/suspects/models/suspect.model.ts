import { StrapiImage } from '../../../core/models/strapi.model';

export interface Suspect {
  documentId: string;
  locale: string;
  Name: string;
  Residence: string;
  Age: string;
  Height: string;
  Weight: string;
  Details: string;
  Reward: string;
  Contact: string;
  Main_Image?: StrapiImage;
}
