import { TestBed } from '@angular/core/testing';

import { Monde } from './monde';

describe('Monde', () => {
  let service: Monde;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Monde);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
