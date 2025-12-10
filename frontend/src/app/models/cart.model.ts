import { CartItem } from './cartItem.model';

export interface Cart {
    id: number;              // Unique ID for the cart
    userId: number;          // ID of the user associated with the cart
    items: CartItem[];       // List of items in the cart
    totalPrice: number;      // Total price of all items in the cart
}
