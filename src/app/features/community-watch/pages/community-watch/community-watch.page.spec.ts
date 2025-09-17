import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommunityWatchPage } from './community-watch.page';

describe('CommunityWatchPage', () => {
  let component: CommunityWatchPage;
  let fixture: ComponentFixture<CommunityWatchPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunityWatchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
