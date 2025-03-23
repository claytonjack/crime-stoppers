import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PrivacyModeComponent } from './privacy-mode.component';

describe('PrivacyModeComponent', () => {
  let component: PrivacyModeComponent;
  let fixture: ComponentFixture<PrivacyModeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [PrivacyModeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PrivacyModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
