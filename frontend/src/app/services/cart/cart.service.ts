import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject ,tap } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

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
    const userDetails = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const token = userDetails?.token;
  
    if (!token) {
      throw new Error('No authentication token found');
    }
  
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  
    return this.http.get(`${this.baseUrl}/${userId}`, { headers });
  }

  getCartItems(userId: number): Observable<any> {
    const userDetails = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const token = userDetails?.token;
  
    if (!token) {
      throw new Error('No authentication token found');
    }
  
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  
    return this.http.get(`${this.baseUrl}/items/${userId}`, { headers });
  }
  
  updateQuantity(cartId: number, productId: number, newQuantity: number): Observable<any> {
    const userDetails = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const token = userDetails?.token;

    if (!token) {
        throw new Error('No authentication token found');
    }

    const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
    });

    return this.http.put(`${this.baseUrl}/update`, null ,{ headers, params: {
      cartId,
      productId,
      newQuantity
    } });
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
    const userDetails = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const token = userDetails?.token;
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }


  addItem(userId: number, productId: number, quantity: number): Observable<any> {
    const userDetails = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const token = userDetails?.token; // Retrieve the JWT token
  
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}` // Add the Authorization header
    });
  
    return this.http.post(`${this.baseUrl}/add`, null, {
      headers,
      params: {
        userId: userId.toString(),
        productId: productId.toString(),
        quantity: quantity.toString()
      }
    }).pipe(
      // Notify subscribers after adding an item
      tap(() => this.cartUpdated.next())
    );
  }

  clearCart(userId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/clear/${userId}`);
  }
}
