import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { importProvidersFrom } from '@angular/core';
import { NgxIndexedDBModule, DBConfig } from 'ngx-indexed-db'; // <-- IMPORT

import { AppComponent } from './app/app.component';

// Configuration de notre base de données locale
const dbConfig: DBConfig = {
  name: 'TortueGoDB',
  version: 1,
  objectStoresMeta: [{
    store: 'pending-observations', // Le nom de notre "table"
    storeConfig: { keyPath: 'id', autoIncrement: true },
    storeSchema: [
      { name: 'latitude', keypath: 'latitude', options: { unique: false } },
 { name: 'longitude', keypath: 'longitude', options: { unique: false } },
      { name: 'description', keypath: 'description', options: { unique: false } },
      { name: 'photo', keypath: 'photo', options: { unique: false } }, // Stockera le Blob de l'image
      { name: 'photoName', keypath: 'photoName', options: { unique: false } }
    ]
  }]
};
bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(),
    provideHttpClient(),
    importProvidersFrom(NgxIndexedDBModule.forRoot(dbConfig)) // <-- AJOUTER LE PROVIDER
  ],
}).catch((err) => console.error(err));
