import { Component } from '@angular/core';
import { SpeciesData } from '../../models/species.model';
import { SpeciesInfoComponent } from '../species-info/species-info.component';
import { MatDialog } from '@angular/material/dialog';
import { SPECIES_DB } from '../../data/species.db';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-explore',
  standalone : true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './explore.component.html',
  styleUrl: './explore.component.css'
})
export class ExploreComponent {
  // Expose les données au template
  speciesList = Object.values(SPECIES_DB);

  constructor(private dialog: MatDialog) {}

  // Réutilisez la méthode pour ouvrir la modale !
  openSpeciesInfo(speciesData: SpeciesData): void {
    this.dialog.open(SpeciesInfoComponent, {
      width: '450px',
      data: speciesData
    });
  }
}

