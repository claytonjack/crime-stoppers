import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CrimeStatsPage } from './crime-stats.page';

describe('CrimeStatsPage', () => {
  let component: CrimeStatsPage;
  let fixture: ComponentFixture<CrimeStatsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CrimeStatsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
