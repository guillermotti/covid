import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LanguageService } from '../language.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  allData: any = {};
  countriesData: any[];
  updated: Date;
  language: string;
  isTotalSelected: boolean = true;
  isDeceasedSelected: boolean = false;
  isCriticalSelected: boolean = false;
  isActiveSelected: boolean = false;
  isRecoveredSelected: boolean = false;
  isBarSelected: boolean = true;
  isGaugeSelected: boolean = false;
  isPieSelected: boolean = false
  chart: string = 'bar';
  colorScheme: any = {
    domain: ['#40486a', '#4fd0f9', '#8f99af', '#95a7f6', "#6e7cb6", "#485177", "#313751", "#3b9bb9", "#276579", "#4fd0f9", "#12303a", "#5b616f", "#cedcfb", "#8f99af", "#aab0b4", "#99acbc"]
  }
  chartNumberItems: any[] = [];
  selected: number = 10;
  chartType: string = 'cases';
  responsiveType = '';

  displayedColumns: string[] = ['country', 'confirmed', 'critical', 'deceased', 'active', 'recovered'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  //Charts
  barChart = {
    showXAxis: true,
    showYAxis: true,
    showXAxisLabel: true,
    showDataLabel: true,
    data: []
  }

  pieChart = {
    showLabels: true,
    isDoughnut: false,
    data: []
  }

  gaugeChart = {
    data: []
  }

  constructor(private httpClient: HttpClient, private languageService: LanguageService,
    private snackBar: MatSnackBar, private translateService: TranslateService, private router: Router) {
    this.languageService.selectLanguage.subscribe(language => {
      this.language = language;
    });
    this.language = this.translateService.currentLang;
    for (let i = 2; i <= 20; i++) {
      this.chartNumberItems.push(i);
    }
    this.httpClient.get('https://corona.lmao.ninja/v2/all').subscribe(response => {
      this.allData = response;
      this.updated = new Date(response['updated']);
      this.httpClient.get('https://corona.lmao.ninja/v2/countries').subscribe(res => {
        this.countriesData = res as [];
        this.allData.critical = 0;
        this.countriesData.map(item => {
          this.allData.critical = this.allData.critical + item.critical;
        });
        this.countriesData.sort((a, b) => { return b['cases'] - a['cases'] });
        this.dataSource = new MatTableDataSource(this.countriesData);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.setChart(this.barChart, 'country', this.chartType, this.selected);
        this.setChart(this.pieChart, 'country', this.chartType, this.selected);
        this.setChart(this.gaugeChart, 'country', this.chartType, this.selected);
      });
    });

  }

  ngOnInit(): void {
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  setChart(chart: object, yLabel: string, xLabel: string, number: number) {
    chart['data'] = [];
    this.countriesData.sort((a, b) => { return b[xLabel] - a[xLabel] });
    this.countriesData.map(item => {
      if (chart['data'].length < number) {
        chart['data'].push({ name: item[yLabel], value: item[xLabel] });
      }
    })
    Object.assign(this, chart['data']);
  }

  onSelect(data): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
    if (navigator.userAgent.match(/Android/i)
      || navigator.userAgent.match(/webOS/i)
      || navigator.userAgent.match(/iPhone/i)
      || navigator.userAgent.match(/iPad/i)
      || navigator.userAgent.match(/iPod/i)
      || navigator.userAgent.match(/BlackBerry/i)
      || navigator.userAgent.match(/Windows Phone/i)) {
      this.snackBar.open(data.name, data.value, {
        duration: 4000,
      });
    }
  }

  ngDoCheck() {
    if (window.screen.width < 599) { // 768px portrait
      this.responsiveType = 'mobile';
    } else if (window.screen.width >= 599 && window.screen.width < 960) {
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

  onActivate(data): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

  select(type: string) {
    this.chartType = type;
    switch (type) {
      case 'cases': {
        this.isTotalSelected = true;
        this.isDeceasedSelected = false;
        this.isCriticalSelected = false
        this.isActiveSelected = false;
        this.isRecoveredSelected = false;
        break;
      }
      case 'deaths': {
        this.isTotalSelected = false;
        this.isDeceasedSelected = true;
        this.isCriticalSelected = false
        this.isActiveSelected = false;
        this.isRecoveredSelected = false;
        break;
      }
      case 'critical': {
        this.isTotalSelected = false;
        this.isDeceasedSelected = false;
        this.isCriticalSelected = true
        this.isActiveSelected = false;
        this.isRecoveredSelected = false;
        break;
      }
      case 'active': {
        this.isTotalSelected = false;
        this.isDeceasedSelected = false;
        this.isCriticalSelected = false
        this.isActiveSelected = true;
        this.isRecoveredSelected = false;
        break;
      }
      case 'recovered': {
        this.isTotalSelected = false;
        this.isDeceasedSelected = false;
        this.isCriticalSelected = false
        this.isActiveSelected = false;
        this.isRecoveredSelected = true;
        break;
      }
    }
    this.setChart(this.barChart, 'country', this.chartType, this.selected);
    this.setChart(this.pieChart, 'country', this.chartType, this.selected);
    this.setChart(this.gaugeChart, 'country', this.chartType, this.selected);
  }

  changeChart(event: any) {
    const number = event.value;
    this.selected = number;
    this.setChart(this.barChart, 'country', this.chartType, number);
    this.setChart(this.pieChart, 'country', this.chartType, this.selected);
    this.setChart(this.gaugeChart, 'country', this.chartType, this.selected);
  }

  selectChart(type: string) {
    this.chart = type;
    switch (type) {
      case 'bar': {
        this.isBarSelected = true;
        this.isPieSelected = false;
        this.isGaugeSelected = false;
        break;
      }
      case 'pie': {
        this.isBarSelected = false;
        this.isPieSelected = true;
        this.isGaugeSelected = false;
        break;
      }
      case 'gauge': {
        this.isBarSelected = false;
        this.isPieSelected = false;
        this.isGaugeSelected = true;
        break;
      }
    }
  }

  navigateTo(country: string) {
    this.router.navigate(['/countries'], { queryParams: { country } });
  }

}
