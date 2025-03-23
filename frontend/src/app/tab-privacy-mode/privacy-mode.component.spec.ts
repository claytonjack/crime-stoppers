import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

import { PrivacyModeComponent } from './privacy-mode.component';

describe('PrivacyModeComponent', () => {
  let component: PrivacyModeComponent;
  let fixture: ComponentFixture<PrivacyModeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrivacyModeComponent],
      imports: [IonicModule.forRoot(), FormsModule],
      providers: [DatePipe]
    }).compileComponents();

    fixture = TestBed.createComponent(PrivacyModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the selected date in the events heading', () => {
    component.selectedDate = '2025-03-25'; // Set as string instead of Date
    fixture.detectChanges();

    const heading = fixture.nativeElement.querySelector('.date-heading');
    expect(heading.textContent).toContain('March 25, 2025'); // Check if date is correctly formatted in the heading
  });

  it('should display "No events scheduled for this day" if no events are available', () => {
    component.selectedDate = '2025-03-25'; // Set as string
    spyOn(component, 'getEventsForSelectedDate').and.returnValue([]); // Mock empty events
    fixture.detectChanges();

    const noEventsMessage = fixture.nativeElement.querySelector('.no-events p');
    expect(noEventsMessage.textContent).toContain('No events scheduled for this day');
  });

  it('should display events for the selected date', () => {
    const mockEvent = {
      title: 'Test Event',
      date: '2025-03-25',
      time: '10:00 AM',
      attendees: 'John Doe',
      location: 'Room 101'
    };

    component.selectedDate = '2025-03-25'; // Set as string
    spyOn(component, 'getEventsForSelectedDate').and.returnValue([mockEvent]); // Mock events
    fixture.detectChanges();

    const eventCard = fixture.nativeElement.querySelector('.event-card');
    expect(eventCard).toBeTruthy();
    expect(eventCard.querySelector('ion-card-title').textContent).toContain('Test Event');
    expect(eventCard.querySelector('ion-label').textContent).toContain('March 25, 2025'); // Event date
    expect(eventCard.querySelectorAll('ion-item')[1].textContent).toContain('10:00 AM'); // Event time
    expect(eventCard.querySelectorAll('ion-item')[2].textContent).toContain('John Doe'); // Event attendees
    expect(eventCard.querySelectorAll('ion-item')[3].textContent).toContain('Room 101'); // Event location
  });

  it('should call onDateChange when the date is changed', () => {
    spyOn(component, 'onDateChange');
    const datetimeInput = fixture.nativeElement.querySelector('ion-datetime');
    datetimeInput.value = '2025-03-25'; // Simulate a date change
    datetimeInput.dispatchEvent(new Event('ionChange')); // Trigger the ionChange event
    fixture.detectChanges();

    expect(component.onDateChange).toHaveBeenCalled();
  });

  it('should call getEventsForSelectedDate when the date is changed', () => {
    spyOn(component, 'getEventsForSelectedDate');
    component.selectedDate = '2025-03-25'; // Set as string
    component.onDateChange({ detail: { value: '2025-03-25' } });
    fixture.detectChanges();

    expect(component.getEventsForSelectedDate).toHaveBeenCalled();
  });
});
