import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Input, Pipe, PipeTransform } from '@angular/core';
import { By } from '@angular/platform-browser';

import { DonatePage } from './donate.page';
import { ScreenReaderService } from '@app/core/pages/settings/services/screen-reader.service';
import {
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonItem,
  IonLabel,
  IonItemDivider,
} from '@ionic/angular/standalone';

@Pipe({ name: 'translate', standalone: true })
class TranslatePipeMock implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  template: `<div>{{ title }}</div>`,
})
class HeaderComponentMock {
  @Input() title!: string;
}

describe('DonatePage', () => {
  let component: DonatePage;
  let fixture: ComponentFixture<DonatePage>;
  let screenReader: jasmine.SpyObj<ScreenReaderService>;

  beforeEach(async () => {
    const screenReaderSpy = jasmine.createSpyObj('ScreenReaderService', [
      'speak',
    ]);

    await TestBed.configureTestingModule({
      imports: [
        DonatePage,
        HeaderComponentMock,
        IonContent,
        IonGrid,
        IonRow,
        IonCol,
        IonItem,
        IonLabel,
        IonItemDivider,
        TranslatePipeMock,
      ],
      providers: [{ provide: ScreenReaderService, useValue: screenReaderSpy }],
    })
      .overrideComponent(DonatePage, {
        set: {
          imports: [
            IonContent,
            IonGrid,
            IonRow,
            IonCol,
            IonItem,
            IonLabel,
            IonItemDivider,
            TranslatePipeMock,
            HeaderComponentMock,
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(DonatePage);
    component = fixture.componentInstance;
    screenReader = TestBed.inject(
      ScreenReaderService
    ) as jasmine.SpyObj<ScreenReaderService>;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should announce page loaded on ngOnInit', async () => {
    await component.ngOnInit();
    expect(screenReader.speak).toHaveBeenCalledWith(
      'Donate page loaded. Why Donate section displayed.'
    );
  });

  it('should render the header component', () => {
    const headerEl = fixture.debugElement.query(By.css('app-header'));
    expect(headerEl).toBeTruthy();
    expect(headerEl.nativeElement.textContent).toContain(
      'feature.donate.headerTitle'
    );
  });

  it('should render all "why donate" info sections', () => {
    const infoSections = fixture.debugElement.queryAll(By.css('.info-item'));
    expect(infoSections.length).toBe(5);
  });

  it('should have an iframe for the donation form', () => {
    const iframeEl = fixture.debugElement.query(By.css('iframe'));
    expect(iframeEl).toBeTruthy();
    expect(iframeEl.nativeElement.src).toContain(
      'https://www.canadahelps.org/en/dn/93928'
    );
  });
});
