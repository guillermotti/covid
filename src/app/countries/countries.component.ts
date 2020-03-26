import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LanguageService } from '../language.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.scss']
})
export class CountriesComponent implements OnInit {

  language: string;
  updated: Date;
  data: any[] = [];
  myControl = new FormControl();
  filteredOptions: Observable<string[]>;
  historicCountrySelected: any = null;
  countrySelected: any = null;
  minDate: Date;
  maxDate: Date;

  //Charts
  colorScheme: any = {
    domain: ['#40486a', '#4fd0f9', '#8f99af', '#95a7f6', "#6e7cb6", "#485177", "#313751", "#3b9bb9", "#276579", "#4fd0f9", "#12303a", "5b616f", "cedcfb", "8f99af", "aab0b4", "99acbc"]
  };
  lineChart = {
    xAxis: true,
    yAxis: true,
    showYAxisLabel: true,
    showXAxisLabel: true,
    timeline: true,
    data: []
  }


  constructor(private httpClient: HttpClient, private languageService: LanguageService, private translateService: TranslateService) {
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 20, 0, 1);
    this.maxDate = new Date();
    this.languageService.selectLanguage.subscribe(language => {
      this.language = language;
    });
    this.language = this.translateService.currentLang;
    this.httpClient.get('https://corona.lmao.ninja/all').subscribe(response => {
      this.updated = new Date(response['updated']);
    });
    this.httpClient.get('https://corona.lmao.ninja/countries').subscribe(response => {
      this.data = response as [];
      this.filteredOptions = this.myControl.valueChanges
        .pipe(
          startWith(''),
          map(value => this._filter(value))
        );
    });
  }

  ngOnInit(): void {
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.data.filter(option => option['country'].toLowerCase().includes(filterValue));
  }

  selectCountry(event: any) {
    this.httpClient.get(`https://corona.lmao.ninja/v2/historical/${event.option.value}`).subscribe(response => {
      this.historicCountrySelected = response;
      this.lineChart.data = [];
      const cases = Object.entries(this.historicCountrySelected.timeline.cases);
      const deaths = Object.entries(this.historicCountrySelected.timeline.deaths);
      const seriesCases = [];
      const seriesDeaths = [];
      cases.map(item => {
        seriesCases.push({name: item[0], value: item[1]})
      });
      deaths.map(item => {
        seriesDeaths.push({name: item[0], value: item[1]})
      });
      this.lineChart.data.push({ name: 'Cases', series: seriesCases }, { name: 'Deaths', series: seriesDeaths})
      Object.assign(this, this.lineChart.data);
    });
    this.httpClient.get(`https://corona.lmao.ninja/countries/${event.option.value}`).subscribe(response => {
      this.countrySelected = response;
    });
  }

  // selectDate(event: any) {
  //   this.httpClient.get(`https://corona.lmao.ninja/countries/${event.option.value}`).subscribe(response => {
  //     this.countrySelected = response;
  //   });
  // }

  onSelect(data): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

}
