import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { PLATFORM_ID } from '@angular/core';

import { ProfileComponent } from './profile.component';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  const mockAuthService = jasmine.createSpyObj('AuthService', ['logout']);
  const mockCheckoutService = jasmine.createSpyObj('CheckoutService', ['getOrderDetails', 'getOrderItems', 'getUserOrders']);
  const mockWishlistService = jasmine.createSpyObj('WishlistService', ['getWishlistByUser', 'removeProductFromWishlist']);
  const mockUserService = jasmine.createSpyObj('UserService', ['updateUser']);
  const mockCartService = jasmine.createSpyObj('CartService', ['getCart', 'addItem']);
  const mockAuthStateService = jasmine.createSpyObj('AuthStateService', ['clearCurrentUser']);
  const mockRouter = { navigate: jasmine.createSpy('navigate') };
  const mockToastr = jasmine.createSpyObj('ToastrService', ['success', 'info']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ToastrService, useValue: mockToastr },
        { provide: 'AuthService', useValue: mockAuthService },
        { provide: 'CheckoutService', useValue: mockCheckoutService },
        { provide: 'WishlistService', useValue: mockWishlistService },
        { provide: 'UserService', useValue: mockUserService },
        { provide: 'CartService', useValue: mockCartService },
        { provide: 'AuthStateService', useValue: mockAuthStateService },
        { provide: 'Router', useValue: mockRouter },
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    }).compileComponents();

    // default mock returns
    mockWishlistService.getWishlistByUser.and.returnValue(of({ products: [] }));
    mockCheckoutService.getUserOrders.and.returnValue(of([]));
    mockCartService.getCart.and.returnValue(of({ cartItems: [] }));

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    localStorage.removeItem('currentUser');
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('ngOnInit should read currentUser from localStorage and patch form', () => {
    const stored = { id: 1, username: 'test@example.com', email: 'test@example.com', fullName: 'John Doe', phone: '123', address: 'addr' };
    localStorage.setItem('currentUser', JSON.stringify(stored));
    fixture.detectChanges();

    expect(component.user).toBeTruthy();
    expect(component.user.username).toBe('test@example.com');
    expect(component.profileForm.value.username).toBe('test@example.com');
  });

  it('onFileChange should set selectedPhoto and update form control', () => {
    fixture.detectChanges();

    const fakeFile = new Blob(['abc'], { type: 'image/png' }) as any;
    fakeFile.name = 'photo.png';

    // Replace FileReader with a fake that triggers onload
    const FakeReader = function (this: any) {
      this.onload = null;
      this.readAsDataURL = function () {
        if (this.onload) {
          this.result = 'data:image/png;base64,FAKE';
          this.onload({});
        }
      };
    } as any;
    (window as any).FileReader = FakeReader;

    const event = { target: { files: [fakeFile] } } as any;
    component.onFileChange(event);

    expect(component.selectedPhoto).toContain('data:image');
    expect(component.profileForm.get('photo')?.value).toBe(fakeFile);
  });

  it('saveProfile should call updateUser and reload on success', () => {
    fixture.detectChanges();

    const fakeFile = new Blob(['abc'], { type: 'image/png' }) as any;
    fakeFile.name = 'photo.png';

    const storedUser = { id: 2, username: 'u@test.com' };
    component.user = storedUser;
    component.profileForm.patchValue({ username: 'u@test.com', photo: fakeFile });

    const updatedUser = { id: 2, username: 'updated@test.com' };
    mockUserService.updateUser.and.returnValue(of(updatedUser));

    spyOn(window.location, 'reload');

    component.saveProfile();

    expect(mockUserService.updateUser).toHaveBeenCalled();
    expect(localStorage.getItem('currentUser')).toContain('updated@test.com');
    expect(component.selectedPhoto).toBeNull();
    expect(window.location.reload).toHaveBeenCalled();
  });

  it('viewOrderDetails should set selectedOrder and load items', () => {
    fixture.detectChanges();

    const order = { id: 10, firstName: 'A', secondName: 'B' } as any;
    const items = [{ product: { productName: 'X', image: 'i.png', price: 5 }, quantity: 2 }];

    mockCheckoutService.getOrderDetails.and.returnValue(of(order));
    mockCheckoutService.getOrderItems.and.returnValue(of(items));

    component.viewOrderDetails(10);

    expect(mockCheckoutService.getOrderDetails).toHaveBeenCalledWith(10);
    expect(component.selectedOrder).toEqual(order);
    expect(component.orderItems).toEqual(items);
  });

  it('removeFromWishlist should call service and remove item', () => {
    fixture.detectChanges();
    component.user = { id: 5 } as any;
    component.wishlist = [{ id: 1 }, { id: 2 }] as any;
    mockWishlistService.removeProductFromWishlist.and.returnValue(of({}));

    component.removeFromWishlist(1);

    expect(mockWishlistService.removeProductFromWishlist).toHaveBeenCalledWith(5, 1);
    expect(component.wishlist.find(i => i.id === 1)).toBeUndefined();
  });

  it('addToCart should call cartService and show toastr on browser platform', () => {
    localStorage.setItem('currentUser', JSON.stringify({ id: 7 }));
    mockCartService.addItem.and.returnValue(of({}));

    component.addToCart(3, 1);

    expect(mockCartService.addItem).toHaveBeenCalledWith(7, 3, 1);
    expect(mockToastr.success).toHaveBeenCalled();
  });

  it('logout should call authService.logout and navigate to root', () => {
    fixture.detectChanges();
    component.logout();
    expect(mockAuthService.logout).toHaveBeenCalled();
    expect(mockAuthStateService.clearCurrentUser).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });
});
