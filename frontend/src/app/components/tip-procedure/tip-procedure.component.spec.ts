import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TipProcedureComponent } from './tip-procedure.component';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';

describe('TipProcedureComponent', () => {
  let component: TipProcedureComponent;
  let fixture: ComponentFixture<TipProcedureComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [IonicModule, TipProcedureComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TipProcedureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the correct number of accordion items', () => {
    const accordionItems = fixture.debugElement.queryAll(
      By.css('ion-accordion')
    );
    expect(accordionItems.length).toBe(component.steps.length);
  });
});
