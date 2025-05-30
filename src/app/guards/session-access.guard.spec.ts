import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { sessionAccessGuard } from './session-access.guard';

describe('sessionAccessGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => sessionAccessGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
