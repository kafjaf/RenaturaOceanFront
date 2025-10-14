// src/app/services/sync.service.ts

import { Injectable } from '@angular/core';
import { fromEvent, merge, of } from 'rxjs';
import { mapTo } from 'rxjs/operators';
import { ObservationService } from './observation.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { db } from '../../main'; // <-- IMPORT DE NOTRE INSTANCE DB

@Injectable({
  providedIn: 'root'
})
export class SyncService {
  private isSyncing = false;

  constructor(
    private observationService: ObservationService,
    private snackBar: MatSnackBar
  ) {}

  init(): void {
    merge(
      of(navigator.onLine),
      fromEvent(window, 'online').pipe(mapTo(true)),
      fromEvent(window, 'offline').pipe(mapTo(false))
    ).subscribe(isOnline => {
      if (isOnline) {
        console.log('Connexion détectée, tentative de synchronisation...');
        this.syncPendingObservations();
      } else {
        console.log('Passage en mode hors-ligne.');
      }
    });
  }

  async syncPendingObservations(): Promise<void> {
    if (this.isSyncing) return;
    this.isSyncing = true;

    try {
      // API Dexie pour récupérer toutes les observations en attente
      const pendingRequests = await db.pendingObservations.toArray();

      if (pendingRequests.length > 0) {
        this.snackBar.open(`Synchronisation de ${pendingRequests.length} signalement(s) en attente...`, 'OK', { duration: 3000 });

        for (const req of pendingRequests) {
          const formData = new FormData();
          const photoFile = new File([req.photo], req.photoName, { type: req.photo.type });

          formData.append('latitude', req.latitude);
          formData.append('longitude', req.longitude);
          formData.append('description', req.description);
          formData.append('photo', photoFile, req.photoName);

          try {
            await this.observationService.createObservationOnline(formData).toPromise();
            // API Dexie pour supprimer l'observation synchronisée
            await db.pendingObservations.delete(req.id);
          } catch (error) {
            console.error('Échec de la synchronisation pour le signalement ID:', req.id, error);
          }
        }
        this.snackBar.open('Synchronisation terminée !', 'Fermer', { duration: 3000 });
      }
    } finally {
      this.isSyncing = false;
    }
  }
}