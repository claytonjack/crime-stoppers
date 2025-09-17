import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrivacyModePage } from './privacy-mode.page';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HeaderComponent } from '../../../../core/components/header/header.component';
import { By } from '@angular/platform-browser';

describe('PrivacyModePage', () => {
  let component: PrivacyModePage;
  let fixture: ComponentFixture<PrivacyModePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        IonicModule.forRoot(),
        PrivacyModePage,
        HeaderComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PrivacyModePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default empty selectedDate', () => {
    expect(component.selectedDate).toBe('');
  });

  it('should update selectedDate when onDateChange is called', () => {
    const mockEvent = { detail: { value: '2023-05-15' } };
    component.onDateChange(mockEvent);
    expect(component.selectedDate).toBe('2023-05-15');
    fixture.detectChanges();
  });

  it('should display the calendar component', () => {
    const datetimeElement = fixture.debugElement.query(By.css('ion-datetime'));
    expect(datetimeElement).toBeTruthy();
  });

  it('should display correct header title', () => {
    const headerElement = fixture.debugElement.query(
      By.directive(HeaderComponent)
    );
    const headerComponent = headerElement.componentInstance;
    expect(headerComponent.title).toBe('Calendar');
  });

  it('should display "No events" message', () => {
    const noEventsElement = fixture.debugElement.query(By.css('.no-events p'));
    expect(noEventsElement.nativeElement.textContent).toContain(
      'No events scheduled for this day'
    );
  });

  it('should update the displayed date when date changes', () => {
    component.selectedDate = '2023-05-15';
    fixture.detectChanges();

    const dateHeading = fixture.debugElement.query(By.css('.date-heading'));

    expect(dateHeading).toBeTruthy();
    expect(dateHeading.nativeElement.textContent.length).toBeGreaterThan(0);
  });
});
