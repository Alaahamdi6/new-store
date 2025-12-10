import { Component, OnInit ,PLATFORM_ID, Inject} from '@angular/core';
import { CommonModule,isPlatformBrowser } from '@angular/common';
import { CheckoutService } from '../../services/checkout/checkout.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormsModule} from '@angular/forms';

@Component({
  selector: 'app-admin-orders',
  imports: [CommonModule,FormsModule],
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.css'],
})
export class AdminOrdersComponent implements OnInit {
  orders: any[] = [];
  selectedOrder: any = null;
  orderItems: any[] = [];

  constructor(
    private checkoutService: CheckoutService,
    private router: Router,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  // Fetch all orders
  loadOrders(): void {
    this.checkoutService.getAllOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
      },
      error: (err) => {
        console.error('Failed to load orders:', err);
        this.toastr.error('Failed to load orders', 'Error');
      },
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
      }
    });
  }

  // Update order status
  updateOrderStatus(orderId: number, status: string): void {
    this.checkoutService.updateOrderStatusWithNotification(orderId, status).subscribe({
      next: () => {
        this.toastr.success('Order status updated and notification sent', 'Success');
        
        // Update the local orders array to reflect the change
        const order = this.orders.find(o => o.id === orderId);
        if (order) {
          order.status = status;
        }
      },
      error: (err) => {
        console.error('Failed to update order status:', err);
        this.toastr.error('Failed to update order status', 'Error');
        
        // Revert the select value in case of error
        const order = this.orders.find(o => o.id === orderId);
        if (order) {
          const selectElement = document.querySelector(`select[data-order-id="${orderId}"]`) as HTMLSelectElement;
          if (selectElement) {
            selectElement.value = order.status;
          }
        }
      },
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'DELIVERED':
        return 'status-delivered'; // Green
      case 'PROCESSING':
        return 'status-processing'; // Yellow
      case 'ORDERED':
        return 'status-ordered';   // Red
      default:
        return '';
    }
  }
}