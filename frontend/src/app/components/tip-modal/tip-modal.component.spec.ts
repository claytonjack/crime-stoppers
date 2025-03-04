import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TipModalComponent } from './tip-modal.component';

describe('TipModalComponent', () => {
  let component: TipModalComponent;
  let fixture: ComponentFixture<TipModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TipModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TipModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
