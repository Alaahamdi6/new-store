import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CartsComponent } from './cart.component';
import { CartService } from '../../services/cart/cart.service';
import { CouponService } from '../../services/coupon/coupon.service';
import { of, throwError } from 'rxjs';

describe('CartsComponent - Essential Tests', () => {
  let component: CartsComponent;
  let fixture: ComponentFixture<CartsComponent>;
  let cartServiceSpy: jasmine.SpyObj<CartService>;
  let couponServiceSpy: jasmine.SpyObj<CouponService>;

  const mockCartItems = [
    {
      id: 1,
      quantity: 2,
      product: {
        id: 1,
        productName: 'Laptop',
        category: 'Electronics',
        brand: 'Dell',
        price: 1000,
        image: 'laptop.jpg',
        description: 'High performance laptop',
        date: '2024-01-01',
        availableColors: 'Black,Silver',
        popularity: 5,
        numberOfSales: 100,
      },
    },
    {
      id: 2,
      quantity: 1,
      product: {
        id: 2,
        productName: 'Mouse',
        category: 'Accessories',
        brand: 'Logitech',
        price: 50,
        image: 'mouse.jpg',
        description: 'Wireless mouse',
        date: '2024-01-02',
        availableColors: 'Black',
        popularity: 4,
        numberOfSales: 200,
      },
    },
  ];

  beforeEach(async () => {
    cartServiceSpy = jasmine.createSpyObj('CartService', [
      'getCartItems',
      'addItem',
      'removeItem',
      'updateQuantity',
      'getCart',
    ]);
    couponServiceSpy = jasmine.createSpyObj('CouponService', ['applyCoupon']);

    await TestBed.configureTestingModule({
      imports: [CartsComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: CartService, useValue: cartServiceSpy },
        { provide: CouponService, useValue: couponServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CartsComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with empty cart', () => {
      expect(component.cartProducts).toEqual([]);
      expect(component.cartTotal).toBe(0);
      expect(component.couponCode).toBe('');
      expect(component.isCouponApplied).toBeFalsy();
    });

    it('should load cart on init', () => {
      localStorage.setItem('currentUser', JSON.stringify({ id: 1 }));
      cartServiceSpy.getCartItems.and.returnValue(of(mockCartItems));

      component.ngOnInit();

      expect(cartServiceSpy.getCartItems).toHaveBeenCalledWith(1);
      expect(component.cartProducts).toEqual(mockCartItems);
    });

    it('should not load cart if user not logged in', () => {
      localStorage.removeItem('currentUser');
      component.ngOnInit();
      expect(cartServiceSpy.getCartItems).not.toHaveBeenCalled();
    });
  });

  describe('Cart Loading', () => {
    beforeEach(() => {
      localStorage.setItem('currentUser', JSON.stringify({ id: 1 }));
    });

    it('should load cart items successfully', () => {
      cartServiceSpy.getCartItems.and.returnValue(of(mockCartItems));

      component.loadCart();

      expect(component.cartProducts).toEqual(mockCartItems);
      expect(component.cartTotal).toBe(2050); // (2 * 1000) + (1 * 50)
    });

    it('should handle error when loading cart', () => {
      cartServiceSpy.getCartItems.and.returnValue(
        throwError(() => new Error('Failed to load cart'))
      );

      component.loadCart();

      expect(component.cartProducts).toEqual([]);
    });

    it('should not load cart without user details', () => {
      localStorage.removeItem('currentUser');
      component.loadCart();
      expect(cartServiceSpy.getCartItems).not.toHaveBeenCalled();
    });
  });

  describe('Cart Calculations', () => {
    it('should calculate total correctly', () => {
      component.cartProducts = mockCartItems;
      component.calculateTotal();
      expect(component.cartTotal).toBe(2050); // (2 * 1000) + (1 * 50)
    });

    it('should calculate total as 0 for empty cart', () => {
      component.cartProducts = [];
      component.calculateTotal();
      expect(component.cartTotal).toBe(0);
    });

    it('should calculate total with different quantities', () => {
      component.cartProducts = [
        {
          ...mockCartItems[0],
          quantity: 3,
        },
      ];
      component.calculateTotal();
      expect(component.cartTotal).toBe(3000); // 3 * 1000
    });
  });

  describe('Quantity Management', () => {
    beforeEach(() => {
      localStorage.setItem('currentUser', JSON.stringify({ id: 1 }));
      component.cartProducts = JSON.parse(JSON.stringify(mockCartItems));
    });

    it('should update quantity successfully', () => {
      const updatedItem = { ...component.cartProducts[0], quantity: 5 };
      cartServiceSpy.updateQuantity.and.returnValue(of(updatedItem));

      component.updateQuantity(component.cartProducts[0], 1, 5);

      expect(cartServiceSpy.updateQuantity).toHaveBeenCalledWith(1, 1, 5);
      expect(component.cartProducts[0].quantity).toBe(5);
    });

    it('should recalculate total after quantity update', () => {
      const updatedItem = { ...component.cartProducts[0], quantity: 3 };
      cartServiceSpy.updateQuantity.and.returnValue(of(updatedItem));

      component.updateQuantity(component.cartProducts[0], 1, 3);

      // Total: (3 * 1000) + (1 * 50) = 3050
      expect(component.cartTotal).toBe(3050);
    });

    it('should handle error when updating quantity', () => {
      const originalQuantity = component.cartProducts[0].quantity;
      cartServiceSpy.updateQuantity.and.returnValue(
        throwError(() => new Error('Update failed'))
      );

      component.updateQuantity(component.cartProducts[0], 1, 5);

      expect(component.cartProducts[0].quantity).toBe(originalQuantity);
    });
  });

  describe('Remove from Cart', () => {
    beforeEach(() => {
      localStorage.setItem('currentUser', JSON.stringify({ id: 1 }));
      component.cartProducts = [...mockCartItems];
    });

    it('should remove item from cart successfully', () => {
      cartServiceSpy.removeItem.and.returnValue(of(undefined));
      cartServiceSpy.getCartItems.and.returnValue(of([mockCartItems[1]]));

      component.removeFromCart(1);

      expect(cartServiceSpy.removeItem).toHaveBeenCalledWith(1);
    });

    it('should reload cart after removing item', () => {
      cartServiceSpy.removeItem.and.returnValue(of(undefined));
      cartServiceSpy.getCartItems.and.returnValue(of([mockCartItems[1]]));
      spyOn(component, 'loadCart');

      component.removeFromCart(1);

      expect(component.loadCart).toHaveBeenCalled();
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
