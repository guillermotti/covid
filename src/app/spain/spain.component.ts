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
  displayedColumns: string[] = ['comunidad', 'cases', 'hospital', 'critical', 'deceased'];
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
    domain: ['#40486a', '#4fd0f9', '#8f99af', '#95a7f6', "#6e7cb6", "#485177", "#313751", "#3b9bb9", "#276579", "#4fd0f9", "#12303a", "#5b616f", "#cedcfb", "#8f99af", "#aab0b4", "#99acbc"]
  }
  chartType: string = 'Casos ';
  spainData: any[];
  totalData: any;
  updated: string;
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
  lineChart = {
    xAxis: true,
    yAxis: true,
    showYAxisLabel: true,
    showXAxisLabel: true,
    timeline: true,
    data: []
  }

  //map
  mapData = [];
  isLoaded = false;
  mapColumnNames = ['Comunidad', 'Casos'];
  mapOptions = {
    // colorAxis: {colors: ['#EDEDED', '#FFCFDF', '#FF9EBF', '#FF6E9F', '#FF3D7F']},
    colorAxis: { colors: ['#F1D6D9', '#FACDD2', '#F29BA3', '#ED6B75', '#E73845'] },
    backgroundColor: '#fff',
    datalessRegionColor: '#eee',
    defaultColor: '#eee',
    region: 'ES',
    displayMode: 'regions',
    resolution: 'provinces'
  };

  constructor(private httpClient: HttpClient, private ngxCsvParser: NgxCsvParser, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.httpClient.get('assets/csv/covid.csv', { responseType: 'arraybuffer' }).subscribe(response => {
      const file = new File([response], 'covid.csv');
      this.ngxCsvParser.parse(file, { header: true, delimiter: ',' })
        .pipe().subscribe((result: Array<any>) => {
          this.totalData = result;
          this.updated = result[result.length - 3]["Fecha"];
          this.spainData = result.slice(Math.max(result.length - 20, 0))
          this.spainData.pop();
          this.spainData.pop();
          this.spainData.sort((a, b) => { return b[this.chartType] - a[this.chartType] });
          this.setLineChart(this.chartType);
          this.setMapChart(this.chartType);
          this.setChart(this.barChart, 'comunidad', this.chartType);
          this.setChart(this.pieChart, 'comunidad', this.chartType);
          this.setChart(this.gaugeChart, 'comunidad', this.chartType);
          this.dataSource = new MatTableDataSource(this.spainData);
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

  setLineChart(type: string) {
    this.lineChart.data = [{ name: 'Andalucía', series: [] }, { name: 'Aragón', series: [] }, { name: 'Principado de Asturias', series: [] },
    { name: 'Islas Baleares', series: [] }, { name: 'Canarias', series: [] }, { name: 'Cantabria', series: [] }, { name: 'Castilla la Mancha', series: [] },
    { name: 'Castilla y León', series: [] }, { name: 'Cataluña', series: [] }, { name: 'Ceuta', series: [] }, { name: 'Valencia', series: [] },
    { name: 'Extremadura', series: [] }, { name: 'Galicia', series: [] }, { name: 'Comunidad de Madrid', series: [] }, { name: 'Melilla', series: [] },
    { name: 'Región de Murcia', series: [] }, { name: 'Comunidad Foral de Navarra', series: [] }, { name: 'País Vasco', series: [] }, { name: 'La Rioja', series: [] }];
    this.totalData.map(item => {
      if (item['CCAA Codigo ISO'] === 'AN') {
        this.lineChart.data[0].series.push({ name: item['Fecha'], value: item[type] === '' ? 0 : item[type] })
      } else if (item['CCAA Codigo ISO'] === 'AR') {
        this.lineChart.data[1].series.push({ name: item['Fecha'], value: item[type] === '' ? 0 : item[type] })
      } else if (item['CCAA Codigo ISO'] === 'AS') {
        this.lineChart.data[2].series.push({ name: item['Fecha'], value: item[type] === '' ? 0 : item[type] })
      } else if (item['CCAA Codigo ISO'] === 'IB') {
        this.lineChart.data[3].series.push({ name: item['Fecha'], value: item[type] === '' ? 0 : item[type] })
      } else if (item['CCAA Codigo ISO'] === 'CN') {
        this.lineChart.data[4].series.push({ name: item['Fecha'], value: item[type] === '' ? 0 : item[type] })
      } else if (item['CCAA Codigo ISO'] === 'CB') {
        this.lineChart.data[5].series.push({ name: item['Fecha'], value: item[type] === '' ? 0 : item[type] })
      } else if (item['CCAA Codigo ISO'] === 'CM') {
        this.lineChart.data[6].series.push({ name: item['Fecha'], value: item[type] === '' ? 0 : item[type] })
      } else if (item['CCAA Codigo ISO'] === 'CL') {
        this.lineChart.data[7].series.push({ name: item['Fecha'], value: item[type] === '' ? 0 : item[type] })
      } else if (item['CCAA Codigo ISO'] === 'CT') {
        this.lineChart.data[8].series.push({ name: item['Fecha'], value: item[type] === '' ? 0 : item[type] })
      } else if (item['CCAA Codigo ISO'] === 'CE') {
        this.lineChart.data[9].series.push({ name: item['Fecha'], value: item[type] === '' ? 0 : item[type] })
      } else if (item['CCAA Codigo ISO'] === 'VC') {
        this.lineChart.data[10].series.push({ name: item['Fecha'], value: item[type] === '' ? 0 : item[type] })
      } else if (item['CCAA Codigo ISO'] === 'EX') {
        this.lineChart.data[11].series.push({ name: item['Fecha'], value: item[type] === '' ? 0 : item[type] })
      } else if (item['CCAA Codigo ISO'] === 'GA') {
        this.lineChart.data[12].series.push({ name: item['Fecha'], value: item[type] === '' ? 0 : item[type] })
      } else if (item['CCAA Codigo ISO'] === 'MD') {
        this.lineChart.data[13].series.push({ name: item['Fecha'], value: item[type] === '' ? 0 : item[type] })
      } else if (item['CCAA Codigo ISO'] === 'ME') {
        this.lineChart.data[14].series.push({ name: item['Fecha'], value: item[type] === '' ? 0 : item[type] })
      } else if (item['CCAA Codigo ISO'] === 'MC') {
        this.lineChart.data[15].series.push({ name: item['Fecha'], value: item[type] === '' ? 0 : item[type] })
      } else if (item['CCAA Codigo ISO'] === 'NC') {
        this.lineChart.data[16].series.push({ name: item['Fecha'], value: item[type] === '' ? 0 : item[type] })
      } else if (item['CCAA Codigo ISO'] === 'PV') {
        this.lineChart.data[17].series.push({ name: item['Fecha'], value: item[type] === '' ? 0 : item[type] })
      } else if (item['CCAA Codigo ISO'] === 'RI') {
        this.lineChart.data[18].series.push({ name: item['Fecha'], value: item[type] === '' ? 0 : item[type] })
      }
    });
  }

  setMapChart(type: string) {
    this.mapData = [];
    this.spainData.map(item => {
      this.mapData.push([item["CCAA Codigo ISO"], Number(item[type])])
      item["comunidad"] = this.ccaa[item["CCAA Codigo ISO"]];
    });
    this.mapData.map(item => {
      item[0] = `ES-${item[0]}`;
    });
    this.isLoaded = true;
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
    this.setChart(this.barChart, 'comunidad', this.chartType);
    this.setChart(this.pieChart, 'comunidad', this.chartType);
    this.setChart(this.gaugeChart, 'comunidad', this.chartType);
    this.setLineChart(this.chartType);
    this.setMapChart(this.chartType);
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
