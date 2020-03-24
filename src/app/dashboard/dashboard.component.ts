import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LanguageService } from '../language.service';
import { TranslateService } from '@ngx-translate/core';

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
  data: any;

  displayedColumns: string[] = ['country', 'confirmed', 'deceased', 'active', 'recovered'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  //Charts
  horizontalBarChart = {
    showXAxis: true,
    showYAxis: true,
    gradient: false,
    showLegend: true,
    showXAxisLabel: true,
    xAxisLabel: '',
    colorScheme: {
      domain: ['#3F99E2', '#00072D', '#9DB5B2', '#074F57', '#DAF0EE']
    },
    data: [],
    chartNumberItems: [],
    selected: 5,
    type: 'cases'
  }

  constructor(private httpClient: HttpClient, private languageService: LanguageService, private translateService: TranslateService) {
    this.languageService.selectLanguage.subscribe(language => {
      this.language = language;
    });
    this.horizontalBarChart.xAxisLabel = this.translateService.instant('DASHBOARD.PERSON');
    for (let i = 2; i <= 20; i++) {
      this.horizontalBarChart.chartNumberItems.push(i);
    }
    this.horizontalBarChart
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
      this.setHorizontalBarChart(this.horizontalBarChart, this.data, 'country', this.horizontalBarChart.type, this.horizontalBarChart.selected);
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

  setHorizontalBarChart(chart: object, items: [], yLabel: string, xLabel: string, number: number) {
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
  }

  onActivate(data): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

  select(type: string) {
    this.horizontalBarChart.type = type;
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
    this.setHorizontalBarChart(this.horizontalBarChart, this.data, 'country', this.horizontalBarChart.type, this.horizontalBarChart.selected);
  }

  changeChart(event: any) {
    const number = event.value;
    this.horizontalBarChart.selected = number;
    this.setHorizontalBarChart(this.horizontalBarChart, this.data, 'country', this.horizontalBarChart.type, number);
  }

  selectChart(type: string) {

  }

}
