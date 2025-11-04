import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventsFilterComponent } from './events-filter.component';
import { ScreenReaderService } from 'src/app/core/pages/settings/services/screen-reader.service';
import { PopoverController } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import {
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonRadioGroup,
  IonRadio,
  IonButton,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';

@Pipe({ name: 'translate', standalone: true })
class TranslatePipeMock implements PipeTransform {
  transform(value: string, args?: any): string {
    return value;
  }
}

describe('EventsFilterComponent', () => {
  let component: EventsFilterComponent;
  let fixture: ComponentFixture<EventsFilterComponent>;
  let screenReader: jasmine.SpyObj<ScreenReaderService>;
  let popoverController: jasmine.SpyObj<PopoverController>;
  let onEventTypeChangeSpy: jasmine.Spy;
  let clearFiltersSpy: jasmine.Spy;

  beforeEach(async () => {
    const screenReaderSpy = jasmine.createSpyObj('ScreenReaderService', [
      'speak',
    ]);
    const popoverSpy = jasmine.createSpyObj('PopoverController', ['dismiss']);

    onEventTypeChangeSpy = jasmine.createSpy('onEventTypeChange');
    clearFiltersSpy = jasmine.createSpy('clearFilters');

    await TestBed.configureTestingModule({
      imports: [
        EventsFilterComponent,
        FormsModule,
        CommonModule,
        IonContent,
        IonList,
        IonItem,
        IonLabel,
        IonRadioGroup,
        IonRadio,
        IonButton,
        IonHeader,
        IonTitle,
        IonToolbar,
        TranslatePipeMock,
      ],
      providers: [
        { provide: ScreenReaderService, useValue: screenReaderSpy },
        { provide: PopoverController, useValue: popoverSpy },
      ],
    })
      .overrideComponent(EventsFilterComponent, {
        set: {
          imports: [
            FormsModule,
            CommonModule,
            IonContent,
            IonList,
            IonItem,
            IonLabel,
            IonRadioGroup,
            IonRadio,
            IonButton,
            IonHeader,
            IonTitle,
            IonToolbar,
            TranslatePipeMock,
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(EventsFilterComponent);
    component = fixture.componentInstance;

    screenReader = TestBed.inject(
      ScreenReaderService
    ) as jasmine.SpyObj<ScreenReaderService>;
    popoverController = TestBed.inject(
      PopoverController
    ) as jasmine.SpyObj<PopoverController>;

    component.selectedEventType = '';
    component.onEventTypeChange = onEventTypeChangeSpy;
    component.clearFilters = clearFiltersSpy;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set selectedType and announce on ngOnInit', async () => {
    await component.ngOnInit();
    expect(component.selectedType).toBe('');
    expect(screenReader.speak).toHaveBeenCalledWith(
      'Event filter options loaded'
    );
  });

  it('should select "upcoming" events', async () => {
    const event = { detail: { value: 'upcoming' } };
    await component.onSelectionChange(event);

    expect(component.selectedType).toBe('upcoming');
    expect(onEventTypeChangeSpy).toHaveBeenCalledWith('upcoming');
    expect(screenReader.speak).toHaveBeenCalledWith('Upcoming Events selected');
    expect(popoverController.dismiss).toHaveBeenCalled();
  });

  it('should select "past" events', async () => {
    const event = { detail: { value: 'past' } };
    await component.onSelectionChange(event);

    expect(component.selectedType).toBe('past');
    expect(onEventTypeChangeSpy).toHaveBeenCalledWith('past');
    expect(screenReader.speak).toHaveBeenCalledWith('Past Events selected');
    expect(popoverController.dismiss).toHaveBeenCalled();
  });

  it('should select "all events"', async () => {
    const event = { detail: { value: '' } };
    await component.onSelectionChange(event);

    expect(component.selectedType).toBe('');
    expect(onEventTypeChangeSpy).toHaveBeenCalledWith('');
    expect(screenReader.speak).toHaveBeenCalledWith('All Events selected');
    expect(popoverController.dismiss).toHaveBeenCalled();
  });

  it('should clear filters and dismiss popover', async () => {
    await component.clearAndClose();

    expect(clearFiltersSpy).toHaveBeenCalled();
    expect(screenReader.speak).toHaveBeenCalledWith('Filters cleared');
    expect(popoverController.dismiss).toHaveBeenCalled();
  });
});
