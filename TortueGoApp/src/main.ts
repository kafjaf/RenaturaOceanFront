// src/main.ts

import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { Dexie } from 'dexie'; // <-- IMPORT DE DEXIE

import { AppComponent } from './app/app.component';
import { isDevMode } from '@angular/core';
import { provideServiceWorker } from '@angular/service-worker';

// 1. Créez une classe pour votre base de données
export class TortueGoDB extends Dexie {
  pendingObservations!: Dexie.Table<any, number>; // La table pour nos observations

  constructor() {
    super('TortueGoDB');
    this.version(1).stores({
      // '++id' signifie un auto-incrément
      pendingObservations: '++id, latitude, longitude, description, photo, photoName'
    });
  }
}

// 2. Créez une instance de la base de données
export const db = new TortueGoDB();

bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(),
    provideHttpClient(), provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000'
          })
    // Plus besoin de NgxIndexedDBModule !
  ],
}).catch((err) => console.error(err));