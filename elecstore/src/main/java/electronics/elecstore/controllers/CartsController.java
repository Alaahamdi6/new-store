package electronics.elecstore.controllers;

import electronics.elecstore.models.CartItemModel;
import electronics.elecstore.models.CartsModel;
import electronics.elecstore.services.CartItemService;
import electronics.elecstore.services.CartsService;

import java.util.List;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartsController {
    private final CartsService cartService;
    private final CartItemService cartItemService;

    public CartsController(CartsService cartService, CartItemService cartItemService) {
        this.cartService = cartService;
		this.cartItemService = cartItemService;
    }

    @GetMapping("/{userId}")
    public CartsModel getCart(@PathVariable Long userId) {
        return cartService.getCartByUserId(userId);
    }
    
    @GetMapping("/items/{userId}")
    public List<CartItemModel> getCartItems(@PathVariable Long userId) {
        return cartService.getCartItemsByUserId(userId);
    }

    @PostMapping("/add")
    public CartItemModel addItemToCart(@RequestParam Long userId, @RequestParam int productId, @RequestParam int quantity) {
        return cartService.addItemToCart(userId, productId, quantity);
    }
    
    @PutMapping("/update")
    public CartItemModel updateCartItemQuantity(@RequestParam Long cartId, @RequestParam int productId, @RequestParam int newQuantity) {
        return cartService.updateCartItemQuantity(cartId, productId, newQuantity);
    }

    @DeleteMapping("/delete/{userId}")
    public void clearCart(@PathVariable Long userId) {
        cartService.clearCart(userId);
    }
    
    @DeleteMapping("/item/{cartItemId}")
    public void removeCartItem(@PathVariable Long cartItemId) {
        cartItemService.deleteCartItem(cartItemId);
    }
}
