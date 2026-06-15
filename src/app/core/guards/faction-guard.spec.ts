import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { factionGuard } from './faction-guard';

describe('factionGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => factionGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
