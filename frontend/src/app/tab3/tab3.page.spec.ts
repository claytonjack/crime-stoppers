import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { addIcons } from 'ionicons';
import { menu } from 'ionicons/icons';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonMenuToggle,
  IonIcon,
} from '@ionic/angular/standalone';
import { Tab3Page } from './tab3.page';

describe('Tab3Page', () => {
  let component: Tab3Page;
  let fixture: ComponentFixture<Tab3Page>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        IonHeader,
        IonToolbar,
        IonTitle,
        IonContent,
        IonButtons,
        IonButton,
        IonMenuToggle,
        IonIcon,
        Tab3Page,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Tab3Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have a header with the title "Map"', () => {
    const titleElement = fixture.debugElement.query(By.css('ion-title'));
    expect(titleElement).toBeTruthy();
    expect(titleElement.nativeElement.textContent.trim()).toBe('Map');
  });

  it('should have an iframe with the correct source', () => {
    const iframe = fixture.debugElement.query(By.css('iframe'));
    expect(iframe).toBeTruthy();
    expect(iframe.nativeElement.src).toBe(
      'https://experience.arcgis.com/experience/5372f09e53114a46a871a3a5c2a58a48/'
    );
    expect(iframe.nativeElement.style.width).toBe('100%');
    expect(iframe.nativeElement.style.height).toBe('100%');
    expect(iframe.nativeElement.style.border).toBe('none');
  });
});
