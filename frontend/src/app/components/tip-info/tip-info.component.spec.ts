import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TipInfoComponent } from './tip-info.component';

describe('TipInfoComponent', () => {
  let component: TipInfoComponent;
  let fixture: ComponentFixture<TipInfoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TipInfoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TipInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
