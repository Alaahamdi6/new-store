package electronics.elecstore.services;

import electronics.elecstore.models.WishlistModel;
import electronics.elecstore.models.UsersModel;
import electronics.elecstore.models.ProductsModel;
import electronics.elecstore.repositories.WishlistRepository;
import electronics.elecstore.repositories.ProductsRepository;
import electronics.elecstore.repositories.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Optional;

@Service
public class WishlistService {

    @Autowired
    private WishlistRepository wishlistRepository;

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private ProductsRepository productsRepository;

    // Get wishlist by user
    public Optional<WishlistModel> getWishlistByUser(Integer userId) {
        UsersModel user = usersRepository.findById(userId).orElse(null);
        return user != null ? wishlistRepository.findByUser(user) : Optional.empty();
    }

    // Add product to wishlist
    public WishlistModel addProductToWishlist(Integer userId, Integer productId) {
        // Fetch user and product
        UsersModel user = usersRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        ProductsModel product = productsRepository.findById(productId)
            .orElseThrow(() -> new RuntimeException("Product not found"));

        // Fetch or create wishlist
        WishlistModel wishlist = wishlistRepository.findByUser(user)
            .orElse(new WishlistModel());
        wishlist.setUser(user);

        // Ensure the products list is initialized
        if (wishlist.getProducts() == null) {
            wishlist.setProducts(new ArrayList<>());
        }

        // Add product if not already in the wishlist
        if (!wishlist.getProducts().contains(product)) {
            wishlist.getProducts().add(product);
        }

        // Save and return the updated wishlist
        return wishlistRepository.save(wishlist);
    }
    
    public void removeProductFromWishlist(Integer userId, Integer productId) {
        Optional<WishlistModel> wishlistOpt = getWishlistByUser(userId);
        if (wishlistOpt.isPresent()) {
            WishlistModel wishlist = wishlistOpt.get();
            wishlist.getProducts().removeIf(product -> product.getId() == productId);
            wishlistRepository.save(wishlist);
        }
    }

    
}
