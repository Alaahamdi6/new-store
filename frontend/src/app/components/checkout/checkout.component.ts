import { Component, OnInit, PLATFORM_ID, Inject  } from '@angular/core';
import { CheckoutService } from '../../services/checkout/checkout.service';
import { CartService } from '../../services/cart/cart.service';
import { CouponService } from '../../services/coupon/coupon.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule , FormBuilder, FormGroup, Validators , ReactiveFormsModule} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule,ReactiveFormsModule],
})
export class CheckoutComponent implements OnInit {
  checkoutData: FormGroup;
  cartItems: any[] = [];
  cart: any[] = [];
  totalPrice: number = 0;
  couponCode: string = '';
  couponMessage: string = '';
  isCouponApplied: boolean = false;
  cart_id: number = -1;

  constructor(private checkoutService: CheckoutService, private couponService: CouponService,private cartService: CartService,@Inject(PLATFORM_ID) private platformId: Object, private router: Router, private toastr: ToastrService,private fb: FormBuilder,) {
    {
      this.checkoutData = this.fb.group({
        firstName: ['', Validators.required],
        secondName: ['', Validators.required],
        address: ['', Validators.required],
        city: ['', Validators.required],
        country: ['', Validators.required],
        postcode: ['', Validators.required],
        mobile: ['', [Validators.required, Validators.pattern(/^[0-9]{8}$/)]],
        email: ['', [Validators.required, Validators.email]],
        notes: [''],
        couponCode: [''],
        payment: ['', Validators.required]
      });
    }
  }

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    if (isPlatformBrowser(this.platformId)) {
      const userDetails = JSON.parse(localStorage.getItem('currentUser') || '{}');
      if (userDetails && userDetails.id) {
        this.cartService.getCartItems(userDetails.id).subscribe(
          (cartItems) => {
            this.cartItems = cartItems;
            this.calculateTotal();
            this.cart_id= cartItems[0].cart.id ;  
          },
          (error) => {
            console.error('Failed to load cart:', error);
          }
        );
      }
    }
  }

  calculateTotal(): void {
    this.totalPrice = this.cartItems.reduce(
      (sum, item) => sum + item.quantity * item.product.price,
      0
    );
  }

  placeOrder(): void {
    if (this.checkoutData.invalid) {
      this.toastr.error('Please fill out all required fields correctly.', 'Error');
      return;
    }
    const checkoutData = {
      ...this.checkoutData.value,
      totalPrice: this.totalPrice + 7  
    };
    console.log(this.cart_id);
    this.checkoutService.placeOrder(checkoutData, this.cart_id).subscribe({
      next: (response) => {
        this.toastr.success('Order placed successfully!', 'Success');
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Error placing order:', err);    
        this.toastr.error('Error placing order. Please try again.', 'Error');

      },
    });
  }

  applyCoupon() {
    if (!this.couponCode.trim()) {
      this.toastr.error('Invalid coupon code. Please try again.', 'Error');
      return;
    }
  
    if (this.isCouponApplied) {
      this.toastr.warning('Coupon has already been applied!', 'Warning');
      return;
    }
  
    this.couponService.validateCoupon(this.couponCode).subscribe(
      (coupon) => {
        if (coupon && coupon.products) {
          // Extract product IDs eligible for the coupon
          const eligibleProductIds = coupon.products.map((p: any) => p.id);
  
          // Calculate discount only for eligible products
          let totalDiscount = 0;
          this.cartItems.forEach(item => {
            if (eligibleProductIds.includes(item.product.id)) {
              const discount = (item.product.price * item.quantity * coupon.percentage) / 100;
              totalDiscount += discount;
            }
          });
  
          if (totalDiscount > 0) {
            this.totalPrice -= totalDiscount;
            this.toastr.success(`Coupon applied successfully! Discount: $${totalDiscount.toFixed(2)}`, 'Success');
            this.isCouponApplied = true;
          } else {
            this.toastr.error('No eligible products for this coupon.', 'Error');
          }
        } else {
          this.toastr.error('Invalid or expired coupon code.', 'Error');
        }
      },
      (error) => {
        this.toastr.error('Invalid or expired coupon code.', 'Error');
      }
    );
  }
}
