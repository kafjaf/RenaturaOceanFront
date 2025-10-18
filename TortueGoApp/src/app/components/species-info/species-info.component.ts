import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { SpeciesData } from '../../models/species.model';

@Component({
  selector: 'app-species-info',
  standalone : true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './species-info.component.html',
  styleUrl: './species-info.component.css'
})
export class SpeciesInfoComponent {
constructor(@Inject(MAT_DIALOG_DATA) public data: SpeciesData) {}
}
