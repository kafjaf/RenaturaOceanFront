import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { ObservationDto } from '../models/observation.dto';

@Injectable({
  providedIn: 'root'
})
export class ObersationServiceService {

   // Remplacez par l'URL de votre API .NET déployée sur Render
  private readonly apiUrl = 'https://tortuego-api.onrender.com/api/observations';

  // Un Subject pour notifier les autres composants qu'une nouvelle observation a été créée
  private _observationCreated$ = new Subject<void>();

  constructor(private http: HttpClient) { }

   get observationCreated$() {
    return this._observationCreated$.asObservable();
  }

  getObservations(): Observable<ObservationDto[]> {
    return this.http.get<ObservationDto[]>(this.apiUrl);
  }

  createObservation(formData: FormData): Observable<ObservationDto> {
    return this.http.post<ObservationDto>(this.apiUrl, formData).pipe(
      // Quand la création réussit, on émet un événement
      tap(() => this._observationCreated$.next())
    );
  }
}
