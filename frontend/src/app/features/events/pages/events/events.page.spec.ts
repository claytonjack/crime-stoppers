import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventsPage } from './events.page';

describe('Tab5Page', () => {
  let component: EventsPage;
  let fixture: ComponentFixture<EventsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EventsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
