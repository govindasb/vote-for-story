import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionService } from '../services/session.service';
import { map, take } from 'rxjs/operators';

export const sessionAccessGuard: CanActivateFn = (route, state) => {
  const sessionService = inject(SessionService);
  const router = inject(Router);
  const sessionId = route.paramMap.get('id') ?? '';

  return sessionService.userProfile$.pipe(
    take(1),
    map((profile) => {
      const isValid =
        profile !== null &&
        profile.name.trim() !== '' &&
        sessionService.getSessionId() === sessionId;

      if (!isValid) {
        router.navigate(['/session', sessionId, 'join']);
        return false;
      }

      return true;
    })
  );
};
