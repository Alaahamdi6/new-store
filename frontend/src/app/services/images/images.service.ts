import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ImagesModel } from '../../models/images.model';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {
  private baseUrl = 'http://localhost:8090/api/images';

  constructor(private http: HttpClient) {}

  getImagesByProductId(productId: number): Observable<ImagesModel[]> {
    return this.http.get<ImagesModel[]>(`${this.baseUrl}/product/${productId}`);
  }
}