import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { TranslateModule } from '@ngx-translate/core';
import { ScreenReaderService } from '@app/core/pages/settings/services/screen-reader.service';
import { By } from '@angular/platform-browser';
import { IonButton } from '@ionic/angular/standalone';
import { NgIcon } from '@ng-icons/core';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let screenReaderSpy: jasmine.SpyObj<ScreenReaderService>;

  beforeEach(waitForAsync(() => {
    const spy = jasmine.createSpyObj('ScreenReaderService', ['speak']);

    TestBed.configureTestingModule({
      imports: [HeaderComponent, TranslateModule.forRoot()],
      providers: [{ provide: ScreenReaderService, useValue: spy }],
    }).compileComponents();

    screenReaderSpy = TestBed.inject(
      ScreenReaderService
    ) as jasmine.SpyObj<ScreenReaderService>;
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the title', () => {
    component.title = 'Test Page';
    fixture.detectChanges();

    const titleEl = fixture.debugElement.query(
      By.css('ion-title')
    ).nativeElement;
    expect(titleEl.textContent).toContain('Test Page');
  });

  it('should call screen reader on ngOnInit with title', async () => {
    component.title = 'Test Page';
    await component.ngOnInit();
    expect(screenReaderSpy.speak).toHaveBeenCalledWith('Test Page page loaded');
  });

  it('should not call screen reader on ngOnInit if title is empty', async () => {
    component.title = '';
    await component.ngOnInit();
    expect(screenReaderSpy.speak).not.toHaveBeenCalled();
  });

  it('should render menu button when showMenuButton is true', () => {
    component.showMenuButton = true;
    fixture.detectChanges();

    const buttonEl = fixture.debugElement.query(By.directive(IonButton));
    expect(buttonEl).toBeTruthy();
  });

  it('should not render menu button when showMenuButton is false', () => {
    component.showMenuButton = false;
    fixture.detectChanges();

    const buttonEl = fixture.debugElement.query(By.directive(IonButton));
    expect(buttonEl).toBeNull();
  });

  it('should announce opening side menu when menu button clicked', async () => {
    component.showMenuButton = true;
    fixture.detectChanges();

    await component.onMenuButtonClick();
    expect(screenReaderSpy.speak).toHaveBeenCalledWith('Opening side menu');
  });
});
