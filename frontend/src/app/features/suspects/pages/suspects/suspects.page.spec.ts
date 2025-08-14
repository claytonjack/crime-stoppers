import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SuspectsPage } from './suspects.page';

describe('SuspectsPage', () => {
  let component: SuspectsPage;
  let fixture: ComponentFixture<SuspectsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SuspectsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
