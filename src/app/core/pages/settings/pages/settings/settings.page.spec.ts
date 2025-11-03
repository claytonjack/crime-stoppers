import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform } from '@angular/core';
import { of } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { SettingsPage } from './settings.page';
import { ScreenReaderService } from '@app/core/pages/settings/services/screen-reader.service';
import { SettingsPageService } from 'src/app/core/pages/settings/services/settings-page.service';
import { NotificationsService } from '@app/core/pages/settings/services/notifications.service';
import { BiometricAuthService } from '@app/core/services/authentication.service';
import { AlertController } from '@ionic/angular';
import {
  IonContent,
  IonItem,
  IonLabel,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonToggle,
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';

// ---- Standalone TranslatePipe Mock ----
@Pipe({ name: 'translate', standalone: true })
class TranslatePipeMock implements PipeTransform {
  transform(value: string, args?: any): string {
    return value;
  }
}

// ---- Mock Router ----
class RouterMock {
  navigate = jasmine.createSpy('navigate');
}

describe('SettingsPage', () => {
  let component: SettingsPage;
  let fixture: ComponentFixture<SettingsPage>;
  let screenReader: jasmine.SpyObj<ScreenReaderService>;
  let settingsService: jasmine.SpyObj<SettingsPageService>;
  let notificationsService: jasmine.SpyObj<NotificationsService>;
  let biometricService: jasmine.SpyObj<BiometricAuthService>;
  let alertController: jasmine.SpyObj<AlertController>;

  beforeEach(async () => {
    screenReader = jasmine.createSpyObj('ScreenReaderService', ['speak']);
    settingsService = jasmine.createSpyObj('SettingsPageService', [
      'presentThemeActionSheet',
      'presentFontSizeActionSheet',
      'presentResetSettingsActionSheet',
      'presentLanguageActionSheet',
      'setPrivacyMode'
    ], {
      theme$: of('light'),
      fontSize$: of('medium'),
      language$: of('en'),
      privacyMode$: of(false)
    });
    notificationsService = jasmine.createSpyObj('NotificationsService', ['setEnabled'], {
      notificationEnabled$: of(true)
    });
    biometricService = jasmine.createSpyObj('BiometricAuthService', [
      'enableAuth',
      'disableAuth',
      'checkBiometryAvailability',
      'getBiometryTypeName'
    ], {
      authEnabled$: of(true)
    });
    alertController = jasmine.createSpyObj('AlertController', ['create']);

    await TestBed.configureTestingModule({
      imports: [
        SettingsPage,
        IonContent,
        IonItem,
        IonLabel,
        IonHeader,
        IonTitle,
        IonToolbar,
        IonToggle,
        TranslatePipeMock,
        AsyncPipe
      ],
      providers: [
        { provide: ScreenReaderService, useValue: screenReader },
        { provide: SettingsPageService, useValue: settingsService },
        { provide: NotificationsService, useValue: notificationsService },
        { provide: BiometricAuthService, useValue: biometricService },
        { provide: AlertController, useValue: alertController },
        { provide: Router, useClass: RouterMock }
      ]
    })
    .overrideComponent(SettingsPage, {
      set: {
        imports: [
          IonContent,
          IonItem,
          IonLabel,
          IonHeader,
          IonTitle,
          IonToolbar,
          IonToggle,
          TranslatePipeMock,
          AsyncPipe
        ]
      }
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should announce page load on creation', async () => {
    expect(screenReader.speak).toHaveBeenCalledWith('Settings page loaded');
  });


  it('should call onThemeClick and present theme action sheet', async () => {
    await component.onThemeClick();
    expect(screenReader.speak).toHaveBeenCalledWith('Theme settings clicked');
    expect(settingsService.presentThemeActionSheet).toHaveBeenCalled();
  });

  it('should call onFontSizeClick and present font size action sheet', async () => {
    await component.onFontSizeClick();
    expect(screenReader.speak).toHaveBeenCalledWith('Font size settings clicked');
    expect(settingsService.presentFontSizeActionSheet).toHaveBeenCalled();
  });

  it('should call onLanguageClick and present language action sheet', async () => {
    await component.onLanguageClick();
    expect(screenReader.speak).toHaveBeenCalledWith('Language settings clicked');
    expect(settingsService.presentLanguageActionSheet).toHaveBeenCalled();
  });

  it('should call onResetSettings and present reset action sheet', async () => {
    await component.onResetSettings();
    expect(screenReader.speak).toHaveBeenCalledWith('Reset settings clicked');
    expect(settingsService.presentResetSettingsActionSheet).toHaveBeenCalled();
  });
});
