import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlertsFilterComponent } from './alerts-filter.component';
import { ScreenReaderService } from 'src/app/core/pages/settings/services/screen-reader.service';
import { PopoverController } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { of } from 'rxjs';
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

// ---- Standalone TranslatePipe Mock ----
@Pipe({ name: 'translate', standalone: true })
class TranslatePipeMock implements PipeTransform {
  transform(value: string, args?: any): string {
    if (args?.date) {
      return `${value}: ${args.date}`;
    }
    return value;
  }
}

describe('AlertsFilterComponent', () => {
  let component: AlertsFilterComponent;
  let fixture: ComponentFixture<AlertsFilterComponent>;
  let screenReader: jasmine.SpyObj<ScreenReaderService>;
  let popoverController: jasmine.SpyObj<PopoverController>;
  let onSourceChangeSpy: jasmine.Spy;
  let clearFiltersSpy: jasmine.Spy;

  beforeEach(async () => {
    const screenReaderSpy = jasmine.createSpyObj('ScreenReaderService', [
      'speak',
    ]);
    const popoverSpy = jasmine.createSpyObj('PopoverController', ['dismiss']);

    onSourceChangeSpy = jasmine.createSpy('onSourceChange');
    clearFiltersSpy = jasmine.createSpy('clearFilters');

    await TestBed.configureTestingModule({
      imports: [
        AlertsFilterComponent,
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
        TranslatePipeMock, // use mock pipe to avoid _TranslateService
      ],
      providers: [
        { provide: ScreenReaderService, useValue: screenReaderSpy },
        { provide: PopoverController, useValue: popoverSpy },
      ],
    })
      .overrideComponent(AlertsFilterComponent, {
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
            TranslatePipeMock, // force mock pipe
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(AlertsFilterComponent);
    component = fixture.componentInstance;

    screenReader = TestBed.inject(
      ScreenReaderService
    ) as jasmine.SpyObj<ScreenReaderService>;
    popoverController = TestBed.inject(
      PopoverController
    ) as jasmine.SpyObj<PopoverController>;

    // Set inputs
    component.selectedSource = '';
    component.availableSources = ['Source A', 'Source B'];
    component.onSourceChange = onSourceChangeSpy;
    component.clearFilters = clearFiltersSpy;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set selectedSourceLocal and announce on ngOnInit', async () => {
    await component.ngOnInit();
    expect(component.selectedSourceLocal).toBe('');
    expect(screenReader.speak).toHaveBeenCalledWith(
      'Alert filter options loaded'
    );
  });

  it('should update selection and call callbacks', async () => {
    const event = { detail: { value: 'Source A' } };
    await component.onSelectionChange(event);

    expect(component.selectedSourceLocal).toBe('Source A');
    expect(onSourceChangeSpy).toHaveBeenCalledWith('Source A');
    expect(screenReader.speak).toHaveBeenCalledWith('Source set to Source A');
    expect(popoverController.dismiss).toHaveBeenCalled();
  });

  it('should select "all sources" correctly', async () => {
    const event = { detail: { value: '' } };
    await component.onSelectionChange(event);

    expect(component.selectedSourceLocal).toBe('');
    expect(onSourceChangeSpy).toHaveBeenCalledWith('');
    expect(screenReader.speak).toHaveBeenCalledWith('All sources selected');
    expect(popoverController.dismiss).toHaveBeenCalled();
  });

  it('should clear filters and dismiss popover', async () => {
    await component.clearAndClose();
    expect(clearFiltersSpy).toHaveBeenCalled();
    expect(screenReader.speak).toHaveBeenCalledWith('Filters cleared');
    expect(popoverController.dismiss).toHaveBeenCalled();
  });
});
