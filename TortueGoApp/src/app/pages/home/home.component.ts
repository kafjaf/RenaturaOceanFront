// src/app/home/home.component.ts

import { Component } from '@angular/core';
// 1. Importez les modules Material dont vous avez besoin
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'; // Si vous prévoyez d'utiliser des icônes

@Component({
  selector: 'app-home',
  // 2. Ajoutez les modules importés dans ce tableau
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  // Le contenu de votre composant...
}