import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CouponService {
  private baseUrl = 'http://localhost:8090/api/coupons'; 

  constructor(private http: HttpClient) {}

  validateCoupon(code: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/validate/${code}`);
  }
}

