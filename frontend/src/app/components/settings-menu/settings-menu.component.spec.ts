import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SettingsMenuComponent } from './settings-menu.component';
import { SettingsManagerService } from '../../services/settings/settings-manager.service';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { of } from 'rxjs';

describe('SettingsMenuComponent', () => {
  let component: SettingsMenuComponent;
  let fixture: ComponentFixture<SettingsMenuComponent>;
  let settingsManagerSpy: jasmine.SpyObj<SettingsManagerService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let navControllerSpy: jasmine.SpyObj<NavController>;

  beforeEach(waitForAsync(() => {
    settingsManagerSpy = jasmine.createSpyObj('SettingsManagerService', [
      'setTheme',
      'setFontSize',
      'setPrivacyMode',
      'resetAllSettings',
      'settings$',
    ]);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    navControllerSpy = jasmine.createSpyObj('NavController', [
      'navigateForward',
      'navigateBack',
    ]);

    settingsManagerSpy.settings$ = of({
      theme: 'system',
      fontSize: 'medium',
      privacyMode: false,
    });

    TestBed.configureTestingModule({
      imports: [SettingsMenuComponent],
      providers: [
        { provide: SettingsManagerService, useValue: settingsManagerSpy },
        { provide: Router, useValue: routerSpy },
        { provide: NavController, useValue: navControllerSpy }, // Mock NavController
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call setTheme on theme change', () => {
    const event = { detail: { value: 'dark' } } as CustomEvent;
    component.onThemeChange(event);
    expect(settingsManagerSpy.setTheme).toHaveBeenCalledWith('dark');
  });

  it('should call setFontSize on font size change', () => {
    const event = { detail: { value: 2 } } as CustomEvent;
    component.onFontSizeRangeChange(event);
    expect(settingsManagerSpy.setFontSize).toHaveBeenCalledWith('large');
  });

  it('should navigate to privacy mode when enabled', () => {
    const event = { detail: { checked: true } } as CustomEvent;
    component.onPrivacyModeChange(event);
    expect(settingsManagerSpy.setPrivacyMode).toHaveBeenCalledWith(true);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/privacy-mode']);
  });

  it('should navigate to home when privacy mode is disabled', () => {
    const event = { detail: { checked: false } } as CustomEvent;
    component.onPrivacyModeChange(event);
    expect(settingsManagerSpy.setPrivacyMode).toHaveBeenCalledWith(false);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should reset settings when resetSettings is called', () => {
    component.privacyMode = true;
    component.resetSettings();
    expect(settingsManagerSpy.resetAllSettings).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  });
});
