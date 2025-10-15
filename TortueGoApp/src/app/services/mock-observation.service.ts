import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ObservationDto } from '../models/observation.dto';

@Injectable()
export class MockObservationService {
  private mockData: ObservationDto[] = [
    {
      id: 1,
      latitude: -4.783,
      longitude: 11.85,
      photoUrl: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
      description: 'Tortue observée près de la côte.',
      observedAt: new Date().toISOString(),
      species: 'Tortue Luth',
      speciesConfidence: 0.92
    }
  ];

  private _observationCreated$ = new Subject<void>();
  get observationCreated$() {
    return this._observationCreated$.asObservable();
  }

  getObservations(): Observable<ObservationDto[]> {
    console.warn('--- MOCK MODE: récupération des données factices ---');
    return of(this.mockData).pipe(delay(500));
  }

  createObservation(formData: FormData): Observable<ObservationDto> {
    console.warn('--- MOCK MODE: création factice ---');

    const newObs: ObservationDto = {
      id:   Date.now(),
      latitude: Number(formData.get('latitude')),
      longitude: Number(formData.get('longitude')),
      photoUrl: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
      description: formData.get('description') as string,
      observedAt: new Date().toISOString(),
      species: 'Tortue Verte',
      speciesConfidence: 0.9
    };

    this.mockData.push(newObs);
    this._observationCreated$.next();

    return of(newObs).pipe(delay(1000));
  }
}
