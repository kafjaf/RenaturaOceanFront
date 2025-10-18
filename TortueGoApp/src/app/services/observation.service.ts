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
  private readonly apiUrl = 'https://localhost:7213/api/observations';
  private _observationCreated$ = new Subject<void>();

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) { }

  get observationCreated$() {
    return this._observationCreated$.asObservable();
  }

  getObservations(): Observable<ObservationDto[]> {
      // === LA SOLUTION EST ICI ===
    // On ajoute un paramètre de requête aléatoire (ici, le timestamp)
    // pour que chaque URL soit unique, ce qui force le navigateur
    // à ignorer son cache et à réellement interroger le serveur.
    const urlWithCacheBuster = `${this.apiUrl}?_=${new Date().getTime()}`;
    return this.http.get<ObservationDto[]>(urlWithCacheBuster);
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
      tap(() => {
        // AJOUTEZ CE LOG
        console.log('%c[ObservationService] Signal "observationCreated" ENVOYÉ !', 'color: green; font-weight: bold;');
        this._observationCreated$.next();
      })
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