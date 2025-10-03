import { TranslateService } from '@ngx-translate/core';
import { TranslateServiceMock } from './core/test/translate-service.mock';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app.component';
import { addIcons } from 'ionicons';
import {
  menu,
  home,
  newspaper,
  map,
  help,
  information,
  call,
  globe,
  eye,
  compass,
  shield,
  megaphone,
  document,
  share,
  checkmark,
  cash,
  card,
  download,
  happy,
} from 'ionicons/icons';

describe('AppComponent', () => {
  beforeEach(async () => {
    addIcons({
      menu,
      home,
      newspaper,
      map,
      help,
      information,
      call,
      globe,
      eye,
      compass,
      shield,
      megaphone,
      document,
      share,
      checkmark,
      cash,
      card,
      download,
      happy,
    });

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter([]),
        { provide: TranslateService, useClass: TranslateServiceMock },
      ],
    }).compileComponents();
  });

  it('should create the app', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
