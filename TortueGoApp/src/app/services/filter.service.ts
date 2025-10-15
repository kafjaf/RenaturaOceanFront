// src/app/services/filter.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface AppFilters {
  species: string | 'all';
}

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  // La propriété est maintenant accessible depuis les autres services/composants
  filters = new BehaviorSubject<AppFilters>({ species: 'all' });
  public filters$ = this.filters.asObservable();

  setSpeciesFilter(species: string | 'all'): void {
    const currentFilters = this.filters.getValue();
    this.filters.next({ ...currentFilters, species });
  }
}