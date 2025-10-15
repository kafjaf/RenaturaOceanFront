// src/app/app.component.ts

import { Component } from '@angular/core';
import { MapViewComponent } from './components/map-view/map-view.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { ViewChild } from '@angular/core'; // <-- AJOUT pour communiquer avec un composant enfant

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ToolbarComponent, MapViewComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'TortueGoApp';

  // On obtient une référence directe au composant MapViewComponent
  @ViewChild(MapViewComponent) mapView!: MapViewComponent;

  /**
   * NOUVELLE méthode appelée par l'événement (toggleHeatmap) du ToolbarComponent.
   * @param isVisible La valeur de l'interrupteur (true pour afficher la heatmap, false pour la cacher).
   */
  onToggleHeatmap(isVisible: boolean): void {
    // On appelle directement la méthode du MapViewComponent pour mettre à jour la vue.
    // C'est une manière simple et efficace de faire communiquer les composants parent et enfant.
    if (this.mapView) {
      this.mapView.onToggleHeatmap(isVisible);
    }
  }
}