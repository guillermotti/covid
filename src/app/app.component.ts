import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'covid';
  constructor(translate: TranslateService, private router: Router) {
    // this language will be used as a fallback when a translation isn't found in the current language
    // translate.setDefaultLang('es');
    // the lang to use, if the lang isn't available, it will use the current loader to get them
    //  translate.use('es');
  }

  onActivate() {
    window.scroll(0, 0);
  }

  navigateTo(screen: string) {
    if (screen === 'github') {
      window.open('https://github.com/guillermotti/covid');
    } else {
      this.router.navigateByUrl(screen);
    }
  }
}
