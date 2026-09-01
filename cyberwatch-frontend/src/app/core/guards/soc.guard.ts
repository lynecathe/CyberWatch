import { inject } from '@angular/core';
import {
  CanActivateFn,
  Router
} from '@angular/router';

export const socGuard: CanActivateFn = () => {

  const router = inject(Router);

  const storedUser =
    localStorage.getItem('cyberwatch_user');

  if (!storedUser) {
    return router.createUrlTree(['/login']);
  }

  try {

    const user = JSON.parse(storedUser);

    if (
      user.role === 'ANALYST' ||
      user.role === 'ADMIN'
    ) {
      return true;
    }

    return router.createUrlTree(['/dashboard']);

  } catch {

    return router.createUrlTree(['/login']);

  }
};