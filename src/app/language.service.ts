import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  selectLanguage: EventEmitter<any>;

  constructor() {
    this.selectLanguage = new EventEmitter();
  }

  setLanguage(language: string) {
    return this.selectLanguage.emit(language);
  }
}
