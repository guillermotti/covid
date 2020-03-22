import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  total: number;
  deceased: number;
  recovered: number;
  updated: Date;

  constructor(private httpClient: HttpClient) { 
    this.httpClient.get('https://corona.lmao.ninja/all').subscribe(response => {
      this.total = response['cases'];
      this.deceased = response['deaths'];
      this.recovered = response['recovered'];
      this.updated = new Date(response['updated']);
    });
  }

  ngOnInit(): void {
  }

}
