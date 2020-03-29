import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CountriesComponent } from './countries/countries.component';
import { InformationComponent } from './information/information.component';
import { AboutComponent } from './about/about.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MapComponent } from './map/map.component';
import { SpainComponent } from './spain/spain.component';

const routes: Routes = [
  { path: 'index', component: DashboardComponent },
  { path: 'information', component: InformationComponent },
  { path: 'countries', component: CountriesComponent },
  { path: 'map', component: MapComponent },
  { path: 'spain', component: SpainComponent },
  { path: 'about', component: AboutComponent },
  { path: '', redirectTo: 'index', pathMatch: 'full' },
  { path: '**', redirectTo: 'index', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
