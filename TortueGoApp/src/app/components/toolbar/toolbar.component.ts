// src/app/components/toolbar.component.ts

import { Component, Output, EventEmitter } from '@angular/core'; // <-- AJOUT DE Output & EventEmitter
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FilterService } from '../../services/filter.service';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatIconModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSlideToggleModule
  ],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.css'
})
export class ToolbarComponent {

  // On crée un "événement" nommé 'toggleHeatmap' que le composant parent pourra écouter.
  @Output() toggleHeatmap = new EventEmitter<boolean>();

  constructor(private filterService: FilterService) {}

  /**
   * Méthode appelée lorsque l'utilisateur change l'espèce dans le menu déroulant.
   */
  onSpeciesChange(species: string): void {
    this.filterService.setSpeciesFilter(species);
  }

  /**
   * NOUVELLE méthode appelée lorsque l'utilisateur change l'interrupteur de la heatmap.
   * @param event L'événement émis par le mat-slide-toggle, qui contient la valeur 'checked'.
   */
  onToggleHeatmapChange(event: any): void {
    // On émet la nouvelle valeur (true ou false) à travers l'événement 'toggleHeatmap'.
    this.toggleHeatmap.emit(event.checked);
  }
}