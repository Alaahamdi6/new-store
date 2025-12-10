import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestimonialService } from './testimonial.service';
import { provideHttpClient } from '@angular/common/http';
import { Testimonial } from '../../models/testimonial.model';

describe('TestimonialService', () => {
  let service: TestimonialService;
  let httpMock: HttpTestingController;
  const baseUrl = 'http://localhost:8090/api/testimonials';

  const mockTestimonials: Testimonial[] = [
    { id: 1, username: 'u1', comment: 'c1', stars: 5, photo: 'p1.jpg' },
    { id: 2, username: 'u2', comment: 'c2', stars: 4, photo: 'p2.jpg' }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TestimonialService, provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(TestimonialService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getTestimonials should GET an array of testimonials', () => {
    service.getTestimonials().subscribe((res) => {
      expect(res).toEqual(mockTestimonials);
      expect(res.length).toBe(2);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockTestimonials);
  });

  it('getTestimonialById should GET a testimonial by id', () => {
    service.getTestimonialById(1).subscribe(res => {
      expect(res).toEqual(mockTestimonials[0]);
    });

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTestimonials[0]);
  });

  it('addTestimonial should POST formdata and return created testimonial', () => {
    const fd = new FormData();
    fd.append('username', 'u3');
    fd.append('comment', 'c3');
    fd.append('stars', '5');

    const returned = { id: 3, username: 'u3', comment: 'c3', stars: 5, photo: 'p3.jpg' } as Testimonial;

    service.addTestimonial(fd).subscribe(res => {
      expect(res).toEqual(returned);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    req.flush(returned);
  });

  it('updateTestimonial should PUT the updated testimonial', () => {
    const updated = { id: 1, username: 'u1', comment: 'updated', stars: 5, photo: 'p1.jpg' } as Testimonial;
    service.updateTestimonial(1, updated).subscribe(res => {
      expect(res.comment).toBe('updated');
    });

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updated);
    req.flush(updated);
  });

  it('deleteTestimonial should DELETE and return void', () => {
    service.deleteTestimonial(2).subscribe(res => {
      expect(res).toBeUndefined();
    });

    const req = httpMock.expectOne(`${baseUrl}/2`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
