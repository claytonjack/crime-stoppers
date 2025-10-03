import { Injectable } from '@angular/core';
import { of } from 'rxjs';

import { Observable, Subject } from 'rxjs';

@Injectable()
export class TranslateServiceMock {
  get(key: any) {
    return of(key);
  }
  instant(key: any): any {
    return key;
  }
  use(lang: string) {
    return of(lang);
  }
  setDefaultLang(lang: string) {}
  addLangs(langs: string[]) {}
  stream(key: any) {
    return of(key);
  }
  getTranslation(lang: string) {
    return of({});
  }
  translations: Record<string, any> = {};
  currentLang = 'en';

  // Add subjects to simulate language/translation change events
  private _onLangChange = new Subject<any>();
  private _onDefaultLangChange = new Subject<any>();
  private _onTranslationChange = new Subject<any>();

  get onLangChange(): Observable<any> {
    return this._onLangChange.asObservable();
  }
  get onDefaultLangChange(): Observable<any> {
    return this._onDefaultLangChange.asObservable();
  }
  get onTranslationChange(): Observable<any> {
    return this._onTranslationChange.asObservable();
  }
}
