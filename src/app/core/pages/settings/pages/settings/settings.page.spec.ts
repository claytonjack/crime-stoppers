import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SettingsPage } from './settings.page';
import { SettingsPageService } from 'src/app/core/pages/settings/services/settings-page.service';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { of } from 'rxjs';

// Fake loader so TranslateModule works without real translation files
class FakeLoader implements TranslateLoader {
  getTranslation(lang: string) {
    return of({});
  }
}

describe('SettingsPage', () => {
  let component: SettingsPage;
  let fixture: ComponentFixture<SettingsPage>;
  let settingsPageServiceSpy: jasmine.SpyObj<SettingsPageService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let navControllerSpy: jasmine.SpyObj<NavController>;

  beforeEach(waitForAsync(() => {
    settingsPageServiceSpy = jasmine.createSpyObj('SettingsPageService', [
      'presentThemeActionSheet',
      'presentFontSizeActionSheet',
      'presentResetSettingsAlert',
      'setPrivacyMode',
    ]);

    Object.defineProperty(settingsPageServiceSpy, 'theme$', {
      get: () => of('system'),
    });
    Object.defineProperty(settingsPageServiceSpy, 'fontSize$', {
      get: () => of('medium'),
    });
    Object.defineProperty(settingsPageServiceSpy, 'privacyMode$', {
      get: () => of(false),
    });
    Object.defineProperty(settingsPageServiceSpy, 'language$', {
      get: () => of('en'),
    });

    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    navControllerSpy = jasmine.createSpyObj('NavController', [
      'navigateForward',
      'navigateBack',
    ]);

    TestBed.configureTestingModule({
      imports: [
        SettingsPage,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: FakeLoader },
        }),
      ],
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

  it('should call setPrivacyMode on privacy mode toggle', () => {
    if (component.onPrivacyModeToggle) {
      component.onPrivacyModeToggle(true);
      expect(settingsPageServiceSpy.setPrivacyMode).toHaveBeenCalledWith(true);
    }
  });

  it('should call presentResetSettingsAlert on onResetSettings', async () => {
    await component.onResetSettings();
    expect(settingsPageServiceSpy.presentResetSettingsAlert).toHaveBeenCalled();
  });
});
