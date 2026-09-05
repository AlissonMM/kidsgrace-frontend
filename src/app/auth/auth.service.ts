// src/app/auth/auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  constructor(private http: HttpClient) {}

  cadastrar(usuario: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, usuario);
  }

  login(usuario: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, usuario);
  }

  getToken(): string | null {
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
    localStorage.clear();
  }
}
