import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SettingsPage } from './settings.page';
import { SettingsPageService } from '../../services/settings-page/settings-page.service';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { of } from 'rxjs';

describe('SettingsPage', () => {
  let component: SettingsPage;
  let fixture: ComponentFixture<SettingsPage>;
  let settingsPageServiceSpy: jasmine.SpyObj<SettingsPageService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let navControllerSpy: jasmine.SpyObj<NavController>;

  beforeEach(waitForAsync(() => {
    // Create a spy object for SettingsPageService with its current methods
    settingsPageServiceSpy = jasmine.createSpyObj('SettingsPageService', [
      'presentThemeActionSheet',
      'presentFontSizeActionSheet',
      'presentPrivacyModeActionSheet',
      'presentResetSettingsAlert',
    ]);

    // Mock the Observable properties from the service
    Object.defineProperty(settingsPageServiceSpy, 'theme$', {
      get: () => of('system'),
    });
    Object.defineProperty(settingsPageServiceSpy, 'fontSize$', {
      get: () => of('medium'),
    });
    Object.defineProperty(settingsPageServiceSpy, 'privacyMode$', {
      get: () => of(false),
    });

    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    navControllerSpy = jasmine.createSpyObj('NavController', [
      'navigateForward',
      'navigateBack',
    ]);

    TestBed.configureTestingModule({
      imports: [SettingsPage],
      providers: [
        { provide: SettingsPageService, useValue: settingsPageServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: NavController, useValue: navControllerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call presentThemeActionSheet on onThemeClick', async () => {
    await component.onThemeClick();
    expect(settingsPageServiceSpy.presentThemeActionSheet).toHaveBeenCalled();
  });

  it('should call presentFontSizeActionSheet on onFontSizeClick', async () => {
    await component.onFontSizeClick();
    expect(
      settingsPageServiceSpy.presentFontSizeActionSheet
    ).toHaveBeenCalled();
  });

  it('should call presentPrivacyModeActionSheet on onPrivacyModeClick', async () => {
    await component.onPrivacyModeClick();
    expect(
      settingsPageServiceSpy.presentPrivacyModeActionSheet
    ).toHaveBeenCalled();
  });

  it('should call presentResetSettingsAlert on onResetSettings', async () => {
    await component.onResetSettings();
    expect(settingsPageServiceSpy.presentResetSettingsAlert).toHaveBeenCalled();
  });
});
