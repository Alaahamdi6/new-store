import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CheckoutComponent } from './checkout.component';
import { CheckoutService } from '../../services/checkout/checkout.service';
import { CartService } from '../../services/cart/cart.service';
import { CouponService } from '../../services/coupon/coupon.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';

describe('CheckoutComponent - Essential Tests', () => {
  let component: CheckoutComponent;
  let fixture: ComponentFixture<CheckoutComponent>;
  let checkoutServiceSpy: jasmine.SpyObj<CheckoutService>;
  let cartServiceSpy: jasmine.SpyObj<CartService>;
  let couponServiceSpy: jasmine.SpyObj<CouponService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let toastrSpy: jasmine.SpyObj<ToastrService>;

  const mockCartItems = [
    {
      id: 1,
      quantity: 2,
      cart: { id: 101 },
      product: {
        id: 1,
        productName: 'Laptop',
        category: 'Electronics',
        brand: 'Dell',
        price: 1000,
        image: 'laptop.jpg',
        description: 'Laptop',
        date: '2024-01-01',
        availableColors: 'Black',
        popularity: 5,
        numberOfSales: 100,
      },
    },
  ];

  beforeEach(async () => {
    checkoutServiceSpy = jasmine.createSpyObj('CheckoutService', ['placeOrder']);
    cartServiceSpy = jasmine.createSpyObj('CartService', ['getCartItems']);
    couponServiceSpy = jasmine.createSpyObj('CouponService', ['applyCoupon']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    toastrSpy = jasmine.createSpyObj('ToastrService', ['success', 'error']);

    await TestBed.configureTestingModule({
      imports: [CheckoutComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: CheckoutService, useValue: checkoutServiceSpy },
        { provide: CartService, useValue: cartServiceSpy },
        { provide: CouponService, useValue: couponServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ToastrService, useValue: toastrSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CheckoutComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize checkout form', () => {
      expect(component.checkoutData).toBeDefined();
      expect(component.checkoutData.get('firstName')).toBeDefined();
      expect(component.checkoutData.get('email')).toBeDefined();
      expect(component.checkoutData.get('mobile')).toBeDefined();
    });

    it('should load cart on init', () => {
      localStorage.setItem('currentUser', JSON.stringify({ id: 1 }));
      cartServiceSpy.getCartItems.and.returnValue(of(mockCartItems));

      component.ngOnInit();

      expect(cartServiceSpy.getCartItems).toHaveBeenCalledWith(1);
      expect(component.cartItems).toEqual(mockCartItems);
    });

    it('should initialize with empty cart if user not logged in', () => {
      localStorage.removeItem('currentUser');
      component.ngOnInit();
      expect(component.cartItems).toEqual([]);
    });
  });

  describe('Cart Loading', () => {
    beforeEach(() => {
      localStorage.setItem('currentUser', JSON.stringify({ id: 1 }));
    });

    it('should load cart items successfully', () => {
      cartServiceSpy.getCartItems.and.returnValue(of(mockCartItems));

      component.loadCart();

      expect(component.cartItems).toEqual(mockCartItems);
      expect(component.cart_id).toBe(101);
    });

    it('should calculate total after loading cart', () => {
      cartServiceSpy.getCartItems.and.returnValue(of(mockCartItems));

      component.loadCart();

      expect(component.totalPrice).toBe(2000); // 2 * 1000
    });

    it('should handle error when loading cart', () => {
      cartServiceSpy.getCartItems.and.returnValue(
        throwError(() => new Error('Failed to load cart'))
      );

      component.loadCart();

      expect(component.cartItems).toEqual([]);
    });
  });

  describe('Total Calculation', () => {
    it('should calculate total price correctly', () => {
      component.cartItems = mockCartItems;
      component.calculateTotal();
      expect(component.totalPrice).toBe(2000); // 2 * 1000
    });

    it('should calculate total as 0 for empty cart', () => {
      component.cartItems = [];
      component.calculateTotal();
      expect(component.totalPrice).toBe(0);
    });

    it('should calculate total with multiple items', () => {
      component.cartItems = [
        ...mockCartItems,
        {
          id: 2,
          quantity: 1,
          cart: { id: 101 },
          product: {
            id: 2,
            productName: 'Mouse',
            category: 'Accessories',
            brand: 'Logitech',
            price: 50,
            image: 'mouse.jpg',
            description: 'Mouse',
            date: '2024-01-02',
            availableColors: 'Black',
            popularity: 4,
            numberOfSales: 200,
          },
        },
      ];

      component.calculateTotal();
      expect(component.totalPrice).toBe(2050); // (2 * 1000) + 50
    });
  });

  describe('Form Validation', () => {
    it('should validate required fields', () => {
      component.checkoutData.reset();
      expect(component.checkoutData.valid).toBeFalsy();
    });

    it('should validate email format', () => {
      const emailControl = component.checkoutData.get('email');
      emailControl?.setValue('invalid-email');
      expect(emailControl?.invalid).toBeTruthy();

      emailControl?.setValue('valid@email.com');
      expect(emailControl?.valid).toBeTruthy();
    });

    it('should validate mobile number format (8 digits)', () => {
      const mobileControl = component.checkoutData.get('mobile');
      mobileControl?.setValue('123');
      expect(mobileControl?.invalid).toBeTruthy();

      mobileControl?.setValue('12345678');
      expect(mobileControl?.valid).toBeTruthy();
    });

    it('should validate payment method is selected', () => {
      const paymentControl = component.checkoutData.get('payment');
      expect(paymentControl?.invalid).toBeTruthy();

      paymentControl?.setValue('credit_card');
      expect(paymentControl?.valid).toBeTruthy();
    });
  });

  describe('Order Placement', () => {
    beforeEach(() => {
      localStorage.setItem('currentUser', JSON.stringify({ id: 1 }));
      component.cart_id = 101;
      component.totalPrice = 2000;
    });

    it('should place order successfully', () => {
      component.checkoutData.patchValue({
        firstName: 'John',
        secondName: 'Doe',
        address: '123 Main St',
        city: 'New York',
        country: 'USA',
        postcode: '10001',
        mobile: '12345678',
        email: 'john@example.com',
        payment: 'credit_card',
      });

      checkoutServiceSpy.placeOrder.and.returnValue(of({ id: 1 }));
      routerSpy.navigate.and.returnValue(Promise.resolve(true));

      component.placeOrder();

      expect(checkoutServiceSpy.placeOrder).toHaveBeenCalled();
      expect(toastrSpy.success).toHaveBeenCalledWith('Order placed successfully!', 'Success');
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
    });

    it('should not place order with invalid form', () => {
      component.checkoutData.reset();
      component.placeOrder();

      expect(toastrSpy.error).toHaveBeenCalledWith(
        'Please fill out all required fields correctly.',
        'Error'
      );
      expect(checkoutServiceSpy.placeOrder).not.toHaveBeenCalled();
    });

    it('should include total price with shipping in order', () => {
      component.checkoutData.patchValue({
        firstName: 'John',
        secondName: 'Doe',
        address: '123 Main St',
        city: 'New York',
        country: 'USA',
        postcode: '10001',
        mobile: '12345678',
        email: 'john@example.com',
        payment: 'credit_card',
      });

      checkoutServiceSpy.placeOrder.and.returnValue(of({ id: 1 }));
      routerSpy.navigate.and.returnValue(Promise.resolve(true));

      component.placeOrder();

      const callArgs = checkoutServiceSpy.placeOrder.calls.mostRecent().args[0];
      expect(callArgs.totalPrice).toBe(2007); // 2000 + 7 (shipping)
    });

    it('should handle error when placing order', () => {
      component.checkoutData.patchValue({
        firstName: 'John',
        secondName: 'Doe',
        address: '123 Main St',
        city: 'New York',
        country: 'USA',
        postcode: '10001',
        mobile: '12345678',
        email: 'john@example.com',
        payment: 'credit_card',
      });

      checkoutServiceSpy.placeOrder.and.returnValue(
        throwError(() => new Error('Order failed'))
      );

      component.placeOrder();

      expect(toastrSpy.error).toHaveBeenCalledWith(
        'Error placing order. Please try again.',
        'Error'
      );
    });
  });

  describe('Coupon Application', () => {
    it('should initialize coupon fields', () => {
      expect(component.couponCode).toBe('');
      expect(component.couponMessage).toBe('');
      expect(component.isCouponApplied).toBeFalsy();
    });
  });
});
