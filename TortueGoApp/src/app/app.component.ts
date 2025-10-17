// src/app/app.component.ts

import { Component } from '@angular/core';
import { MapViewComponent } from './components/map-view/map-view.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { ViewChild } from '@angular/core'; 
// 1. IMPORTEZ ROUTERMODULE
import { RouterModule } from '@angular/router'; 

@Component({
  selector: 'app-root',
  standalone: true,
  // 2. AJOUTEZ ROUTERMODULE AUX IMPORTS
  imports: [
    ToolbarComponent, 
    MapViewComponent,
    RouterModule // <-- Ajout ici
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'TortueGoApp';

  @ViewChild(MapViewComponent) mapView!: MapViewComponent;

  onToggleHeatmap(isVisible: boolean): void {
    if (this.mapView) {
      this.mapView.onToggleHeatmap(isVisible);
    }
  }
}