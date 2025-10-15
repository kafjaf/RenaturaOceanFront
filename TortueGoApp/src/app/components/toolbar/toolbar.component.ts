// src/app/components/toolbar.component.ts

import { Component, Output, EventEmitter } from '@angular/core';
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

  // Crée un événement que le composant parent pourra écouter
  @Output() toggleHeatmap = new EventEmitter<boolean>();

  constructor(private filterService: FilterService) {}

  onSpeciesChange(species: string): void {
    this.filterService.setSpeciesFilter(species);
  }

  /**
   * Méthode appelée lorsque l'utilisateur change l'interrupteur de la heatmap.
   * Elle émet la nouvelle valeur (true ou false).
   */
  onToggleHeatmapChange(event: any): void {
    this.toggleHeatmap.emit(event.checked);
  }
}