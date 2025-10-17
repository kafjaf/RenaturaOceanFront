import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AnimalsComponent } from './pages/animals/animals.component';
import { AnimalDetailComponent } from './pages/animal-detail/animal-detail.component';
import { MapViewComponent } from './components/map-view/map-view.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'animals', component: AnimalsComponent },
  { path: 'animal-detail', component: AnimalDetailComponent },
  { path: 'carte', component: MapViewComponent }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { } 