import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CartService } from '../../services/cart/cart.service';
import { CartItem } from '../../models/cartItem.model';
import { CommonModule,isPlatformBrowser } from '@angular/common';
import { CouponService } from '../../services/coupon/coupon.service';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  imports: [CommonModule,FormsModule,RouterModule],
})
export class CartsComponent implements OnInit {
  cartProducts: any[] = [];
  cartTotal: number = 0;
  couponCode: string = '';
  couponMessage: string = '';
  isCouponApplied: boolean = false;

  constructor(private cartService: CartService,@Inject(PLATFORM_ID) private platformId: Object,private couponService: CouponService) {}

  ngOnInit(): void {
    
    this.loadCart();
  }

  loadCart(): void {
    if (isPlatformBrowser(this.platformId)) {
    const userDetails = JSON.parse( localStorage.getItem('currentUser') || '{}');
    if (userDetails && userDetails.id) {
      this.cartService.getCartItems(userDetails.id).subscribe(
        (cartItems) => {
          this.cartProducts = cartItems;
          console.log(this.cartProducts);
          this.calculateTotal();
        },
        (error) => {
          console.error('Failed to load cart:', error);
        }
      );
    }
  }
  }

  calculateTotal(): void {
    this.cartTotal = this.cartProducts.reduce(
      (sum, item) => sum + item.quantity * item.product.price,
      0
    );
  }

  updateQuantity(cartItem: CartItem, cartId : number, newQuantity: number) {
    this.cartService.updateQuantity(cartId, cartItem.product.id, newQuantity).subscribe({
      next: (updatedItem) => {
        cartItem.quantity = updatedItem.quantity;
        this.calculateTotal(); // Recalculate totals after update
      },
      error: (err) => {
        console.error('Error updating cart item quantity:', err);
      },
    });
  }
  
  

  removeFromCart(cartItemId: number): void {
    this.cartService.removeItem(cartItemId).subscribe(() => {
      this.loadCart();
    });
  }

}
