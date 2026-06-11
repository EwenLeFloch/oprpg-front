import { TestBed } from '@angular/core/testing';

import { CapaciteService } from './capacite';

describe('CapaciteService', () => {
  let service: CapaciteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CapaciteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
