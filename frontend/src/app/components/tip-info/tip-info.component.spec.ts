import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TipInfoComponent } from './tip-info.component';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';

describe('TipInfoComponent', () => {
  let component: TipInfoComponent;
  let fixture: ComponentFixture<TipInfoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [IonicModule, TipInfoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TipInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should open the modal when isOpen is set to true', async () => {
    spyOn(component.modal, 'present');

    component.isOpen = true;
    fixture.detectChanges();

    expect(component.modal.present).toHaveBeenCalled();
  });

  it('should close the modal when isOpen is set to false', async () => {
    spyOn(component.modal, 'dismiss');

    component.isOpen = false;
    fixture.detectChanges();

    expect(component.modal.dismiss).toHaveBeenCalled();
  });
});
