// src/app/auth/auth.service.ts

import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../environments/environment';

export interface CustomJwtPayload {
  address: string;
  roles: string[];
  telephone: string;
  id: number;
  email: string;
  sub: string;
  iat: number;
  exp: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/users`;

  // Timer que dispara o logout automático exatamente quando o token expira,
  // mesmo que o usuário fique parado em uma página sem disparar requisições.
  private autoLogoutTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  cadastrar(usuario: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, usuario);
  }

  login(usuario: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, usuario);
  }

  // localStorage não existe durante o SSR (Node) - toda a árvore de
  // componentes é renderizada no servidor a cada requisição, e sem essa
  // checagem qualquer página derrubava a renderização com um 500.
  getToken(): string | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    return localStorage.getItem('authToken');
  }

  getCurrentUser(): CustomJwtPayload | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      return jwtDecode<CustomJwtPayload>(token);
    } catch (error) {
      console.error('Erro ao decodificar o token:', error);
      return null;
    }
  }

  isLoggedIn(): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;
    return user.exp * 1000 > Date.now();
  }

  isAdmin(): boolean {
    return this.getCurrentUser()?.roles?.includes('ROLE_ADMIN') ?? false;
  }

  // Só limpa a sessão local — nunca deve apagar dados persistidos no
  // backend (ex.: o carrinho do usuário). Ver CartService.resetCarrinho().
  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.clear();
    }
    this.cancelAutoLogout();
  }

  /**
   * Verifica se o token atual já expirou (mesma regra usada em isLoggedIn,
   * mas sem exigir um usuário decodificável só pra checar a data).
   */
  isTokenExpired(): boolean {
    const user = this.getCurrentUser();
    if (!user) return true;
    return user.exp * 1000 <= Date.now();
  }

  /**
   * Encerra a sessão por expiração/token inválido e manda o usuário de volta
   * para o login, sinalizando o motivo para que a tela possa avisá-lo.
   * Usado tanto pelo interceptor (quando a API responde 401) quanto pelo
   * timer de expiração local (usuário parado sem fazer requisições).
   */
  forceLogout(): void {
    const wasLoggedIn = !!this.getToken();
    this.logout();

    if (wasLoggedIn) {
      this.router.navigate(['/login'], { queryParams: { sessionExpired: true } });
    }
  }

  /**
   * Agenda o logout automático para o exato instante em que o token expira.
   * Deve ser chamado ao iniciar a aplicação (token pode já existir no
   * localStorage) e logo após um login bem-sucedido.
   */
  scheduleAutoLogout(): void {
    // No SSR cada requisição cria uma instância nova do serviço; agendar um
    // timer aqui só vazaria memória no processo do servidor sem nenhum
    // benefício (quem precisa deslogar automaticamente é o navegador).
    if (!isPlatformBrowser(this.platformId)) return;

    this.cancelAutoLogout();

    const user = this.getCurrentUser();
    if (!user) return;

    const msUntilExpiration = user.exp * 1000 - Date.now();

    if (msUntilExpiration <= 0) {
      this.forceLogout();
      return;
    }

    this.autoLogoutTimer = setTimeout(() => this.forceLogout(), msUntilExpiration);
  }

  private cancelAutoLogout(): void {
    if (this.autoLogoutTimer) {
      clearTimeout(this.autoLogoutTimer);
      this.autoLogoutTimer = null;
    }
  }
}
