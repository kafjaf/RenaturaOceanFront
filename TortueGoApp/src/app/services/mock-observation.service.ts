// src/app/services/mock-observation.service.ts

import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ObservationDto } from '../models/observation.dto';

@Injectable({
  providedIn: 'root'
})
export class MockObservationService {
  // Base de données en mémoire pour simuler les données
  private mockData: ObservationDto[] = [
    {
      id: 'mock-1',
      latitude: -4.783, longitude: 11.85,
      photoUrl: 'https://res.cloudinary.com/demo/image/upload/sample.jpg', // Utilisez une image placeholder
      description: 'Tortue observée près de la côte.',
      observedAt: new Date().toISOString(),
      species: 'Tortue Luth',
      speciesConfidence: 0.92
    },
    {
      id: 'mock-2',
      latitude: -4.79, longitude: 11.87,
      photoUrl: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
      description: 'Trace de ponte sur la plage.',
      observedAt: new Date().toISOString(),
      species: undefined, // Simule un cas où l'IA n'a pas identifié l'espèce
      speciesConfidence: undefined
    }
  ];

  private _observationCreated$ = new Subject<void>();

  get observationCreated$() {
    return this._observationCreated$.asObservable();
  }

  // Simule la récupération des données
  getObservations(): Observable<ObservationDto[]> {
    console.warn('--- MOCK MODE: Récupération des observations factices ---');
    return of(this.mockData).pipe(delay(500)); // Simule une latence réseau
  }

  // Simule la création d'une nouvelle observation
  createObservation(formData: FormData): Observable<ObservationDto> {
    console.warn('--- MOCK MODE: Création d\'une observation factice ---');
    
    // Simule la logique de l'IA du backend
    const speciesOptions = ['Tortue Verte', 'Tortue Imbriquée', undefined];
    const randomSpecies = speciesOptions[Math.floor(Math.random() * speciesOptions.length)];
    const randomConfidence = randomSpecies ? Math.random() * (0.98 - 0.75) + 0.75 : undefined;

    const newObs: ObservationDto = {
      id: `mock-${Date.now()}`,
      latitude: Number(formData.get('latitude')),
      longitude: Number(formData.get('longitude')),
      photoUrl: URL.createObjectURL(formData.get('photo') as File), // Affiche l'image locale pour la démo
      description: formData.get('description') as string,
      observedAt: new Date().toISOString(),
      species: randomSpecies,
      speciesConfidence: randomConfidence,
    };

    this.mockData.push(newObs);
    this._observationCreated$.next(); // Notifie l'UI

    return of(newObs).pipe(delay(1000)); // Simule une latence réseau
  }
}