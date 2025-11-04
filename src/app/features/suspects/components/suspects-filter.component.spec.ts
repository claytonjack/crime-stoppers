import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SuspectsFilterComponent } from './suspects-filter.component';
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
    return value; // just return the key
  }
}

describe('SuspectsFilterComponent', () => {
  let component: SuspectsFilterComponent;
  let fixture: ComponentFixture<SuspectsFilterComponent>;
  let screenReader: jasmine.SpyObj<ScreenReaderService>;
  let popoverController: jasmine.SpyObj<PopoverController>;
  let onSceneChangeSpy: jasmine.Spy;
  let clearFiltersSpy: jasmine.Spy;

  beforeEach(async () => {
    const screenReaderSpy = jasmine.createSpyObj('ScreenReaderService', [
      'speak',
    ]);
    const popoverSpy = jasmine.createSpyObj('PopoverController', ['dismiss']);

    onSceneChangeSpy = jasmine.createSpy('onSceneChange');
    clearFiltersSpy = jasmine.createSpy('clearFilters');

    await TestBed.configureTestingModule({
      imports: [
        SuspectsFilterComponent,
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
      .overrideComponent(SuspectsFilterComponent, {
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

    fixture = TestBed.createComponent(SuspectsFilterComponent);
    component = fixture.componentInstance;

    screenReader = TestBed.inject(
      ScreenReaderService
    ) as jasmine.SpyObj<ScreenReaderService>;
    popoverController = TestBed.inject(
      PopoverController
    ) as jasmine.SpyObj<PopoverController>;

    // Set inputs
    component.selectedScene = '';
    component.scenes = ['Scene A', 'Scene B'];
    component.onSceneChange = onSceneChangeSpy;
    component.clearFilters = clearFiltersSpy;

    fixture.detectChanges(); // triggers ngOnInit
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set selectedSceneLocal and announce on ngOnInit', async () => {
    await component.ngOnInit();
    expect(component.selectedSceneLocal).toBe('');
    expect(screenReader.speak).toHaveBeenCalledWith(
      'Suspect filter options loaded'
    );
  });

  it('should update selection and call callbacks', async () => {
    const event = { detail: { value: 'Scene A' } };
    await component.onSelectionChange(event);

    expect(component.selectedSceneLocal).toBe('Scene A');
    expect(onSceneChangeSpy).toHaveBeenCalledWith('Scene A');
    expect(screenReader.speak).toHaveBeenCalledWith(
      'Location selected: Scene A'
    );
    expect(popoverController.dismiss).toHaveBeenCalled();
  });

  it('should select "all locations" correctly', async () => {
    const event = { detail: { value: '' } };
    await component.onSelectionChange(event);

    expect(component.selectedSceneLocal).toBe('');
    expect(onSceneChangeSpy).toHaveBeenCalledWith('');
    expect(screenReader.speak).toHaveBeenCalledWith('All Locations selected');
    expect(popoverController.dismiss).toHaveBeenCalled();
  });

  it('should clear filters and dismiss popover', async () => {
    await component.clearAndClose();

    expect(clearFiltersSpy).toHaveBeenCalled();
    expect(screenReader.speak).toHaveBeenCalledWith('Filters cleared');
    expect(popoverController.dismiss).toHaveBeenCalled();
  });
});
