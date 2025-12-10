import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AdminOrdersComponent } from './admin-orders.component';
import { CheckoutService } from '../../services/checkout/checkout.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';

describe('AdminOrdersComponent', () => {
  let component: AdminOrdersComponent;
  let fixture: ComponentFixture<AdminOrdersComponent>;
  let checkoutServiceSpy: jasmine.SpyObj<CheckoutService>;
  let toastrSpy: jasmine.SpyObj<ToastrService>;

  beforeEach(async () => {
    checkoutServiceSpy = jasmine.createSpyObj('CheckoutService', [
      'getAllOrders',
      'getOrderDetails',
      'getOrderItems',
      'updateOrderStatusWithNotification'
    ]);
    toastrSpy = jasmine.createSpyObj('ToastrService', ['success', 'error']);

    await TestBed.configureTestingModule({
      imports: [AdminOrdersComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: CheckoutService, useValue: checkoutServiceSpy },
        { provide: Router, useValue: {} },
        { provide: ToastrService, useValue: toastrSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminOrdersComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load orders on init', () => {
    const mockOrders = [{ id: 1, status: 'ORDERED' }];
    checkoutServiceSpy.getAllOrders.and.returnValue(of(mockOrders));
    component.ngOnInit();
    expect(component.orders).toEqual(mockOrders);
  });

  it('should handle error when loading orders', () => {
    checkoutServiceSpy.getAllOrders.and.returnValue(throwError(() => new Error('error')));
    component.loadOrders();
    expect(toastrSpy.error).toHaveBeenCalledWith('Failed to load orders', 'Error');
  });

  it('should view order details and load items', () => {
    const mockOrder = { id: 1, status: 'ORDERED' };
    const mockItems = [{ id: 101, name: 'Laptop' }];
    checkoutServiceSpy.getOrderDetails.and.returnValue(of(mockOrder));
    checkoutServiceSpy.getOrderItems.and.returnValue(of(mockItems));
    spyOn(document, 'getElementById').and.returnValue(null); // Avoid modal logic

    component.viewOrderDetails(1);
    expect(component.selectedOrder).toEqual(mockOrder);
    expect(component.orderItems).toEqual(mockItems);
  });

  it('should update order status successfully', () => {
    const mockOrders = [{ id: 1, status: 'ORDERED' }];
    component.orders = mockOrders;
    checkoutServiceSpy.updateOrderStatusWithNotification.and.returnValue(of({}));
    component.updateOrderStatus(1, 'DELIVERED');
    expect(toastrSpy.success).toHaveBeenCalledWith('Order status updated and notification sent', 'Success');
    expect(component.orders[0].status).toBe('DELIVERED');
  });

  it('should handle error when updating order status', () => {
    const mockOrders = [{ id: 1, status: 'ORDERED' }];
    component.orders = mockOrders;
    checkoutServiceSpy.updateOrderStatusWithNotification.and.returnValue(throwError(() => new Error('error')));
    spyOn(document, 'querySelector').and.returnValue({ value: 'ORDERED' } as any);

    component.updateOrderStatus(1, 'DELIVERED');
    expect(toastrSpy.error).toHaveBeenCalledWith('Failed to update order status', 'Error');
    expect(component.orders[0].status).toBe('ORDERED');
  });

  it('should return correct status class', () => {
    expect(component.getStatusClass('DELIVERED')).toBe('status-delivered');
    expect(component.getStatusClass('PROCESSING')).toBe('status-processing');
    expect(component.getStatusClass('ORDERED')).toBe('status-ordered');
    expect(component.getStatusClass('UNKNOWN')).toBe('');
  });
});