import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { StrapiService } from './strapi.service';
import { Event } from '../../features/events/models/event.model';
import { Suspect } from '../../features/suspects/models/suspect.model';
import { Alert } from '../../features/alerts/models/alert.model';
import { StrapiResponse } from '../models/strapi.model';

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
      'https://codeagainstcrime.com/api/suspects?populate=*'
    );
    expect(req.request.method).toBe('GET');
    req.flush(dummyResponse);
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
      'https://codeagainstcrime.com/api/suspects/abc123?populate=*'
    );
    expect(req.request.method).toBe('GET');
    req.flush(dummyResponse);
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
