import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Input, Pipe, PipeTransform } from '@angular/core';
import { By } from '@angular/platform-browser';

import { VolunteerPage } from './volunteer.page';
import { ScreenReaderService } from '@app/core/pages/settings/services/screen-reader.service';

import {
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonItem,
  IonLabel,
  IonItemDivider,
  IonText,
  IonButton,
} from '@ionic/angular/standalone';

@Pipe({ name: 'translate', standalone: true })
class TranslatePipeMock implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  template: `<div>{{ title }}</div>`,
})
class HeaderComponentMock {
  @Input() title!: string;
}

describe('VolunteerPage', () => {
  let component: VolunteerPage;
  let fixture: ComponentFixture<VolunteerPage>;
  let screenReader: jasmine.SpyObj<ScreenReaderService>;

  beforeEach(async () => {
    const screenReaderSpy = jasmine.createSpyObj('ScreenReaderService', [
      'speak',
    ]);

    await TestBed.configureTestingModule({
      imports: [
        VolunteerPage,
        HeaderComponentMock,
        TranslatePipeMock,
        IonContent,
        IonGrid,
        IonRow,
        IonCol,
        IonItem,
        IonLabel,
        IonItemDivider,
        IonText,
        IonButton,
      ],
      providers: [{ provide: ScreenReaderService, useValue: screenReaderSpy }],
    })
      .overrideComponent(VolunteerPage, {
        set: {
          imports: [
            HeaderComponentMock,
            TranslatePipeMock,
            IonContent,
            IonGrid,
            IonRow,
            IonCol,
            IonItem,
            IonLabel,
            IonItemDivider,
            IonText,
            IonButton,
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(VolunteerPage);
    component = fixture.componentInstance;
    screenReader = TestBed.inject(
      ScreenReaderService
    ) as jasmine.SpyObj<ScreenReaderService>;

    fixture.detectChanges();
  });

  it('should create VolunteerPage', () => {
    expect(component).toBeTruthy();
  });

  it('should announce page on init', async () => {
    await component.ngOnInit();
    expect(screenReader.speak).toHaveBeenCalledWith('Volunteer page loaded.');
    expect(screenReader.speak).toHaveBeenCalledWith(
      'Join Crime Stoppers as a volunteer. Help keep your community safe.'
    );
  });

  it('should render app-header component', () => {
    const header = fixture.debugElement.query(By.css('app-header'));
    expect(header).toBeTruthy();
  });

  it('should render "Why Join Our Team" heading', () => {
    const title = fixture.debugElement.query(By.css('h2'));
    expect(title.nativeElement.textContent).toContain(
      'feature.volunteer.hero.title'
    );
  });

  it('should render hero content', () => {
    const content = fixture.debugElement.query(By.css('.hero-content'));
    expect(content.nativeElement.textContent).toContain(
      'feature.volunteer.hero.description'
    );
  });

  it('should render application steps', () => {
    const steps = fixture.debugElement.queryAll(
      By.css('.info-header ion-label')
    );
    expect(steps.length).toBe(3);

    const labels = steps.map((lbl) => lbl.nativeElement.textContent.trim());

    expect(labels).toEqual([
      'feature.volunteer.howToApply.steps.step1.title',
      'feature.volunteer.howToApply.steps.step2.title',
      'feature.volunteer.howToApply.steps.step3.title',
    ]);
  });

  it('should call openPdf when application buttons are clicked', () => {
    spyOn(component, 'openPdf');

    const buttons = fixture.debugElement.queryAll(By.css('ion-button'));
    expect(buttons.length).toBe(3);

    buttons[0].triggerEventHandler('click', null);
    expect(component.openPdf).toHaveBeenCalledWith(
      'https://www.haltoncrimestoppers.ca/file_uploads/2025_volunteer_application___fillable_013519.pdf_182433.pdf',
      'Adult Volunteer'
    );

    buttons[1].triggerEventHandler('click', null);
    expect(component.openPdf).toHaveBeenCalledWith(
      'https://www.haltoncrimestoppers.ca/file_uploads/2025_youth_volunteer_application___fillable_013546.pdf_182502.pdf',
      'Youth Volunteer'
    );

    buttons[2].triggerEventHandler('click', null);
    expect(component.openPdf).toHaveBeenCalledWith(
      'https://www.haltoncrimestoppers.ca/file_uploads/2018_board_of_directors_application___fillable_013608.pdf',
      'Board Member'
    );
  });
});
