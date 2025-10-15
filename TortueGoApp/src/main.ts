// src/main.ts

import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { environment } from './environments/environment.development';
import { Dexie } from 'dexie';

import { AppComponent } from './app/app.component';
import { ObservationService } from './app/services/obersation-service.service';
import { MockObservationService } from './app/services/mock-observation.service';

// Configuration de la base de données (Dexie)
export class TortueGoDB extends Dexie {
  pendingObservations!: Dexie.Table<any, number>;
  constructor() {
    super('TortueGoDB');
  }
}

// Créez une instance de la base de données
export const db = new TortueGoDB();

// Configurez la version et les "tables" de la base de données
db.version(1).stores({
  pendingObservations: '++id, latitude, longitude, description, photo, photoName'
});

bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(),
    provideHttpClient(),
    
    // Injection de dépendance conditionnelle
    {
      provide: ObservationService,
      useClass: environment.useMock ? MockObservationService : ObservationService
    }
  ],
}).catch((err) => console.error(err));