import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventsFilterComponent } from './events-filter.component';
import { PopoverController } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

describe('EventsFilterComponent', () => {
  let component: EventsFilterComponent;
  let fixture: ComponentFixture<EventsFilterComponent>;
  let popoverCtrlSpy: jasmine.SpyObj<PopoverController>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('PopoverController', ['dismiss']);

    await TestBed.configureTestingModule({
      imports: [EventsFilterComponent, FormsModule],
      providers: [{ provide: PopoverController, useValue: spy }],
    }).compileComponents();

    fixture = TestBed.createComponent(EventsFilterComponent);
    component = fixture.componentInstance;
    popoverCtrlSpy = TestBed.inject(
      PopoverController
    ) as jasmine.SpyObj<PopoverController>;
  });

  it('should initialize selectedType from input', () => {
    component.selectedEventType = 'upcoming';
    component.ngOnInit();
    expect(component.selectedType).toBe('upcoming');
  });

  it('should call onEventTypeChange and dismiss popover on selection change', () => {
    const changeSpy = jasmine.createSpy('onEventTypeChange');
    component.onEventTypeChange = changeSpy;

    component.onSelectionChange({ detail: { value: 'past' } });

    expect(component.selectedType).toBe('past');
    expect(changeSpy).toHaveBeenCalledWith('past');
    expect(popoverCtrlSpy.dismiss).toHaveBeenCalled();
  });

  it('should call clearFilters and dismiss popover on clearAndClose', () => {
    const clearSpy = jasmine.createSpy('clearFilters');
    component.clearFilters = clearSpy;

    component.clearAndClose();

    expect(clearSpy).toHaveBeenCalled();
    expect(popoverCtrlSpy.dismiss).toHaveBeenCalled();
  });
});
