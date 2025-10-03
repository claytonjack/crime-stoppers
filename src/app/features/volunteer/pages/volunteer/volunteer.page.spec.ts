import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { VolunteerPage } from './volunteer.page';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('VolunteerPage', () => {
  let component: VolunteerPage;
  let fixture: ComponentFixture<VolunteerPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [VolunteerPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VolunteerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the VolunteerPage', () => {
    expect(component).toBeTruthy();
  });

  it('should render main page title', () => {
    const pageTitle = fixture.debugElement.query(By.css('h2'))?.nativeElement;
    expect(pageTitle.textContent).toContain('Why Join Our Team?');
  });

  it('should render hero content', () => {
    const heroContent = fixture.debugElement.query(
      By.css('.hero-content')
    )?.nativeElement;
    expect(heroContent.textContent).toContain(
      'Volunteering with Crime Stoppers Halton offers you the opportunity'
    );
  });

  it('should render note about Halton Region', () => {
    const noteText = fixture.debugElement.query(
      By.css('ion-text p')
    )?.nativeElement;
    expect(noteText.textContent).toContain(
      'You must work, reside in, or have a substantial interest in the Halton Region'
    );
  });

  it('should render "How to Apply" steps', () => {
    const stepLabels = fixture.debugElement.queryAll(
      By.css('.info-header ion-label')
    );
    const expectedSteps = [
      'Step 1: Download Form',
      'Step 2: Complete the Application',
      'Step 3: Submit Your Application',
    ];
    const renderedSteps = stepLabels.map((label) =>
      label.nativeElement.textContent.trim()
    );
    expect(renderedSteps).toEqual(expectedSteps);
  });
  it('should render volunteer application buttons', () => {
    const applyRow = fixture.debugElement
      .queryAll(By.css('ion-row'))
      ?.slice(-1)[0];
    const buttons = applyRow.queryAll(By.css('ion-button'));

    expect(buttons.length).toBe(3);

    const buttonTexts = buttons.map((btn) =>
      btn.nativeElement.textContent.trim()
    );
    expect(buttonTexts).toEqual([
      'Adult Volunteer',
      'Youth Volunteer',
      'Board Member',
    ]);
  });

  it('should call openPdf with correct URL when buttons are clicked', () => {
    spyOn(component, 'openPdf');

    const applyRow = fixture.debugElement
      .queryAll(By.css('ion-row'))
      ?.slice(-1)[0];
    const buttons = applyRow.queryAll(By.css('ion-button'));

    buttons[0].triggerEventHandler('click', null);
    expect(component.openPdf).toHaveBeenCalledWith(
      'https://www.haltoncrimestoppers.ca/file_uploads/2025_volunteer_application___fillable_013519.pdf_182433.pdf'
    );

    buttons[1].triggerEventHandler('click', null);
    expect(component.openPdf).toHaveBeenCalledWith(
      'https://www.haltoncrimestoppers.ca/file_uploads/2025_youth_volunteer_application___fillable_013546.pdf_182502.pdf'
    );

    buttons[2].triggerEventHandler('click', null);
    expect(component.openPdf).toHaveBeenCalledWith(
      'https://www.haltoncrimestoppers.ca/file_uploads/2018_board_of_directors_application___fillable_013608.pdf'
    );
  });
});
