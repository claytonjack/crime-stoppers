import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CommunityWatchPage } from './community-watch.page';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule, By } from '@angular/platform-browser';
import { InAppBrowser } from '@capacitor/inappbrowser';
import * as InAppBrowserModule from '@capacitor/inappbrowser';

describe('CommunityWatchPage', () => {
  let component: CommunityWatchPage;
  let fixture: ComponentFixture<CommunityWatchPage>;
  let inAppBrowserSpy: any;

  beforeEach(waitForAsync(() => {
    // Mock InAppBrowser plugin
    inAppBrowserSpy = {
      openInSystemBrowser: jasmine
        .createSpy('openInSystemBrowser')
        .and.returnValue(Promise.resolve()),
    };

    TestBed.configureTestingModule({
      imports: [BrowserModule, CommunityWatchPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [{ provide: InAppBrowser, useValue: inAppBrowserSpy }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunityWatchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the CommunityWatchPage', () => {
    expect(component).toBeTruthy();
  });

  it('should render hero title', () => {
    const heroTitle = fixture.debugElement.query(By.css('h2'))?.nativeElement;
    expect(heroTitle.textContent).toContain('Prevent | Report | Community');
  });

  it('should render program benefits sections', () => {
    const benefitHeaders = fixture.debugElement.queryAll(
      By.css('.info-header ion-label')
    );
    const expectedHeaders = [
      'Stay Informed',
      'Anonymous Reporting',
      'Visibility Materials',
      'CamSafe Registration',
      'Partner Discounts',
      'Build Connections',
    ];
    const renderedHeaders = benefitHeaders.map((el) =>
      el.nativeElement.textContent.trim()
    );
    expect(renderedHeaders).toEqual(expectedHeaders);
  });

  it('should render partner slides', () => {
    expect(component.partnerSlides.length).toBeGreaterThan(0);
    const firstSlide = component.partnerSlides[0];
    expect(firstSlide.src).toContain('assets/images/cw1-lorex.jpg');
  });

  it('should open Home Inspection PDF in a new tab', () => {
    const spy = spyOn(window, 'open');
    component.openHomeInspection();
    expect(spy).toHaveBeenCalledWith(
      'assets/HomeInspectionReport.pdf',
      '_blank'
    );
  });
  it('should open PDF via openPdf', async () => {
    const spy = spyOn(component, 'openPdf');
    const testUrl = 'https://example.com/test.pdf';
    await component.openPdf(testUrl);
    expect(spy).toHaveBeenCalledWith(testUrl);
  });

  it('should open Home Inspection PDF in a new tab', () => {
    const spy = spyOn(window, 'open');
    component.openHomeInspection();
    expect(spy).toHaveBeenCalledWith(
      'assets/HomeInspectionReport.pdf',
      '_blank'
    );
  });

  it('Subscribe button click should open URL', () => {
    const spy = spyOn(window, 'open');

    const subscribeUrl = 'https://lp.constantcontactpages.com/sl/guJGNOk';
    window.open(subscribeUrl, '_blank');

    expect(spy).toHaveBeenCalledWith(subscribeUrl, '_blank');
  });
});
