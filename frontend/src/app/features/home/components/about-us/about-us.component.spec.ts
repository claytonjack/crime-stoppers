import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AboutUsComponent } from './about-us.component';
import { By } from '@angular/platform-browser';

describe('AboutUsComponent', () => {
  let component: AboutUsComponent;
  let fixture: ComponentFixture<AboutUsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [AboutUsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AboutUsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have at least one about item', () => {
    expect(component.aboutItems.length).toBeGreaterThan(0);
  });

  it('should render the same number of about items as in the component', () => {
    fixture.detectChanges();
    const items = fixture.debugElement.queryAll(By.css('.info-item'));
    expect(items.length).toBe(component.aboutItems.length);
  });

  it('should display titles for each about item', () => {
    fixture.detectChanges();
    const labels = fixture.debugElement.queryAll(
      By.css('.info-header ion-label')
    );
    expect(labels.length).toBe(component.aboutItems.length);

    labels.forEach((label, index) => {
      expect(label.nativeElement.textContent.trim()).toBeTruthy();
    });
  });

  it('should display content for each about item', () => {
    fixture.detectChanges();
    const details = fixture.debugElement.queryAll(By.css('.info-content'));
    expect(details.length).toBe(component.aboutItems.length);

    details.forEach((detail, index) => {
      expect(detail.nativeElement.textContent.trim()).toBeTruthy();
    });
  });
});
