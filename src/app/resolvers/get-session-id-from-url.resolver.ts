import { ActivatedRouteSnapshot } from '@angular/router';

export const getSessionIdFromUrl = (route: ActivatedRouteSnapshot) => {
  const sessionId = route.paramMap.get('id') || '';
  return sessionId;
};