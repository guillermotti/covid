import { Component, OnInit } from '@angular/core';
import { NgxCsvParser, NgxCSVParserError } from 'ngx-csv-parser';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-spain',
  templateUrl: './spain.component.html',
  styleUrls: ['./spain.component.scss']
})
export class SpainComponent implements OnInit {

  ccaa = {
    "AN": "Andalucía",
    "AR": "Aragón",
    "AS": "Principado de Asturias",
    "IB": "Islas Baleares",
    "CN": "Canarias",
    "CB": "Cantabria",
    "CM": "Castilla la Mancha",
    "CL": "Castilla y León",
    "CT": "Cataluña",
    "CE": "Ceuta",
    "VC": "Comunidad Valenciana",
    "EX": "Extremadura",
    "GA": "Galicia",
    "MD": "Comunidad de Madrid",
    "ME": "Melilla",
    "MC": "Región de Murcia",
    "NC": "Comunidad Foral de Navarra",
    "PV": "País Vasco",
    "RI": "La Rioja"
  }
  today: Date = new Date();
  displayedColumns: string[] = ['date', 'comunidad', 'cases', 'hospital', 'critical', 'deceased'];
  dataSource: MatTableDataSource<any>;
  responsiveType = '';

  //Charts
  isTotalSelected: boolean = true;
  isDeceasedSelected: boolean = false;
  isCriticalSelected: boolean = false;
  isActiveSelected: boolean = false;
  isBarSelected: boolean = true;
  isGaugeSelected: boolean = false;
  isPieSelected: boolean = false
  chart: string = 'bar';
  colorScheme: any = {
    domain: ['#40486a', '#4fd0f9', '#8f99af', '#95a7f6', "#6e7cb6", "#485177", "#313751", "#3b9bb9", "#276579", "#4fd0f9", "#12303a", "5b616f", "cedcfb", "8f99af", "aab0b4", "99acbc"]
  }
  chartType: string = 'Casos ';
  spainData: any;
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

  constructor(private httpClient: HttpClient, private ngxCsvParser: NgxCsvParser, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.httpClient.get('assets/csv/covid.csv', { responseType: 'arraybuffer' }).subscribe(response => {
      const file = new File([response], 'covid.csv');
      this.ngxCsvParser.parse(file, { header: true, delimiter: ',' })
        .pipe().subscribe((result: Array<any>) => {
          result = result.slice(Math.max(result.length - 20, 0))
          result.pop();
          result.sort((a, b) => { return b['Casos '] - a['Casos '] });
          result.map(item => {
            item["CCAA Codigo ISO"] = this.ccaa[item["CCAA Codigo ISO"]];
          });
          this.spainData = result;
          this.setChart(this.barChart, 'CCAA Codigo ISO', this.chartType);
          this.setChart(this.pieChart, 'CCAA Codigo ISO', this.chartType);
          this.setChart(this.gaugeChart, 'CCAA Codigo ISO', this.chartType);
          this.dataSource = new MatTableDataSource(result);
          console.log('Result', result);
        }, (error: NgxCSVParserError) => {
          console.log('Error', error);
        });
    });
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  setChart(chart: object, yLabel: string, xLabel: string) {
    chart['data'] = [];
    this.spainData.sort((a, b) => { return b[xLabel] - a[xLabel] });
    this.spainData.map(item => {
      chart['data'].push({ name: item[yLabel], value: item[xLabel] });
    })
    Object.assign(this, chart['data']);
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
      case 'Casos ': {
        this.isTotalSelected = true;
        this.isDeceasedSelected = false;
        this.isCriticalSelected = false
        this.isActiveSelected = false;
        break;
      }
      case 'Fallecidos': {
        this.isTotalSelected = false;
        this.isDeceasedSelected = true;
        this.isCriticalSelected = false
        this.isActiveSelected = false;
        break;
      }
      case 'UCI': {
        this.isTotalSelected = false;
        this.isDeceasedSelected = false;
        this.isCriticalSelected = true
        this.isActiveSelected = false;
        break;
      }
      case 'Hospitalizados': {
        this.isTotalSelected = false;
        this.isDeceasedSelected = false;
        this.isCriticalSelected = false
        this.isActiveSelected = true;
        break;
      }
    }
    this.setChart(this.barChart, 'CCAA Codigo ISO', this.chartType);
    this.setChart(this.pieChart, 'CCAA Codigo ISO', this.chartType);
    this.setChart(this.gaugeChart, 'CCAA Codigo ISO', this.chartType);
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
