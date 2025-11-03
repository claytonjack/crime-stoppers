import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { StrapiService } from './strapi.service';
import { Event } from 'src/app/features/events/models/event.model';
import { Suspect } from 'src/app/features/suspects/models/suspect.model';
import { Alert } from 'src/app/features/alerts/models/alert.model';
import { StrapiResponse } from 'src/app/core/models/strapi.model';
import { take } from 'rxjs/operators';

describe('StrapiService', () => {
  let service: StrapiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [StrapiService],
    });
    service = TestBed.inject(StrapiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch suspects', () => {
    const dummyResponse: StrapiResponse<Suspect[]> = {
      data: [
        {
          id: '1',
          attributes: {},
        } as any,
      ],
    };

    service.getSuspects().subscribe((res) => {
      expect(res).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne(
      'https://codeagainstcrime.com/api/suspects?locale=en&populate=*'
    );
    expect(req.request.method).toBe('GET');
    req.flush(dummyResponse);
  });

  it('should merge fallback english items when locale is not english', () => {
    service.setLocale('fr-CA');

    const frenchResponse: StrapiResponse<Suspect[]> = {
      data: [
        {
          id: 2,
          documentId: 'doc-2',
          Name: 'Nom',
          Residence: '',
          Scene: '',
          Crime: '',
          Age: '',
          Height: '',
          Weight: '',
          Body: '',
          createdAt: '',
          updatedAt: '',
          publishedAt: '',
          locale: 'fr-CA',
        } as any,
      ],
    };

    const englishResponse: StrapiResponse<Suspect[]> = {
      data: [
        {
          id: 1,
          documentId: 'doc-1',
          Name: 'Name',
          Residence: '',
          Scene: '',
          Crime: '',
          Age: '',
          Height: '',
          Weight: '',
          Body: '',
          createdAt: '',
          updatedAt: '',
          publishedAt: '',
          locale: 'en',
        } as any,
        {
          id: 22,
          documentId: 'doc-2',
          Name: 'Name 2',
          Residence: '',
          Scene: '',
          Crime: '',
          Age: '',
          Height: '',
          Weight: '',
          Body: '',
          createdAt: '',
          updatedAt: '',
          publishedAt: '',
          locale: 'en',
        } as any,
      ],
    };

    service
      .getSuspects()
      .pipe(take(1))
      .subscribe((res) => {
        expect(res.data).toEqual([
          englishResponse.data[0],
          frenchResponse.data[0],
        ]);
      });

    const frReq = httpMock.expectOne(
      'https://codeagainstcrime.com/api/suspects?locale=fr-CA&populate=*'
    );
    expect(frReq.request.method).toBe('GET');
    frReq.flush(frenchResponse);

    const enReq = httpMock.expectOne(
      'https://codeagainstcrime.com/api/suspects?locale=en&populate=*'
    );
    expect(enReq.request.method).toBe('GET');
    enReq.flush(englishResponse);
  });

  it('should fetch a single suspect by documentId', () => {
    const dummyResponse: StrapiResponse<Suspect> = {
      data: {
        id: 'abc123',
        attributes: {},
      } as any,
    };

    service.getSuspectByDocumentId('abc123').subscribe((res) => {
      expect(res).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne(
      'https://codeagainstcrime.com/api/suspects/abc123?locale=en&populate=*'
    );
    expect(req.request.method).toBe('GET');
    req.flush(dummyResponse);
  });

  it('should fallback to english when single locale data is missing', () => {
    service.setLocale('es');

    const englishResponse: StrapiResponse<Suspect> = {
      data: {
        id: 'abc123',
        attributes: {},
      } as any,
    };

    service
      .getSuspectByDocumentId('abc123')
      .pipe(take(1))
      .subscribe((res) => {
        expect(res).toEqual(englishResponse);
      });

    const esReq = httpMock.expectOne(
      'https://codeagainstcrime.com/api/suspects/abc123?locale=es&populate=*'
    );
    esReq.flush({ data: null });

    const enReq = httpMock.expectOne(
      'https://codeagainstcrime.com/api/suspects/abc123?locale=en&populate=*'
    );
    enReq.flush(englishResponse);
  });

  it('should generate correct image URL', () => {
    expect(service.getImageUrl('')).toBe('');
    expect(service.getImageUrl('http://example.com/image.png')).toBe(
      'http://example.com/image.png'
    );
    expect(service.getImageUrl('/uploads/image.png')).toBe(
      'https://codeagainstcrime.com/uploads/image.png'
    );
  });
});
