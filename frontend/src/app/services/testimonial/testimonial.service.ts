import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Testimonial } from '../../models/testimonial.model';

@Injectable({
  providedIn: 'root'
})
export class TestimonialService {
  private baseUrl = 'http://localhost:8090/api/testimonials';

  constructor(private http: HttpClient) {}

  getTestimonials(): Observable<Testimonial[]> {
      return this.http.get<Testimonial[]>(this.baseUrl);
  }

  getTestimonialById(id: number): Observable<Testimonial> {
      return this.http.get<Testimonial>(`${this.baseUrl}/${id}`);
  }

  addTestimonial(testimonial: FormData): Observable<Testimonial> {
    return this.http.post<Testimonial>(this.baseUrl, testimonial);
}

  updateTestimonial(id: number, testimonial: Testimonial): Observable<Testimonial> {
      return this.http.put<Testimonial>(`${this.baseUrl}/${id}`, testimonial);
  }

  deleteTestimonial(id: number): Observable<void> {
      return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
