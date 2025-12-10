import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { AuthStateService } from '../../services/authState/auth-state.service';
import { AuthService } from '../../services/authentication/auth.service';
import { CartService } from '../../services/cart/cart.service';
import { TestimonialService } from '../../services/testimonial/testimonial.service';
import { ToastrService } from 'ngx-toastr';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { PLATFORM_ID } from '@angular/core';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  let authService: jasmine.SpyObj<AuthService>;
  let cartService: jasmine.SpyObj<CartService>;
  let testimonialService: jasmine.SpyObj<TestimonialService>;
  let toastrService: jasmine.SpyObj<ToastrService>;

  beforeEach(async () => {
    const authServiceMock = jasmine.createSpyObj('AuthService', ['login', 'signup']);
    const cartServiceMock = jasmine.createSpyObj('CartService', ['getCartItems']);
    const testimonialServiceMock = jasmine.createSpyObj('TestimonialService', ['getTestimonials']);
    const toastrServiceMock = jasmine.createSpyObj('ToastrService', ['success']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);
    const authStateMock = jasmine.createSpyObj('AuthStateService', ['setCurrentUser', 'clearCurrentUser']);
    // give it an observable currentUser$ so component can subscribe
    (authStateMock as any).currentUser$ = of(null);

    // ensure cartUpdated$ exists on the mock (some tests subscribe to it)
    (cartServiceMock as any).cartUpdated$ = { subscribe: jasmine.createSpy('subscribe') };
    
    // ensure getTestimonials returns an observable to prevent "Cannot read properties of undefined" error
    testimonialServiceMock.getTestimonials.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [HeaderComponent, ReactiveFormsModule, RouterTestingModule, HttpClientTestingModule],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: CartService, useValue: cartServiceMock },
        { provide: TestimonialService, useValue: testimonialServiceMock },
        { provide: ToastrService, useValue: toastrServiceMock },
        { provide: AuthStateService, useValue: authStateMock },
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    cartService = TestBed.inject(CartService) as jasmine.SpyObj<CartService>;
    testimonialService = TestBed.inject(TestimonialService) as jasmine.SpyObj<TestimonialService>;
    toastrService = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;

    fixture.detectChanges();
  });

  it('should create the header component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize login and signup forms', () => {
    expect(component.loginForm).toBeTruthy();
    expect(component.signupForm).toBeTruthy();
  });

  it('should load cart count on initialization', () => {
    localStorage.setItem('currentUser', JSON.stringify({ id: 1 }));
    cartService.getCartItems.and.returnValue(of([{ id: 1 }, { id: 2 }]));
    component.loadCartCount();
    expect(cartService.getCartItems).toHaveBeenCalled();
    expect(component.cartItemCount).toEqual(2);
  });



  // it('should load testimonials', () => {
  //   const mockTestimonials = [{ id: 1, text: 'Testimonial 1' }, { id: 2, text: 'Testimonial 2' }];
  //   testimonialService.getTestimonials.and.returnValue(of(mockTestimonials));

  //   component.loadTestimonials();

  //   expect(testimonialService.getTestimonials).toHaveBeenCalled();
  //   expect(component.testimonials).toEqual(mockTestimonials);
  // });

  it('should subscribe to cart updates and reload cart count', () => {
    const cartUpdateSubject = (cartService as any).cartUpdated$;

    component.subscribeToCartChanges();

    expect(cartUpdateSubject.subscribe).toHaveBeenCalled();
  });
});
