package electronics.elecstore.services;

import electronics.elecstore.models.CartItemModel;
import electronics.elecstore.repositories.CartItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CartItemService {

    @Autowired
    private CartItemRepository cartItemRepository;

    public CartItemModel addCartItem(CartItemModel cartItem) {
        return cartItemRepository.save(cartItem);
    }

    public List<CartItemModel> getAllCartItems() {
        return cartItemRepository.findAll();
    }

    public Optional<CartItemModel> getCartItemById(Long id) {
        return cartItemRepository.findById(id);
    }

    public void deleteCartItem(Long id) {
        cartItemRepository.deleteById(id);
    }
}
