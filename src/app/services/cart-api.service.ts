import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Cart } from '../models/cart.model';

@Injectable({
  providedIn: 'root'
})
export class CartApiService {
  private apiUrl = `${environment.apiUrl}/cart`;

  constructor(private http: HttpClient) {}

  getCart(): Observable<Cart> {
    return this.http.get<Cart>(this.apiUrl);
  }

  addItem(toyId: number, quantity: number): Observable<Cart> {
    return this.http.post<Cart>(`${this.apiUrl}/items`, { toyId, quantity });
  }

  updateItem(cartItemId: number, quantity: number): Observable<Cart> {
    return this.http.put<Cart>(`${this.apiUrl}/items/${cartItemId}`, { quantity });
  }

  removeItem(cartItemId: number): Observable<Cart> {
    return this.http.delete<Cart>(`${this.apiUrl}/items/${cartItemId}`);
  }

  clearCart(): Observable<void> {
    return this.http.delete<void>(this.apiUrl);
  }
}
