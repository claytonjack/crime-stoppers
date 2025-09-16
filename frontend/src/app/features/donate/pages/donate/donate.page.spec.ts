import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { DonatePage } from './donate.page';

describe('DonatePage', () => {
  let component: DonatePage;
  let fixture: ComponentFixture<DonatePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DonatePage],
      providers: [provideIonicAngular()],
    }).compileComponents();

    fixture = TestBed.createComponent(DonatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render without errors', () => {
    expect(fixture.nativeElement).toBeTruthy();
  });

  it('should have the correct selector', () => {
    // Check that the component is created with the expected selector
    const componentRef = fixture.componentRef;
    expect(componentRef.componentType).toBeDefined();
    expect(componentRef.instance).toBeInstanceOf(DonatePage);
  });
});
