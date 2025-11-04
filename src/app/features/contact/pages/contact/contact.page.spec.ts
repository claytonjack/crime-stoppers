import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactPage } from './contact.page';
import { ScreenReaderService } from '@app/core/pages/settings/services/screen-reader.service';
import { CUSTOM_ELEMENTS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { of } from 'rxjs';
import {
  IonContent,
  IonList,
  IonItem,
  IonLabel,
} from '@ionic/angular/standalone';

@Pipe({ name: 'translate', standalone: true })
class TranslatePipeMock implements PipeTransform {
  transform(value: string, args?: any): string {
    return value;
  }
}

describe('ContactPage', () => {
  let component: ContactPage;
  let fixture: ComponentFixture<ContactPage>;
  let screenReader: jasmine.SpyObj<ScreenReaderService>;

  beforeEach(async () => {
    const screenReaderSpy = jasmine.createSpyObj('ScreenReaderService', [
      'speak',
    ]);
    screenReaderSpy.speak.and.returnValue(Promise.resolve());

    await TestBed.configureTestingModule({
      imports: [
        ContactPage,
        IonContent,
        IonList,
        IonItem,
        IonLabel,
        TranslatePipeMock,
      ],
      providers: [{ provide: ScreenReaderService, useValue: screenReaderSpy }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .overrideComponent(ContactPage, {
        set: {
          imports: [IonContent, IonList, IonItem, IonLabel, TranslatePipeMock],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(ContactPage);
    component = fixture.componentInstance;
    screenReader = TestBed.inject(
      ScreenReaderService
    ) as jasmine.SpyObj<ScreenReaderService>;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call screen reader on ngOnInit', async () => {
    await component.ngOnInit();
    expect(screenReader.speak).toHaveBeenCalledWith('Contact Us page loaded.');
    expect(screenReader.speak).toHaveBeenCalledWith(
      'Find contact information for Crime Stoppers of Halton staff and board members.'
    );
  });

  it('should render main contact sections', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const sections = compiled.querySelectorAll('.contact-section');
    expect(sections.length).toBe(2);
    expect(sections[0].textContent).toContain(
      'feature.contact.sections.generalInquiries.title'
    );
    expect(sections[1].textContent).toContain(
      'feature.contact.sections.board.title'
    );
  });
});
