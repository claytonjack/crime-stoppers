import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SideMenuComponent } from './side-menu.component';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('SideMenuComponent', () => {
  let component: SideMenuComponent;
  let fixture: ComponentFixture<SideMenuComponent>;
  let menuControllerSpy: jasmine.SpyObj<MenuController>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(waitForAsync(() => {
    // Create spies for the menuController and router
    menuControllerSpy = jasmine.createSpyObj('MenuController', ['close']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [SideMenuComponent, RouterTestingModule],
      providers: [
        { provide: MenuController, useValue: menuControllerSpy },
        { provide: Router, useValue: routerSpy },
        provideIonicAngular(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SideMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call router.navigate() when goToSettings is called', async () => {
    // Call the goToSettings method
    await component.goToSettings();

    // Assert that router.navigate was called with the correct argument
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/settings']);
  });

  it('should have ion-menu element', () => {
    const menuElement = fixture.nativeElement.querySelector('ion-menu');

    // Assert that the ion-menu element exists
    expect(menuElement).toBeTruthy();
  });

  it('should have ion-list inside ion-content', () => {
    const ionContent = fixture.nativeElement.querySelector('ion-content');
    const ionList = ionContent.querySelector('ion-list');

    // Assert that ion-list is inside ion-content
    expect(ionList).toBeTruthy();
  });

  it('should have ion-item inside ion-list', () => {
    const ionList = fixture.nativeElement.querySelector('ion-list');
    const ionItem = ionList.querySelector('ion-item');

    // Assert that ion-item is present inside ion-list
    expect(ionItem).toBeTruthy();
  });

  it('should trigger goToSettings() when ion-item is clicked', async () => {
    const ionItem = fixture.nativeElement.querySelector('ion-item');

    // Spy on goToSettings method
    spyOn(component, 'goToSettings').and.callThrough();

    // Simulate click on ion-item
    ionItem.click();

    // Assert that goToSettings was called when ion-item is clicked
    expect(component.goToSettings).toHaveBeenCalled();
  });
});
