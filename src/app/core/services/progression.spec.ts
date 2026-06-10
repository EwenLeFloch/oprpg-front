import { TestBed } from '@angular/core/testing';

import { Progression } from './progression';

describe('Progression', () => {
  let service: Progression;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Progression);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
