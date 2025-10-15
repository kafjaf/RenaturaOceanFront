import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface FilterCriteria {
  species?: string;
  location?: string;
  dateRange?: {
    start: string | Date;
    end: string | Date;
  };
}


@Injectable({
  providedIn: 'root'
})
export class FilterService {
  private filterSubject = new BehaviorSubject<FilterCriteria>({});
  filter$ = this.filterSubject.asObservable();

  setFilter(criteria: FilterCriteria) {
    this.filterSubject.next(criteria);
  }
}
