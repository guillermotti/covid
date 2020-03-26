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
  responsiveType = '';
  responsiveMenu = 'hidden';

  constructor(translate: TranslateService, private router: Router) {
    // this language will be used as a fallback when a translation isn't found in the current language
    // translate.setDefaultLang('es');
    // the lang to use, if the lang isn't available, it will use the current loader to get them
    //  translate.use('es');
  }

  onActivate() {
    window.scroll(0, 0);
  }

  ngDoCheck() {
    if (window.screen.width < 599) { // 768px portrait
      this.responsiveType = 'mobile';
    } else if (window.screen.width >= 599 && window.screen.width < 960){
      this.responsiveType = 'tablet-sm';
    } else if (window.screen.width >= 960 && window.screen.width < 1024) {
      this.responsiveType = 'tablet';
    } else if (window.screen.width >= 1024 && window.screen.width < 1280) {
      this.responsiveType = 'desktop-sm';
    } else if (window.screen.width >= 1280 && window.screen.width <= 1920) {
      this.responsiveType = 'desktop';
    } else {
      this.responsiveType = 'large-screen';
    }
  }

  navigateTo(screen: string) {
    if (screen === 'github') {
      window.open('https://github.com/guillermotti/covid');
    } else if (screen === 'kofi') {
      window.open('https://ko-fi.com/guillermotti');
    } else {
      this.router.navigateByUrl(screen);
    }
  }

  showMenu() {
    this.responsiveMenu = this.responsiveMenu === 'shown' ? 'hidden' : 'shown';
  }
}
