import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TipProcedureComponent } from './tip-procedure.component';

describe('TipProcedureComponent', () => {
  let component: TipProcedureComponent;
  let fixture: ComponentFixture<TipProcedureComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TipProcedureComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TipProcedureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
