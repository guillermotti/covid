import { Component, OnInit } from '@angular/core';
import { NgxCsvParser, NgxCSVParserError } from 'ngx-csv-parser';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';

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

  constructor(private httpClient: HttpClient, private ngxCsvParser: NgxCsvParser) { }

  ngOnInit(): void {
    this.httpClient.get('assets/csv/covid.csv', { responseType: 'arraybuffer' }).subscribe(response => {
      const file = new File([response], 'covid.csv');
      this.ngxCsvParser.parse(file, { header: true, delimiter: ',' })
        .pipe().subscribe((result: Array<any>) => {
          result = result.slice(Math.max(result.length - 20, 0))
          result.pop();
          result.map(item => {
            item["CCAA Codigo ISO"] = this.ccaa[item["CCAA Codigo ISO"]];
          });
          this.dataSource = new MatTableDataSource(result);
          console.log('Result', result);
        }, (error: NgxCSVParserError) => {
          console.log('Error', error);
        });
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
