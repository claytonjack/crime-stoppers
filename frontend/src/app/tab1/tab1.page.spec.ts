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

  it('should have About Us selected by default', () => {
    expect(component.selectedSegment).toBe('about-us');
  });

  it('should switch to Tip Procedure section', () => {
    component.selectedSegment = 'tip-procedure';
    fixture.detectChanges();
    expect(component.selectedSegment).toBe('tip-procedure');
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
    const presentSpy = jasmine.createSpy('present');
    spyOn(actionSheetCtrl, 'create').and.returnValue(
      Promise.resolve({
        present: presentSpy,
      } as any)
    );

    await component.openTipOptions();
    expect(actionSheetCtrl.create).toHaveBeenCalled();
    expect(presentSpy).toHaveBeenCalled();
  });

  it('should open the web tip form correctly', async () => {
    const openSpy = spyOn(window, 'open');

    await component.openWebTip();
    expect(openSpy).toHaveBeenCalledWith(
      'https://www.p3tips.com/TipForm.aspx?ID=201',
      '_system'
    );
  });

  it('should open the phone dialer when selecting Call Tip Line', () => {
    const openSpy = spyOn(window, 'open');

    component.openTipOptions();
    openSpy.calls.reset(); // Reset before simulating button click
    component.openTipOptions();

    expect(openSpy).toHaveBeenCalledWith('tel:18002228477', '_system');
  });

  it('should initialize with 4 slides in the Swiper component', () => {
    expect(component.slides.length).toBe(4);
  });
});
