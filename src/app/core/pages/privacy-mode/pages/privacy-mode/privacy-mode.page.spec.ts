import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrivacyModePage } from './privacy-mode.page';
import { PrivacyModeService } from 'src/app/core/pages/privacy-mode/services/privacy-mode.service';
import { ScreenReaderService } from '@app/core/pages/settings/services/screen-reader.service';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonDatetime,
  IonCard,
  IonCardContent,
} from '@ionic/angular/standalone';
import { HeaderComponent } from 'src/app/core/components/header/header.component';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { Pipe, PipeTransform } from '@angular/core';
import { formatDate } from '@angular/common';

// Mock TranslatePipe to bypass subscription issues
@Pipe({ name: 'translate' })
class TranslatePipeMock implements PipeTransform {
  transform(value: string, args?: any): string {
    if (args?.date) {
      return `Selected date: ${args.date}`;
    }
    return value;
  }
}

describe('PrivacyModePage', () => {
  let component: PrivacyModePage;
  let fixture: ComponentFixture<PrivacyModePage>;
  let privacyModeService: jasmine.SpyObj<PrivacyModeService>;
  let screenReader: jasmine.SpyObj<ScreenReaderService>;

  beforeEach(async () => {
    const privacyModeSpy = jasmine.createSpyObj('PrivacyModeService', [], {
      isEnabled: true,
    });
    const screenReaderSpy = jasmine.createSpyObj('ScreenReaderService', [
      'speak',
    ]);

    await TestBed.configureTestingModule({
      imports: [
        PrivacyModePage,
        FormsModule,
        TranslateModule.forRoot(),
        IonContent,
        IonDatetime,
        IonCard,
        IonCardContent,
        HeaderComponent,
        TranslatePipeMock,
      ],
      providers: [
        { provide: PrivacyModeService, useValue: privacyModeSpy },
        { provide: ScreenReaderService, useValue: screenReaderSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PrivacyModePage);
    component = fixture.componentInstance;

    privacyModeService = TestBed.inject(
      PrivacyModeService
    ) as jasmine.SpyObj<PrivacyModeService>;

    screenReader = TestBed.inject(
      ScreenReaderService
    ) as jasmine.SpyObj<ScreenReaderService>;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set privacyModeEnabled and announce page on ngOnInit', () => {
    component.ngOnInit();
    expect(component.privacyModeEnabled).toBe(true);
    expect(screenReader.speak).toHaveBeenCalledWith('Calendar page loaded');
  });

  it('should update selectedDate and announce date change', async () => {
    const testDate = '2025-11-03';
    await component.onDateChange({ detail: { value: testDate } });

    expect(component.selectedDate).toBe(testDate);

    const formattedDate = formatDate(testDate, 'fullDate', 'en-US');
    expect(screenReader.speak).toHaveBeenCalledWith(
      `You selected ${formattedDate}`
    );
    expect(screenReader.speak).toHaveBeenCalledWith(
      'No events scheduled for this day'
    );
  });

  it('should render header and no-events card in template', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    // Check header text
    expect(compiled.querySelector('app-header')?.textContent).toContain(
      'core.privacyMode.headerTitle'
    );

    // Check no-events message
    const cardText = compiled.querySelector('.event-card p')?.textContent;
    expect(cardText).toContain('core.privacyMode.noEvents');
  });
});
