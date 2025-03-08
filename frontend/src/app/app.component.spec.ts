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
    // Register icons before test execution
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
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create the app', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
