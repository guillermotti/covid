import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LanguageService } from '../language.service';

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

  displayedColumns: string[] = ['name', 'confirmed', 'deceased', 'active', 'recovered'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  //Charts
  horizontalBarChart1 = {
    view: [700, 400],
    showXAxis: true,
    showYAxis: true,
    gradient: false,
    showLegend: true,
    showXAxisLabel: true,
    yAxisLabel: 'Country',
    showYAxisLabel: true,
    xAxisLabel: 'Population',
    colorScheme: {
      domain: ['#3F99E2', '#00072D', '#9DB5B2', '#074F57', '#DAF0EE']
    },
    data: []
  }

  horizontalBarChart2 = {
    view: [700, 400],
    showXAxis: true,
    showYAxis: true,
    gradient: false,
    showLegend: true,
    showXAxisLabel: true,
    yAxisLabel: 'Country',
    showYAxisLabel: true,
    xAxisLabel: 'Population',
    colorScheme: {
      domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
    },
    data: []
  }


  constructor(private httpClient: HttpClient, private languageService: LanguageService) {
    this.languageService.selectLanguage.subscribe(language => {
      this.language = language;
    });
    this.httpClient.get('https://corona.lmao.ninja/all').subscribe(response => {
      this.total_confirmed = response['cases'];
      this.total_deceased = response['deaths'];
      this.total_recovered = response['recovered'];
      this.updated = new Date(response['updated']);
    });
    this.httpClient.get('https://corona.lmao.ninja/countries').subscribe(response => {
      const data = response as [];
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.setHorizontalBarChart(this.horizontalBarChart1, data, 'country', 'cases');
      this.setHorizontalBarChart(this.horizontalBarChart2, data, 'country', 'deaths');
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

  setHorizontalBarChart(chart: object, items: [], yLabel: string, xLabel: string) {
    chart['data'] = [];
    items.sort((a, b) => { return b[xLabel] - a[xLabel] });
    items.map(item => {
      if (chart['data'].length < 5) {
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

}
