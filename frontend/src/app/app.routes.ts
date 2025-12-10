import { Routes } from '@angular/router';
import { ProductsComponent } from './components/products/products.component';
import { ShopComponent } from './components/shop/shop.component';
import { TestimonialsComponent } from './components/testimonials/testimonials.component';
import { CartsComponent } from './components/carts/cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AdminOrdersComponent } from './components/admin-orders/admin-orders.component';
export const routes: Routes = [
    { path: '', component: ProductsComponent },
    { path: 'shop', component: ShopComponent },
    { path: 'testimonial', component: TestimonialsComponent },
    { path: 'cart', component: CartsComponent },
    { path: 'checkout', component: CheckoutComponent },
    { path: 'profile', component: ProfileComponent },
    { path: 'admin/orders', component: AdminOrdersComponent },
    //{ path: 'contact', component: ContactComponent },
  ];
