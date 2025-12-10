import { Component, OnInit ,PLATFORM_ID, Inject} from '@angular/core';
import { CommonModule,isPlatformBrowser } from '@angular/common';
import { AuthService } from '../../services/authentication/auth.service';
import { Router,RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CheckoutService } from '../../services/checkout/checkout.service';
import { WishlistService } from '../../services/wishlist/wishlist.service';
import { UserService } from '../../services/user/user.service';
import { CartService } from '../../services/cart/cart.service';
import { AuthStateService } from '../../services/authState/auth-state.service';
import { CartItem } from '../../models/cartItem.model';


@Component({
  selector: 'app-profile',
  imports: [CommonModule,RouterModule,ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  activeTab = 'profile';
  user: any = null; // Store user details
  orders: any[] = []; // Store order history
  wishlist: any[] = []; // Store wishlist items
  selectedOrder: any = null;
  orderItems: any[] = [];
  selectedPhoto: string | null = null;
  cartItems: CartItem[] = [];
  currentUser: any = null;
  

  // Forms
  profileForm: FormGroup;
  passwordForm: FormGroup;
  preferencesForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private checkoutService: CheckoutService,
    private wishlistService: WishlistService,
    private userService: UserService,
    private cartService: CartService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private toastr: ToastrService,
    private authStateService: AuthStateService,
  ) {
    // Initialize profile form
    this.profileForm = this.fb.group({
      //username: ['', Validators.required],
      username: ['', [Validators.required, Validators.email]],
      photo: [''], // Add this line for the profile picture
      // fullName: [''],
      // phone: [''],
      // address: [''],
    });

    // Initialize password form
    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    });

    // Initialize preferences form
    this.preferencesForm = this.fb.group({
      emailNotifications: [true],
      language: ['en'],
      theme: ['light'],
    });
  }

  ngOnInit(): void {
    // Load user details from localStorage
    const userDetails = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (userDetails) {
      this.user = userDetails;
      this.profileForm.patchValue({
        username: userDetails.username,
        email: userDetails.email,
        fullName: userDetails.fullName,
        phone: userDetails.phone,
        address: userDetails.address,
      });
    }

    // Load order history and wishlist (mock data for now)
    this.loadOrderHistory();
    this.loadWishlist();
  }

  loadWishlist(): void {
    const userId = this.user?.id;
    if (userId) {
      this.wishlistService.getWishlistByUser(userId).subscribe({
        next: (wishlist) => {
          this.wishlist = wishlist?.products || []; 
        },
        error: (err) => {
          console.error('Failed to load wishlist:', err);
        },
      });
    }
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        // Set the selected photo for preview
        this.selectedPhoto = reader.result as string;

        // Update the form control for the profile picture
        this.profileForm.patchValue({
          photo: file, // Store the file object
        });
      };
      reader.readAsDataURL(file);
    }
  }
  
  saveProfile(): void {
    if (this.profileForm.valid && this.user) {
      const formData = new FormData();
  
      // Append all form fields to FormData
      Object.keys(this.profileForm.controls).forEach((key) => {
        const control = this.profileForm.get(key);
        if (control && control.value) {
          formData.append(key, control.value);
        }
      });
  
      // Append the photo file if it exists
      const photoControl = this.profileForm.get('photo');
      if (photoControl && photoControl.value instanceof File) {
        formData.append('photo', photoControl.value);
      }
  
      // Call the UserService to update the user profile
      this.userService.updateUser(this.user.id, formData).subscribe({
        next: (updatedUser) => {
          this.user = updatedUser;
          localStorage.setItem('currentUser', JSON.stringify(updatedUser));  
          // Clear the selected photo preview
          this.selectedPhoto = null;
          window.location.reload();
        },
        error: (err) => {
          console.error('Failed to update profile:', err);
          alert('Failed to update profile. Please try again.');
        },
      });
    }
  }

  // Change password
  changePassword(): void {
    if (this.passwordForm.valid) {
      const { currentPassword, newPassword, confirmPassword } = this.passwordForm.value;
      if (newPassword === confirmPassword) {
        console.log('Password changed:', newPassword);
        // Call API to change password
      } else {
        alert('New password and confirm password do not match.');
      }
    }
  }

  // Save preferences
  savePreferences(): void {
    if (this.preferencesForm.valid) {
      const preferences = this.preferencesForm.value;
      console.log('Preferences saved:', preferences);
      // Call API to save preferences
    }
  }

  viewOrderDetails(orderId: number): void {
    this.checkoutService.getOrderDetails(orderId).subscribe({
      next: (order) => {
        this.selectedOrder = order;
        this.loadOrderItems(orderId);
        // Show modal
        const modal = document.getElementById('orderDetailsModal');
        if (modal) {
          (window as any).bootstrap.Modal.getOrCreateInstance(modal).show();
        }
      },
      error: (err) => {
        console.error('Failed to load order details:', err);
        // Handle error
      }
    });
  }

  private loadOrderItems(orderId: number): void {
    this.checkoutService.getOrderItems(orderId).subscribe({
      next: (items) => {
        this.orderItems = items;
      },
      error: (err) => {
        console.error('Failed to load order items:', err);
      }
    });
  }


  loadOrderHistory(): void {
    const userId = this.user?.id;
    if (userId) {
      this.checkoutService.getUserOrders(userId).subscribe({
        next: (orders) => {
          this.orders = orders;

        },
        error: (err) => {
          console.error('Failed to load orders:', err);
        }
      });
    }
  }

  removeFromWishlist(productId: number): void {
    const userId = this.user?.id;
    if (userId) {
      this.wishlistService.removeProductFromWishlist(userId, productId).subscribe({
        next: () => {
          this.wishlist = this.wishlist.filter((item) => item.id !== productId);
          console.log('Product removed from wishlist:', productId);
        },
        error: (err) => {
          console.error('Failed to remove product from wishlist:', err);
        },
      });
    }
  }

  loadCart(): void {
    if (isPlatformBrowser(this.platformId)) {
      const userDetails = JSON.parse(localStorage.getItem('currentUser') || '{}');
  
      if (userDetails) {
        const userId = userDetails.id; // Retrieve userId from stored user details
  
    this.cartService.getCart(userId).subscribe(cart => {
      this.cartItems = cart.cartItems;
    
    });
    } else {
      console.warn('ERROR.');
    }
    }
  }
  addToCart(productId: number, quantity: number): void {
    if (isPlatformBrowser(this.platformId )) {
      const userDetails = JSON.parse(localStorage.getItem('currentUser') || '{}');
  
      if (userDetails) {
        const userId = userDetails.id; 
  
        this.cartService.addItem(userId, productId, quantity).subscribe(() => {
          this.loadCart();
          this.toastr.success('Item Added to cart ', 'Item Added Successfully');
        });
      } 
    }else {
      this.toastr.info('User is not logged in. Cannot add to cart.');
    }
  }

  logout(): void {
    this.authService.logout();
    this.authStateService.clearCurrentUser(); 
    this.router.navigate(['/']);
  }
}