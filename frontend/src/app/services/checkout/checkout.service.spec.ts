import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { CheckoutService } from './checkout.service';

describe('CheckoutService', () => {
  let service: CheckoutService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CheckoutService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(CheckoutService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getAllOrders should GET /api/checkouts', () => {
    let response: any;
    service.getAllOrders().subscribe(res => (response = res));

    const req = httpMock.expectOne('http://localhost:8090/api/checkouts');
    expect(req.request.method).toBe('GET');
    req.flush([{ id: 1 }, { id: 2 }]);
    expect(response.length).toBe(2);
  });

  it('placeOrder should POST /api/checkouts/{cartId} with body', () => {
    const body = { total: 100 };
    const cartId = 42;
    let response: any;
    service.placeOrder(body, cartId).subscribe(res => (response = res));

    const req = httpMock.expectOne(`http://localhost:8090/api/checkouts/${cartId}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(body);
    req.flush({ success: true });
    expect(response.success).toBeTrue();
  });

  it('getOrderDetails should GET /api/checkouts/{orderId}', () => {
    const orderId = 7;
    let response: any;
    service.getOrderDetails(orderId).subscribe(res => (response = res));

    const req = httpMock.expectOne(`http://localhost:8090/api/checkouts/${orderId}`);
    expect(req.request.method).toBe('GET');
    req.flush({ id: orderId });
    expect(response.id).toBe(orderId);
  });

  it('getOrderItems should GET /api/checkouts/{orderId}/items', () => {
    const orderId = 7;
    let response: any;
    service.getOrderItems(orderId).subscribe(res => (response = res));

    const req = httpMock.expectOne(`http://localhost:8090/api/checkouts/${orderId}/items`);
    expect(req.request.method).toBe('GET');
    req.flush([{ productId: 1 }, { productId: 2 }]);
    expect(response.length).toBe(2);
  });

  it('getUserOrders should GET /api/checkouts/user/{userId}', () => {
    const userId = 99;
    let response: any;
    service.getUserOrders(userId).subscribe(res => (response = res));

    const req = httpMock.expectOne(`http://localhost:8090/api/checkouts/user/${userId}`);
    expect(req.request.method).toBe('GET');
    req.flush([{ id: 1 }]);
    expect(response.length).toBe(1);
  });

  it('updateOrderStatus should PUT /api/checkouts/{orderId}/status with {status}', () => {
    const orderId = 12;
    const status = 'SHIPPED';
    let response: any;
    service.updateOrderStatus(orderId, status).subscribe(res => (response = res));

    const req = httpMock.expectOne(`http://localhost:8090/api/checkouts/${orderId}/status`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ status });
    req.flush({ updated: true });
    expect(response.updated).toBeTrue();
  });

  it('updateOrderStatusWithNotification should PUT same endpoint with {status}', () => {
    const orderId = 13;
    const status = 'DELIVERED';
    let response: any;
    service.updateOrderStatusWithNotification(orderId, status).subscribe(res => (response = res));

    const req = httpMock.expectOne(`http://localhost:8090/api/checkouts/${orderId}/status`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ status });
    req.flush({ notified: true });
    expect(response.notified).toBeTrue();
  });
});
