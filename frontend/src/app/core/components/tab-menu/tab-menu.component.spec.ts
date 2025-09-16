import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TabMenuComponent } from './tab-menu.component';
import { PrivacyModeService } from '../../../features/privacy-mode/services/privacy-mode.service';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { provideRouter } from '@angular/router';

describe('TabMenuComponent', () => {
  let component: TabMenuComponent;
  let fixture: ComponentFixture<TabMenuComponent>;
  let privacyModeService: jasmine.SpyObj<PrivacyModeService>;

  beforeEach(async () => {
    const privacyModeServiceSpy = jasmine.createSpyObj(
      'PrivacyModeService',
      [],
      {
        isEnabled: false,
      }
    );

    await TestBed.configureTestingModule({
      imports: [TabMenuComponent],
      providers: [
        provideIonicAngular(),
        provideRouter([]),
        { provide: PrivacyModeService, useValue: privacyModeServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TabMenuComponent);
    component = fixture.componentInstance;
    privacyModeService = TestBed.inject(
      PrivacyModeService
    ) as jasmine.SpyObj<PrivacyModeService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have environmentInjector injected', () => {
    expect(component.environmentInjector).toBeTruthy();
  });
});
