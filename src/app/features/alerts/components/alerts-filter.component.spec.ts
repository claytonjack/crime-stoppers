import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlertsFilterComponent } from './alerts-filter.component';
import { PopoverController } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

describe('AlertsFilterComponent', () => {
  let component: AlertsFilterComponent;
  let fixture: ComponentFixture<AlertsFilterComponent>;
  let popoverCtrlSpy: jasmine.SpyObj<PopoverController>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('PopoverController', ['dismiss']);
    spy.dismiss.and.returnValue(Promise.resolve(true)); // match return type

    await TestBed.configureTestingModule({
      imports: [AlertsFilterComponent, FormsModule],
      providers: [{ provide: PopoverController, useValue: spy }],
    }).compileComponents();

    fixture = TestBed.createComponent(AlertsFilterComponent);
    component = fixture.componentInstance;
    popoverCtrlSpy = TestBed.inject(
      PopoverController
    ) as jasmine.SpyObj<PopoverController>;

    // default inputs
    component.selectedSource = 'Source A';
    component.availableSources = ['Source A', 'Source B', 'Source C'];
    component.onSourceChange = jasmine.createSpy('onSourceChange');
    component.clearFilters = jasmine.createSpy('clearFilters');

    fixture.detectChanges();
  });

  it('should create the component and initialize selectedSourceLocal', () => {
    component.ngOnInit();
    expect(component.selectedSourceLocal).toBe('Source A');
  });

  it('should call onSourceChange and dismiss popover on selection change', () => {
    const changeSpy = jasmine.createSpy('onSourceChange');
    component.onSourceChange = changeSpy;

    component.onSelectionChange({ detail: { value: 'Source B' } });

    expect(component.selectedSourceLocal).toBe('Source B');
    expect(changeSpy).toHaveBeenCalledWith('Source B');
    expect(popoverCtrlSpy.dismiss).toHaveBeenCalled();
  });

  it('should call clearFilters and dismiss popover on clearAndClose', () => {
    const clearSpy = jasmine.createSpy('clearFilters');
    component.clearFilters = clearSpy;

    component.clearAndClose();

    expect(clearSpy).toHaveBeenCalled();
    expect(popoverCtrlSpy.dismiss).toHaveBeenCalled();
  });

  it('should render all available sources as radio items', () => {
    const items = fixture.debugElement.queryAll(By.css('ion-item'));
    // +1 for "All Sources"
    expect(items.length).toBe(component.availableSources.length + 1);

    expect(items[0].nativeElement.textContent).toContain('All Sources');
    expect(items[1].nativeElement.textContent).toContain('Source A');
    expect(items[2].nativeElement.textContent).toContain('Source B');
    expect(items[3].nativeElement.textContent).toContain('Source C');
  });
});
