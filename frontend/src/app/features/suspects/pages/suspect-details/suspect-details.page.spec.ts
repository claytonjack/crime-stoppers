import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SuspectDetailsPage } from './suspect-details.page';

describe('SuspectDetailsPage', () => {
  let component: SuspectDetailsPage;
  let fixture: ComponentFixture<SuspectDetailsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SuspectDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
