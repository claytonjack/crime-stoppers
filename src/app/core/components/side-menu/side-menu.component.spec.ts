import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SideMenuComponent } from './side-menu.component';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { MenuController } from '@ionic/angular';
import { Router, NavigationEnd } from '@angular/router';
import { provideRouter } from '@angular/router';
import { PrivacyModeService } from 'src/app/core/pages/privacy-mode/services/privacy-mode.service';

describe('SideMenuComponent', () => {
  let component: SideMenuComponent;
  let fixture: ComponentFixture<SideMenuComponent>;
  let menuControllerSpy: jasmine.SpyObj<MenuController>;
  let router: Router;
  let privacyModeServiceSpy: jasmine.SpyObj<PrivacyModeService>;

  beforeEach(waitForAsync(() => {
    menuControllerSpy = jasmine.createSpyObj('MenuController', ['close']);
    privacyModeServiceSpy = jasmine.createSpyObj(
      'PrivacyModeService',
      ['toggle'],
      {
        isEnabled: false,
      }
    );

    TestBed.configureTestingModule({
      imports: [SideMenuComponent],
      providers: [
        { provide: MenuController, useValue: menuControllerSpy },
        { provide: PrivacyModeService, useValue: privacyModeServiceSpy },
        provideIonicAngular(),
        provideRouter([{ path: 'settings', component: SideMenuComponent }]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SideMenuComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);

    const mainContent = document.createElement('div');
    mainContent.id = 'main-content';
    document.body.appendChild(mainContent);

    fixture.detectChanges();
  }));

  afterEach(() => {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      document.body.removeChild(mainContent);
    }
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call router.navigate() when goToSettings is called', async () => {
    spyOn(router, 'navigate');

    await component.goToSettings();

    expect(router.navigate).toHaveBeenCalledWith(['/settings']);
  });

  it('should have ion-menu element', () => {
    const menuElement = fixture.nativeElement.querySelector('ion-menu');

    expect(menuElement).toBeTruthy();
  });

  it('should have ion-list inside ion-content', () => {
    const ionContent = fixture.nativeElement.querySelector('ion-content');
    const menuItems = ionContent.querySelector('.menu-items');

    expect(menuItems).toBeTruthy();
  });

  it('should have ion-item inside ion-list', () => {
    const menuItems = fixture.nativeElement.querySelector('.menu-items');
    const ionItem = menuItems.querySelector('ion-item');

    expect(ionItem).toBeTruthy();
  });

  it('should trigger goToSettings() when ion-item is clicked', async () => {
    const settingsItem = Array.from(
      fixture.nativeElement.querySelectorAll('ion-item')
    ).find((item: any) => item.textContent.includes('Settings')) as HTMLElement;

    expect(settingsItem).toBeTruthy();

    spyOn(component, 'goToSettings').and.callThrough();

    settingsItem.click();
    fixture.detectChanges();

    expect(component.goToSettings).toHaveBeenCalled();
  });
});
