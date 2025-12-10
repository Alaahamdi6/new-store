package electronics.elecstore.services;

import electronics.elecstore.models.CartsModel;
import electronics.elecstore.models.CartItemModel;
import electronics.elecstore.models.ProductsModel;
import electronics.elecstore.repositories.CartsRepository;
import electronics.elecstore.repositories.CartItemRepository;
import electronics.elecstore.repositories.ProductsRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CartsService {
    private final CartsRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductsRepository productsRepository;

    public CartsService(CartsRepository cartRepository, CartItemRepository cartItemRepository, ProductsRepository productsRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productsRepository = productsRepository;
    }

    public CartsModel getCartByUserId(Long userId) {
        return cartRepository.findByUserId(userId).orElseGet(() -> {
            CartsModel cart = new CartsModel(userId);
            return cartRepository.save(cart);
        });
    }
    
    public List<CartItemModel> getCartItemsByUserId(Long userId) {
        return getCartByUserId(userId).getCartItems();
    }


    public CartItemModel addItemToCart(Long userId, int productId, int quantity) {
        CartsModel cart = getCartByUserId(userId);
        Optional<CartItemModel> existingItem = cart.getCartItems().stream()
        		.filter(item -> item.getProduct().getId() == productId)
                .findFirst();


        if (existingItem.isPresent()) {
            CartItemModel item = existingItem.get();
            item.setQuantity(item.getQuantity() + quantity);
            return cartItemRepository.save(item);
        } else {
            ProductsModel product = productsRepository.findById(productId)
                    .orElseThrow(() -> new IllegalArgumentException("Product not found"));
            CartItemModel newItem = new CartItemModel(cart, product, quantity);
            //cart.getCartItems().add(newItem);
            cartRepository.save(cart);
            return cartItemRepository.save(newItem);
        }
    }
    
    public CartItemModel updateCartItemQuantity(Long cartId, int productId, int newQuantity) {
        CartItemModel cartItem = cartItemRepository.findByCartIdAndProductId(cartId, productId);
        if (cartItem != null) {
            cartItem.setQuantity(newQuantity);
            return cartItemRepository.save(cartItem);
        }
        throw new IllegalArgumentException("Cart item not found for cartId: " + cartId + " and productId: " + productId);
    }


    public void clearCart(Long userId) {
        CartsModel cart = getCartByUserId(userId);
        cart.getCartItems().clear();
        cartRepository.save(cart);
    }
    
   
}
