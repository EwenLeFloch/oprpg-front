import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';

import { ProgressionService } from '../services/progression';

export const factionGuard: CanActivateFn = () => {
  const progressionService = inject(ProgressionService);
  const router = inject(Router);

  return progressionService.recupererMaProgression().pipe(
    map((progression) => {
      if (progression.faction !== null) {
        return router.createUrlTree(['/monde']);
      }
      return true;
    }),
  );
};
