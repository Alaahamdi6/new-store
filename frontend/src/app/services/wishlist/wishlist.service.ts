import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private apiUrl = 'http://localhost:8090/api/wishlist';
  constructor(private http: HttpClient) {}

  // Get wishlist by user ID
  getWishlistByUser(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${userId}`);
  }

  // Add product to wishlist
  addProductToWishlist(userId: number, productId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, { userId, productId });
  }

  // Remove product from wishlist
  removeProductFromWishlist(userId: number, productId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/remove`, { params: { userId, productId } });
  }
}