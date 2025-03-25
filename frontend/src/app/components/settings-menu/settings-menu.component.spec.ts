import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { SettingsMenuComponent } from './settings-menu.component';
import { SettingsManagerService } from '../../services/settings/settings-manager.service';
import { ThemeService } from '../../services/settings/theme.service';
import { FontSizeService } from '../../services/settings/font-size.service';
import { PrivacyModeService } from '../../services/settings/privacy-mode.service';
import { BehaviorSubject } from 'rxjs';

describe('SettingsMenuComponent', () => {
  let component: SettingsMenuComponent;
  let fixture: ComponentFixture<SettingsMenuComponent>;
  let settingsManagerServiceMock: jasmine.SpyObj<SettingsManagerService>;
  let themeServiceMock: jasmine.SpyObj<ThemeService>;
  let fontSizeServiceMock: jasmine.SpyObj<FontSizeService>;
  let privacyModeServiceMock: jasmine.SpyObj<PrivacyModeService>;

  // Create mock observables
  const themeMock$ = new BehaviorSubject<'light' | 'dark' | 'system'>('system');
  const fontSizeMock$ = new BehaviorSubject<'small' | 'medium' | 'large'>(
    'medium'
  );
  const privacyModeMock$ = new BehaviorSubject<boolean>(false);

  beforeEach(waitForAsync(() => {
    // Create spy objects for each service
    settingsManagerServiceMock = jasmine.createSpyObj(
      'SettingsManagerService',
      ['setTheme', 'setFontSize', 'setPrivacyMode', 'resetAllSettings']
    );
    themeServiceMock = jasmine.createSpyObj('ThemeService', ['applyTheme']);
    fontSizeServiceMock = jasmine.createSpyObj('FontSizeService', [
      'applyFontSize',
    ]);
    privacyModeServiceMock = jasmine.createSpyObj('PrivacyModeService', [
      'updatePrivacyMode',
    ]);

    // Configure the mock services
    Object.defineProperty(settingsManagerServiceMock, 'theme$', {
      value: themeMock$,
    });
    Object.defineProperty(settingsManagerServiceMock, 'fontSize$', {
      value: fontSizeMock$,
    });
    Object.defineProperty(settingsManagerServiceMock, 'privacyMode$', {
      value: privacyModeMock$,
    });

    TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), SettingsMenuComponent],
      providers: [
        {
          provide: SettingsManagerService,
          useValue: settingsManagerServiceMock,
        },
        { provide: ThemeService, useValue: themeServiceMock },
        { provide: FontSizeService, useValue: fontSizeServiceMock },
        { provide: PrivacyModeService, useValue: privacyModeServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with correct values from services', () => {
    expect(component.currentTheme).toBe('system');
    expect(component.fontSizeValue).toBe(1); // Assuming medium = 1
    expect(component.privacyMode).toBe(false);
  });

  it('should update theme when onThemeChange is called', () => {
    const mockEvent = { detail: { value: 'dark' } };
    component.onThemeChange(mockEvent as any);
    expect(settingsManagerServiceMock.setTheme).toHaveBeenCalledWith('dark');
  });

  it('should update font size when onFontSizeRangeChange is called', () => {
    const mockEvent = { detail: { value: 2 } };
    component.onFontSizeRangeChange(mockEvent as any);
    expect(settingsManagerServiceMock.setFontSize).toHaveBeenCalledWith(
      'large'
    );
  });

  it('should toggle privacy mode when onPrivacyModeChange is called', () => {
    const mockEvent = { detail: { checked: true } };
    component.onPrivacyModeChange(mockEvent as any);
    expect(settingsManagerServiceMock.setPrivacyMode).toHaveBeenCalledWith(
      true
    );
  });

  it('should reset all settings when resetSettings is called', () => {
    component.resetSettings();
    expect(settingsManagerServiceMock.resetAllSettings).toHaveBeenCalled();
  });

  it('should update component values when service observables emit new values', () => {
    // Simulate service emitting new values
    themeMock$.next('dark');
    fontSizeMock$.next('large');
    privacyModeMock$.next(true);

    // Detect the changes
    fixture.detectChanges();

    // Verify component state was updated
    expect(component.currentTheme).toBe('dark');
    expect(component.fontSizeValue).toBe(2); // large should be 2
    expect(component.privacyMode).toBe(true);
  });
});
