export interface Event {
  id: number;
  documentId: string;
  Title: string;
  Event_Time: string;
  Location: string;
  Body: string;
  Images?: StrapiImage[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  localizations?: any[];
  Type?: string;
  Description?: string;
}

export interface StrapiImage {
  id: number;
  documentId: string;
  name: string;
  url: string;
  alternativeText?: string;
  caption?: string;
  width?: number;
  height?: number;
  ext?: string;
  mime?: string;
  size?: number;
  hash?: string;
  formats?: {
    thumbnail?: ImageFormat;
    small?: ImageFormat;
    medium?: ImageFormat;
    large?: ImageFormat;
  };
  provider?: string;
  provider_metadata?: any;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface ImageFormat {
  ext: string;
  url: string;
  hash: string;
  mime: string;
  name: string;
  path?: string;
  size: number;
  width: number;
  height: number;
  sizeInBytes: number;
}
