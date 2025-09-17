export interface StrapiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiImage {
  documentId: string;
  url: string;
  alternativeText?: string;
  name: string;
  width: number;
  height: number;
}
