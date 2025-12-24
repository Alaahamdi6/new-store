import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject ,tap } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { buildAuthHeaders } from '../common/http-utils';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private baseUrl = 'http://localhost:8090/api/cart';

  // Subject for notifying cart updates
  private cartUpdated = new Subject<void>();
  cartUpdated$ = this.cartUpdated.asObservable();

  constructor(private http: HttpClient) {}

  getCart(userId: number): Observable<any> {
    const headers = buildAuthHeaders();
    return this.http.get(`${this.baseUrl}/${userId}`, { headers });
  }

  getCartItems(userId: number): Observable<any> {
    const headers = buildAuthHeaders();
    return this.http.get(`${this.baseUrl}/items/${userId}`, { headers });
  }
  
  updateQuantity(cartId: number, productId: number, newQuantity: number): Observable<any> {
    const headers = buildAuthHeaders();
    return this.http.put(`${this.baseUrl}/update`, null, {
      headers,
      params: { cartId, productId, newQuantity }
    });
  }

  

  removeItem(cartItemId: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete(`${this.baseUrl}/item/${cartItemId}`, { headers }

    ).pipe(
      // Notify subscribers after adding an item
      tap(() => this.cartUpdated.next())
    );;
  }

  private getHeaders(): HttpHeaders {
    return buildAuthHeaders();
  }


  addItem(userId: number, productId: number, quantity: number): Observable<any> {
    const headers = buildAuthHeaders();
    return this.http.post(`${this.baseUrl}/add`, null, {
      headers,
      params: {
        userId: userId.toString(),
        productId: productId.toString(),
        quantity: quantity.toString()
      }
    }).pipe(
      tap(() => this.cartUpdated.next())
    );
  }

  clearCart(userId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/clear/${userId}`);
  }
}
