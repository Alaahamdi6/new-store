import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { CartService } from './cart.service';
import { provideHttpClient } from '@angular/common/http';

describe('CartService', () => {
  let service: CartService;
  let httpMock: HttpTestingController;

  const baseUrl = 'http://localhost:8090/api/cart';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CartService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(CartService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.removeItem('currentUser');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getCart & getCartItems', () => {
    beforeEach(() => {
      localStorage.setItem('currentUser', JSON.stringify({ token: 'FAKE_TOKEN' }));
    });

    it('getCart sends Authorization header and GET request', () => {
      service.getCart(5).subscribe();

      const req = httpMock.expectOne(`${baseUrl}/5`);
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toBe('Bearer FAKE_TOKEN');
      req.flush({ cartItems: [] });
    });

    it('getCartItems sends Authorization header and GET request', () => {
      service.getCartItems(7).subscribe();

      const req = httpMock.expectOne(`${baseUrl}/items/7`);
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toBe('Bearer FAKE_TOKEN');
      req.flush([]);
    });
  });

  describe('addItem & removeItem emit cartUpdated', () => {
    beforeEach(() => {
      localStorage.setItem('currentUser', JSON.stringify({ token: 'T' }));
    });

    it('addItem posts with params and emits cartUpdated$', (done) => {
      const emitted: boolean[] = [];
      service.cartUpdated$.subscribe(() => emitted.push(true));

      service.addItem(2, 10, 3).subscribe();

      const req = httpMock.expectOne((r) => r.url === `${baseUrl}/add`);
      expect(req.request.method).toBe('POST');
      // params should exist
      expect(req.request.params.get('userId')).toBe('2');
      expect(req.request.params.get('productId')).toBe('10');
      expect(req.request.params.get('quantity')).toBe('3');
      req.flush({});

      // allow microtask queue to process tap()
      setTimeout(() => {
        expect(emitted.length).toBe(1);
        done();
      }, 0);
    });

    it('removeItem deletes and emits cartUpdated$', (done) => {
      const emitted: boolean[] = [];
      service.cartUpdated$.subscribe(() => emitted.push(true));

      service.removeItem(11).subscribe();

      const req = httpMock.expectOne(`${baseUrl}/item/11`);
      expect(req.request.method).toBe('DELETE');
      req.flush({});

      setTimeout(() => {
        expect(emitted.length).toBe(1);
        done();
      }, 0);
    });
  });

  describe('updateQuantity and clearCart', () => {
    beforeEach(() => {
      localStorage.setItem('currentUser', JSON.stringify({ token: 'XYZ' }));
    });

    it('updateQuantity sends PUT to /update with params', () => {
      service.updateQuantity(1, 2, 5).subscribe();

      const req = httpMock.expectOne((r) => r.url === `${baseUrl}/update`);
      expect(req.request.method).toBe('PUT');
      // params are added as strings
      expect(req.request.params.get('cartId')).toBe('1');
      expect(req.request.params.get('productId')).toBe('2');
      expect(req.request.params.get('newQuantity')).toBe('5');
      req.flush({});
    });

    it('clearCart sends DELETE to clear endpoint', () => {
      service.clearCart(9).subscribe();

      const req = httpMock.expectOne(`${baseUrl}/clear/9`);
      expect(req.request.method).toBe('DELETE');
      req.flush({});
    });
  });
});
