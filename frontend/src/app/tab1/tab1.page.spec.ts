import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  provideIonicAngular,
  ActionSheetController,
} from '@ionic/angular/standalone';
import { Tab1Page } from './tab1.page';

describe('Tab1Page', () => {
  let component: Tab1Page;
  let fixture: ComponentFixture<Tab1Page>;
  let actionSheetCtrl: ActionSheetController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tab1Page],
      providers: [provideIonicAngular()],
    }).compileComponents();

    fixture = TestBed.createComponent(Tab1Page);
    component = fixture.componentInstance;
    actionSheetCtrl = TestBed.inject(ActionSheetController);
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
    const presentSpy = spyOn(actionSheetCtrl, 'create').and.returnValue({
      present: jasmine.createSpy('present'),
    } as any);

    await component.openTipOptions();
    expect(presentSpy).toHaveBeenCalled();
  });
});
