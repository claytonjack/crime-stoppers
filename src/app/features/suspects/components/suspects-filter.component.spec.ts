import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SuspectsFilterComponent } from './suspects-filter.component';
import { PopoverController } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

describe('SuspectsFilterComponent', () => {
  let component: SuspectsFilterComponent;
  let fixture: ComponentFixture<SuspectsFilterComponent>;
  let popoverCtrlSpy: jasmine.SpyObj<PopoverController>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('PopoverController', ['dismiss']);

    await TestBed.configureTestingModule({
      imports: [SuspectsFilterComponent, FormsModule],
      providers: [{ provide: PopoverController, useValue: spy }],
    }).compileComponents();

    fixture = TestBed.createComponent(SuspectsFilterComponent);
    component = fixture.componentInstance;
    popoverCtrlSpy = TestBed.inject(
      PopoverController
    ) as jasmine.SpyObj<PopoverController>;
  });

  it('should initialize selectedSceneLocal from input', () => {
    component.selectedScene = 'Oakville';
    component.ngOnInit();
    expect(component.selectedSceneLocal).toBe('Oakville');
  });

  it('should call onSceneChange and dismiss popover on selection change', () => {
    const changeSpy = jasmine.createSpy('onSceneChange');
    component.onSceneChange = changeSpy;

    component.onSelectionChange({ detail: { value: 'Milton' } });

    expect(component.selectedSceneLocal).toBe('Milton');
    expect(changeSpy).toHaveBeenCalledWith('Milton');
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
