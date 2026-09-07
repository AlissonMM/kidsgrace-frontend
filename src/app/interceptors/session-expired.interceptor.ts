import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';

/**
 * Detecta quando a API rejeita uma requisição por falta de autenticação
 * (401 - token expirado, inválido ou ausente para um recurso protegido) e
 * força o logout do usuário, redirecionando para o login.
 *
 * Complementa o timer de AuthService.scheduleAutoLogout(): este interceptor
 * cobre o caso em que o token expira "no meio" de uma requisição (ou é
 * invalidado/alterado), enquanto o timer cobre o usuário parado sem
 * disparar nenhuma chamada à API.
 */
export const sessionExpiredInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && authService.getToken()) {
        authService.forceLogout();
      }

      return throwError(() => error);
    })
  );
};
