// src/app/animal-detail/animal-detail.component.ts

import { Component } from '@angular/core';
// 1. Importez le module pour la barre d'outils
import { MatToolbarModule } from '@angular/material/toolbar';
// Il est très probable que vous ayez aussi des boutons ou des icônes dedans
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-animal-detail',
  templateUrl: './animal-detail.component.html',
  styleUrls: ['./animal-detail.component.css'],
  // 2. Ajoutez les modules ici
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class AnimalDetailComponent {
  // Le contenu de votre composant...
}