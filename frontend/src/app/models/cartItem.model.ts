import { Product } from './product.model';

export interface CartItem {
    id: number;            // Unique ID for the cart item
    product: Product;      // The product associated with this cart item
    quantity: number;      // Quantity of the product in the cart
}
