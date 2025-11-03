import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform } from '@angular/core';
import { of } from 'rxjs';

import { CommunityWatchPage } from './community-watch.page';
import { ScreenReaderService } from '@app/core/pages/settings/services/screen-reader.service';
import { InAppBrowser } from '@capacitor/inappbrowser';
import {
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';

// ---- Standalone TranslatePipe Mock ----
@Pipe({ name: 'translate', standalone: true })
class TranslatePipeMock implements PipeTransform {
  transform(value: string, args?: any): string {
    if (args?.date) {
      return `${value}: ${args.date}`;
    }
    return value;
  }
}

describe('CommunityWatchPage', () => {
  let component: CommunityWatchPage;
  let fixture: ComponentFixture<CommunityWatchPage>;
  let screenReader: jasmine.SpyObj<ScreenReaderService>;

  beforeEach(async () => {
    const screenReaderSpy = jasmine.createSpyObj('ScreenReaderService', ['speak']);

    await TestBed.configureTestingModule({
      imports: [
        CommunityWatchPage,
        IonContent,
        IonList,
        IonItem,
        IonLabel,
        IonHeader,
        IonTitle,
        IonToolbar,
        TranslatePipeMock, // use mock pipe
      ],
      providers: [
        { provide: ScreenReaderService, useValue: screenReaderSpy },
      ],
    })
      .overrideComponent(CommunityWatchPage, {
        set: {
          imports: [
            IonContent,
            IonList,
            IonItem,
            IonLabel,
            IonHeader,
            IonTitle,
            IonToolbar,
            TranslatePipeMock,
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(CommunityWatchPage);
    component = fixture.componentInstance;

    screenReader = TestBed.inject(ScreenReaderService) as jasmine.SpyObj<ScreenReaderService>;
    fixture.detectChanges(); // triggers ngOnInit
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have hero image path defined', () => {
    expect(component.heroImage).toBe('assets/images/community-watch.png');
  });

  it('should announce page and hero content on ngOnInit', async () => {
    await component.ngOnInit();
    expect(screenReader.speak).toHaveBeenCalledWith('Community Watch page loaded.');
    expect(screenReader.speak).toHaveBeenCalledWith(
      "Join your neighbours in Oakville's Ward 3 for the Community Watch pilot, a partnership with Crime Stoppers of Halton, Halton Regional Police, and the Halton Police Board."
    );
  });


});
