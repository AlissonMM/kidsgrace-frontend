import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }

  // Havia um token salvo, mas ele expirou (ou é inválido): limpa a sessão
  // em vez de só bloquear a navegação, para não deixar lixo no localStorage.
  if (authService.getToken()) {
    authService.forceLogout();
    return false;
  }

  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn() && authService.isAdmin()) {
    return true;
  }

  if (authService.getToken() && !authService.isLoggedIn()) {
    authService.forceLogout();
    return false;
  }

  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
