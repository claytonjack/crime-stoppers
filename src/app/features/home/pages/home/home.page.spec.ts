import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  provideIonicAngular,
  ActionSheetController,
} from '@ionic/angular/standalone';
import { HomePage } from './home.page';
import { ScreenReaderService } from '@app/core/services/screen-reader.service';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let actionSheetCtrl: ActionSheetController;
  let screenReaderService: jasmine.SpyObj<ScreenReaderService>;

  beforeEach(async () => {
    const screenReaderSpy = jasmine.createSpyObj('ScreenReaderService', [
      'speak',
    ]);

    await TestBed.configureTestingModule({
      imports: [HomePage],
      providers: [
        provideIonicAngular(),
        { provide: ScreenReaderService, useValue: screenReaderSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    actionSheetCtrl = TestBed.inject(ActionSheetController);
    screenReaderService = TestBed.inject(
      ScreenReaderService
    ) as jasmine.SpyObj<ScreenReaderService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open the tip modal', () => {
    component.openTipModal();
    expect(component.isModalOpen).toBeTrue();
  });

  it('should close the tip modal', () => {
    component.openTipModal();
    component.closeTipModal();
    expect(component.isModalOpen).toBeFalse();
  });

  it('should present action sheet on openTipOptions', async () => {
    const mockActionSheet = {
      present: jasmine.createSpy('present').and.returnValue(Promise.resolve()),
    };
    const createSpy = spyOn(actionSheetCtrl, 'create').and.returnValue(
      Promise.resolve(mockActionSheet as any)
    );

    await component.openTipOptions();

    expect(createSpy).toHaveBeenCalled();
    expect(mockActionSheet.present).toHaveBeenCalled();
  });
});
