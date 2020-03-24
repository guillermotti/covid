import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LanguageService } from '../language.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  total_confirmed: number;
  total_deceased: number;
  total_recovered: number;
  updated: Date;
  language: string = navigator.language;
  isTotalSelected: boolean = true;
  isDeceasedSelected: boolean = false;
  isActiveSelected: boolean = false;
  isRecoveredSelected: boolean = false;
  isBarSelected: boolean = true;
  isGaugeSelected: boolean = false;
  isPieSelected: boolean = false
  data: any[];
  chart: string = 'bar';
  colorScheme: any = {
    domain: ['#40486a', '#4fd0f9', '#8f99af', '#95a7f6', "#6e7cb6", "#485177", "#313751", "#3b9bb9", "#276579", "#4fd0f9", "#12303a", "5b616f", "cedcfb", "8f99af", "aab0b4", "99acbc"]
  }
  chartNumberItems: any[] = [];
  selected: number = 5;
  chartType: string = 'cases';

  displayedColumns: string[] = ['country', 'confirmed', 'deceased', 'active', 'recovered'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  //Charts
  horizontalBarChart = {
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

  constructor(private httpClient: HttpClient, private languageService: LanguageService, private snackBar: MatSnackBar) {
    this.languageService.selectLanguage.subscribe(language => {
      this.language = language;
    });
    for (let i = 2; i <= 20; i++) {
      this.chartNumberItems.push(i);
    }
    this.httpClient.get('https://corona.lmao.ninja/all').subscribe(response => {
      this.total_confirmed = response['cases'];
      this.total_deceased = response['deaths'];
      this.total_recovered = response['recovered'];
      this.updated = new Date(response['updated']);
    });
    this.httpClient.get('https://corona.lmao.ninja/countries').subscribe(response => {
      this.data = response as [];
      this.dataSource = new MatTableDataSource(this.data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.setChart(this.horizontalBarChart, this.data, 'country', this.chartType, this.selected);
      this.setChart(this.pieChart, this.data, 'country', this.chartType, this.selected);
      this.setChart(this.gaugeChart, this.data, 'country', this.chartType, this.selected);
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

  setChart(chart: object, items: any[], yLabel: string, xLabel: string, number: number) {
    chart['data'] = [];
    items.sort((a, b) => { return b[xLabel] - a[xLabel] });
    items.map(item => {
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
        this.isActiveSelected = false;
        this.isRecoveredSelected = false;
        break;
      }
      case 'deaths': {
        this.isTotalSelected = false;
        this.isDeceasedSelected = true;
        this.isActiveSelected = false;
        this.isRecoveredSelected = false;
        break;
      }
      case 'active': {
        this.isTotalSelected = false;
        this.isDeceasedSelected = false;
        this.isActiveSelected = true;
        this.isRecoveredSelected = false;
        break;
      }
      case 'recovered': {
        this.isTotalSelected = false;
        this.isDeceasedSelected = false;
        this.isActiveSelected = false;
        this.isRecoveredSelected = true;
        break;
      }
    }
    this.setChart(this.horizontalBarChart, this.data, 'country', this.chartType, this.selected);
    this.setChart(this.pieChart, this.data, 'country', this.chartType, this.selected);
    this.setChart(this.gaugeChart, this.data, 'country', this.chartType, this.selected);
  }

  changeChart(event: any) {
    const number = event.value;
    this.selected = number;
    this.setChart(this.horizontalBarChart, this.data, 'country', this.chartType, number);
    this.setChart(this.pieChart, this.data, 'country', this.chartType, this.selected);
    this.setChart(this.gaugeChart, this.data, 'country', this.chartType, this.selected);
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

}
