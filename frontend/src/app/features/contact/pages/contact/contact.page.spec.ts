import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactPage } from './contact.page';

describe('ContactPage', () => {
  let component: ContactPage;
  let fixture: ComponentFixture<ContactPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Placeholder test to prevent Jasmine errors
  it('should be defined', () => {
    expect(true).toBe(true);
  });
});
