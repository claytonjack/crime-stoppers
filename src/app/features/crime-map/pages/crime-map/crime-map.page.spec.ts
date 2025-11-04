import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CrimeMapPage } from './crime-map.page';
import { TranslateModule } from '@ngx-translate/core';
import { ScreenReaderService } from '@app/core/pages/settings/services/screen-reader.service';

describe('CrimeMapPage', () => {
  let component: CrimeMapPage;
  let fixture: ComponentFixture<CrimeMapPage>;
  let screenReaderSpy: jasmine.SpyObj<ScreenReaderService>;

  beforeEach(waitForAsync(() => {
    const spy = jasmine.createSpyObj('ScreenReaderService', ['speak']);

    TestBed.configureTestingModule({
      imports: [CrimeMapPage, TranslateModule.forRoot()],
      providers: [{ provide: ScreenReaderService, useValue: spy }],
    }).compileComponents();

    screenReaderSpy = TestBed.inject(
      ScreenReaderService
    ) as jasmine.SpyObj<ScreenReaderService>;
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrimeMapPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call screen reader on ngOnInit', async () => {
    await component.ngOnInit();
    expect(screenReaderSpy.speak).toHaveBeenCalledWith(
      'Crime Map page loaded.'
    );
    expect(screenReaderSpy.speak).toHaveBeenCalledWith(
      'This page shows an interactive map of recent crime incidents. ' +
        'You can use keyboard navigation or screen reader gestures to explore the map.'
    );
  });
});
