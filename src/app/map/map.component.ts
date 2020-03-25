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
  mapOptions = {};
  mapData = [];
  updated: Date;
  isLoaded = false;
  isTotalSelected: boolean = true;
  isDeceasedSelected: boolean = false;
  isCriticalSelected: boolean = false;
  isActiveSelected: boolean = false;
  isRecoveredSelected: boolean = false;

  constructor(private httpClient: HttpClient, private languageService: LanguageService) {
    this.languageService.selectLanguage.subscribe(language => {
      this.language = language;
    });
    this.httpClient.get('https://corona.lmao.ninja/all').subscribe(response => {
      this.updated = new Date(response['updated']);
    });
    this.httpClient.get('https://corona.lmao.ninja/countries').subscribe(response => {
      this.data = response as [];
      this.setMap('cases');
      this.isLoaded = true;
    });
    this.mapOptions = { 
      // colorAxis: {colors: ['#EDEDED', '#FFCFDF', '#FF9EBF', '#FF6E9F', '#FF3D7F']},
      colorAxis: {colors: ['#F3F3F3', '#FACDD2', '#F29BA3', '#ED6B75', '#E73845']},
      backgroundColor: '#fff',
      datalessRegionColor: '#eee',
      defaultColor: '#eee',
     };
  }

  ngOnInit(): void {
  }

  setMap(type: string) {
    this.mapData = [];
    this.data.map(item => {
      if (item['country'] === 'USA') {
        this.mapData.push(['United States', item[type]]);
      } else if (item['country'] === 'UK') {
        this.mapData.push(['United Kingdom', item[type]]);
      } else if (item['country'] === 'S. Korea') {
        this.mapData.push(['South Korea', item[type]]);
      } else if (item['country'] === 'Congo') {
        this.mapData.push(['CG', item[type]]);
      } else {
        this.mapData.push([item['country'], item[type]]);
      }
    });
  }

  select(type: string) {
    this.setMap(type);
    switch (type) {
      case 'cases': {
        this.isTotalSelected = true;
        this.isDeceasedSelected = false;
        this.isCriticalSelected = false;
        this.isActiveSelected = false;
        this.isRecoveredSelected = false;
        break;
      }
      case 'deaths': {
        this.isTotalSelected = false;
        this.isDeceasedSelected = true;
        this.isCriticalSelected = false;
        this.isActiveSelected = false;
        this.isRecoveredSelected = false;
        break;
      }
      case 'critical': {
        this.isTotalSelected = false;
        this.isDeceasedSelected = false;
        this.isCriticalSelected = true;
        this.isActiveSelected = false;
        this.isRecoveredSelected = false;
        break;
      }
      case 'active': {
        this.isTotalSelected = false;
        this.isDeceasedSelected = false;
        this.isCriticalSelected = false;
        this.isActiveSelected = true;
        this.isRecoveredSelected = false;
        break;
      }
      case 'recovered': {
        this.isTotalSelected = false;
        this.isDeceasedSelected = false;
        this.isCriticalSelected = false;
        this.isActiveSelected = false;
        this.isRecoveredSelected = true;
        break;
      }
    }
  }

}
