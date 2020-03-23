import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LanguageService } from '../language.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  language: string = navigator.language;
  data = [];
  isLoaded = false;

  constructor(private httpClient: HttpClient, private languageService: LanguageService) {
    this.languageService.selectLanguage.subscribe(language => {
      this.language = language;
    });
    this.httpClient.get('https://corona.lmao.ninja/countries').subscribe(response => {
      const data = response as [];
      this.data = [];
      data.map(item => {
        if (item['country'] === 'USA') {
          this.data.push(['United States', item['cases']]);
        } else if (item['country'] === 'UK') {
          this.data.push(['United Kingdom', item['cases']]);
        } else {
          this.data.push([item['country'], item['cases']]);
        }
      });
      this.isLoaded = true;
    });
  }

  ngOnInit(): void {
  }

}
