import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform } from '@angular/core';
import { of } from 'rxjs';

import { TabMenuComponent } from './tab-menu.component';
import { PrivacyModeService } from 'src/app/core/pages/privacy-mode/services/privacy-mode.service';
import { ScreenReaderService } from 'src/app/core/pages/settings/services/screen-reader.service';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { provideRouter } from '@angular/router';

@Pipe({ name: 'translate', standalone: true })
class TranslatePipeMock implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

describe('TabMenuComponent', () => {
  let component: TabMenuComponent;
  let fixture: ComponentFixture<TabMenuComponent>;
  let privacyModeService: jasmine.SpyObj<PrivacyModeService>;
  let screenReader: jasmine.SpyObj<ScreenReaderService>;

  beforeEach(async () => {
    const screenReaderSpy = jasmine.createSpyObj('ScreenReaderService', [
      'speak',
    ]);
    const privacyModeSpy = jasmine.createSpyObj('PrivacyModeService', [], {
      isEnabled: false,
      isEnabled$: of(false),
    });

    await TestBed.configureTestingModule({
      imports: [TabMenuComponent, TranslatePipeMock],
      providers: [
        provideIonicAngular(),
        provideRouter([]),
        { provide: ScreenReaderService, useValue: screenReaderSpy },
        { provide: PrivacyModeService, useValue: privacyModeSpy },
      ],
    })
      .overrideComponent(TabMenuComponent, {
        set: {
          imports: [TranslatePipeMock],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(TabMenuComponent);
    component = fixture.componentInstance;

    screenReader = TestBed.inject(
      ScreenReaderService
    ) as jasmine.SpyObj<ScreenReaderService>;
    privacyModeService = TestBed.inject(
      PrivacyModeService
    ) as jasmine.SpyObj<PrivacyModeService>;

    (component as any).isEnabled$ = of(false);

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should return privacy mode status', () => {
    expect(component.isPrivacyModeEnabled).toBe(false);
    Object.defineProperty(privacyModeService, 'isEnabled', { value: true });
    expect(component.isPrivacyModeEnabled).toBe(true);
  });

  it('should announce home FAB click', async () => {
    await component.onHomeFabClick();
    expect(screenReader.speak).toHaveBeenCalledWith(
      'Home button clicked, navigating to home screen'
    );
  });
});
