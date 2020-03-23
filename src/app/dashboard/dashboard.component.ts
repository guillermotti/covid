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
      this.dataSource = new MatTableDataSource(response as []);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
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

}
