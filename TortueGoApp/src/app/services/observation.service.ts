// src/app/services/observation.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ObservationDto } from '../models/observation.dto';
import { MatSnackBar } from '@angular/material/snack-bar';
import { db } from '../../main'; // <-- IMPORT DE NOTRE INSTANCE DB

@Injectable({
  providedIn: 'root'
})
export class ObservationService {
  private readonly apiUrl = 'https://VOTRE_API_SUR_RENDER/api/observations';
  private _observationCreated$ = new Subject<void>();

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) { }

  get observationCreated$() {
    return this._observationCreated$.asObservable();
  }

  getObservations(): Observable<ObservationDto[]> {
    return this.http.get<ObservationDto[]>(this.apiUrl);
  }
  
  createObservation(formData: FormData): Observable<any> {
    if (navigator.onLine) {
      return this.createObservationOnline(formData);
    } else {
      return this.saveRequestOffline(formData);
    }
  }

  createObservationOnline(formData: FormData): Observable<ObservationDto> {
    return this.http.post<ObservationDto>(this.apiUrl, formData).pipe(
      tap(() => this._observationCreated$.next())
    );
  }

  private saveRequestOffline(formData: FormData): Observable<any> {
    const requestData = {
      latitude: formData.get('latitude'),
      longitude: formData.get('longitude'),
      description: formData.get('description'),
      photo: formData.get('photo') as File,
      photoName: (formData.get('photo') as File).name
    };

    this.snackBar.open('Vous êtes hors ligne. Le signalement sera envoyé plus tard.', 'OK', { duration: 5000 });

    // API Dexie pour ajouter une observation en attente
    return from(db.pendingObservations.add(requestData));
  }
}