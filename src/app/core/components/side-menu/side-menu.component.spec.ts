import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SideMenuComponent } from './side-menu.component';
import { TranslateModule } from '@ngx-translate/core';
import { MenuController } from '@ionic/angular/standalone';
import { ScreenReaderService } from '@app/core/pages/settings/services/screen-reader.service';
import { NotificationsService } from '@app/core/pages/settings/services/notifications.service';
import { PrivacyModeService } from 'src/app/core/pages/privacy-mode/services/privacy-mode.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('SideMenuComponent', () => {
  let component: SideMenuComponent;
  let fixture: ComponentFixture<SideMenuComponent>;

  let menuCtrlSpy: jasmine.SpyObj<MenuController>;
  let screenReaderSpy: jasmine.SpyObj<ScreenReaderService>;
  let notificationsSpy: jasmine.SpyObj<NotificationsService>;
  let privacyModeSpy: jasmine.SpyObj<PrivacyModeService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(waitForAsync(() => {
    // Mocks
    const mockMenuElement: any = {
      close: jasmine.createSpy('close').and.returnValue(Promise.resolve(true)),
      addEventListener: jasmine.createSpy('addEventListener'),
    };

    menuCtrlSpy = jasmine.createSpyObj('MenuController', ['close', 'get']);
    menuCtrlSpy.get.and.returnValue(Promise.resolve(mockMenuElement));
    menuCtrlSpy.close.and.returnValue(Promise.resolve(true));

    screenReaderSpy = jasmine.createSpyObj('ScreenReaderService', ['speak']);
    notificationsSpy = jasmine.createSpyObj('NotificationsService', [
      'triggerWeeklyTest',
      'triggerMonthlyTest',
      'triggerInactivityTest',
    ]);
    privacyModeSpy = jasmine.createSpyObj('PrivacyModeService', [], { isEnabled: false });
    Object.defineProperty(privacyModeSpy, 'isEnabled', { get: () => true });

    routerSpy = jasmine.createSpyObj('Router', ['navigate'], { events: of({}) });

    TestBed.configureTestingModule({
      imports: [SideMenuComponent, TranslateModule.forRoot()],
      providers: [
        { provide: MenuController, useValue: menuCtrlSpy },
        { provide: ScreenReaderService, useValue: screenReaderSpy },
        { provide: NotificationsService, useValue: notificationsSpy },
        { provide: PrivacyModeService, useValue: privacyModeSpy },
        { provide: Router, useValue: routerSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SideMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call screenReader.speak when testing weekly notifications', async () => {
    await component.testWeekly();
    expect(screenReaderSpy.speak).toHaveBeenCalledWith('Weekly notification test triggered');
    expect(notificationsSpy.triggerWeeklyTest).toHaveBeenCalled();
    expect(menuCtrlSpy.close).toHaveBeenCalledWith('side-menu');
  });

  it('should call screenReader.speak when testing monthly notifications', async () => {
    await component.testMonthly();
    expect(screenReaderSpy.speak).toHaveBeenCalledWith('Monthly notification test triggered');
    expect(notificationsSpy.triggerMonthlyTest).toHaveBeenCalled();
    expect(menuCtrlSpy.close).toHaveBeenCalledWith('side-menu');
  });

  it('should call screenReader.speak when testing inactivity notifications', async () => {
    await component.testInactivity();
    expect(screenReaderSpy.speak).toHaveBeenCalledWith('Inactivity notification test triggered');
    expect(notificationsSpy.triggerInactivityTest).toHaveBeenCalled();
    expect(menuCtrlSpy.close).toHaveBeenCalledWith('side-menu');
  });

  it('should navigate to suspects page', async () => {
    await component.goToSuspects();
    expect(screenReaderSpy.speak).toHaveBeenCalledWith('Navigating to Suspects page');
    expect(component.activePage).toBe('suspects');
    expect(menuCtrlSpy.close).toHaveBeenCalledWith('side-menu');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/suspects']);
  });

  it('should navigate to community watch page', async () => {
    await component.goToCommunityWatch();
    expect(screenReaderSpy.speak).toHaveBeenCalledWith('Navigating to Community Watch page');
    expect(component.activePage).toBe('community-watch');
    expect(menuCtrlSpy.close).toHaveBeenCalledWith('side-menu');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/community-watch']);
  });

  it('should navigate to contact page', async () => {
    await component.goToContact();
    expect(screenReaderSpy.speak).toHaveBeenCalledWith('Navigating to Contact page');
    expect(component.activePage).toBe('contact');
    expect(menuCtrlSpy.close).toHaveBeenCalledWith('side-menu');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/contact']);
  });

  it('should navigate to settings page', async () => {
    await component.goToSettings();
    expect(screenReaderSpy.speak).toHaveBeenCalledWith('Navigating to Settings page');
    expect(component.activePage).toBe('settings');
    expect(menuCtrlSpy.close).toHaveBeenCalledWith('side-menu');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/settings']);
  });

  it('should close menu and announce', async () => {
    await component.closeMenu();
    expect(screenReaderSpy.speak).toHaveBeenCalledWith('Closing side menu');
    expect(menuCtrlSpy.close).toHaveBeenCalledWith('side-menu');
  });

  it('should return privacy mode status', () => {
    expect(component.isPrivacyModeEnabled).toBeTrue();
  });
});
