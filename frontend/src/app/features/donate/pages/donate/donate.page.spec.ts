import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DonatePage } from './donate.page';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('DonatePage', () => {
  let component: DonatePage;
  let fixture: ComponentFixture<DonatePage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [DonatePage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA], // ignore Ionic components not loaded in tests
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DonatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the DonatePage', () => {
    expect(component).toBeTruthy();
  });

  it('should render the main page title', () => {
    const pageTitle = fixture.debugElement.query(By.css('h2'))?.nativeElement;
    expect(pageTitle.textContent).toContain('Why Donate to Us?');
  });

  it('should render all info section headers', () => {
    const headers = fixture.debugElement.queryAll(By.css('.info-header ion-label'));
    const expectedHeaders = [
      'Direct Community Impact',
      '100% Community Funded',
      'Safe & Secure',
      'Trusted & Transparent',
      'Tax Deductible',
    ];
    const renderedHeaders = headers.map(h => h.nativeElement.textContent.trim());
    expect(renderedHeaders).toEqual(expectedHeaders);
  });

  it('should render info section content', () => {
    const contents = fixture.debugElement.queryAll(By.css('.info-content'));
    expect(contents.length).toBeGreaterThan(0);
    expect(contents[0].nativeElement.textContent).toContain('Your donation helps solve crimes');
    expect(contents[3].nativeElement.textContent).toContain('Registered charity with full accountability');
  });

  it('should render the donation form iframe', () => {
    const iframe = fixture.debugElement.query(By.css('iframe'))?.nativeElement;
    expect(iframe).toBeTruthy();
    expect(iframe.getAttribute('src')).toBe('https://www.canadahelps.org/en/dn/93928');
    expect(iframe.getAttribute('title')).toBe('Donate Now');
    expect(iframe.getAttribute('width')).toBe('100%');
    expect(iframe.getAttribute('height')).toBe('800');
  });

  it('should render the "Donate Now" section header', () => {
    const donateHeader = fixture.debugElement.queryAll(By.css('h2'))[1]?.nativeElement;
    expect(donateHeader.textContent).toContain('Donate Now');
  });
});
