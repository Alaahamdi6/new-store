import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  
  private baseUrl = 'http://localhost:8090/api/checkouts';
  constructor(private http: HttpClient) {}

  getAllOrders(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  placeOrder(checkoutData: any, cartId: number) {
    return this.http.post(`${this.baseUrl}/${cartId}`, checkoutData);
  }
  
  getOrderDetails(orderId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${orderId}`);
  }

  getOrderItems(orderId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${orderId}/items`);
  }

  getUserOrders(userId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/user/${userId}`);
  }

  updateOrderStatus(orderId: number, status: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/${orderId}/status`, { status });
  }

  updateOrderStatusWithNotification(orderId: number, status: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/${orderId}/status`, { status });
  }
}
