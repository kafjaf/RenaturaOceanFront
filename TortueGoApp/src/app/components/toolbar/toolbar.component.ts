// src/app/components/toolbar/toolbar.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { FilterService } from '../../services/filter.service';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule
  ],
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent {
  speciesOptions = [
    { label: 'Toutes les espèces', value: 'all' },
    { label: 'Tortue Luth', value: 'Tortue Luth' },
    { label: 'Tortue Verte', value: 'Tortue Verte' },
    { label: 'Tortue Imbriquée', value: 'Tortue Imbriquée' },
    { label: 'Non identifiée', value: 'undefined' }
  ];

  constructor(private filterService: FilterService) {}

  onSpeciesChange(selectedSpecies: string) {
    this.filterService.setFilter({ species: selectedSpecies });
  }
}
