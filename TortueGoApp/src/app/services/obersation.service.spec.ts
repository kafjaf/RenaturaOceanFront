import { TestBed } from '@angular/core/testing';

import { ObersationServiceService } from './obersation.service';

describe('ObersationServiceService', () => {
  let service: ObersationServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ObersationServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
