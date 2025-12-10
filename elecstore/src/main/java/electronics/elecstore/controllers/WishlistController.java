package electronics.elecstore.controllers;

import electronics.elecstore.models.WishlistModel;
import electronics.elecstore.services.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/wishlist")
@CrossOrigin(origins = "*")
public class WishlistController {

    @Autowired
    private WishlistService wishlistService;

    // Get wishlist by user ID
    @GetMapping("/{userId}")
    public Optional<WishlistModel> getWishlist(@PathVariable Integer userId) {
        return wishlistService.getWishlistByUser(userId);
    }

    // Add product to wishlist
    @PostMapping("/add")
    public WishlistModel addProduct(@RequestBody Map<String, Integer> request) {
        Integer userId = request.get("userId");
        Integer productId = request.get("productId");
        return wishlistService.addProductToWishlist(userId, productId);
    }
    
    @DeleteMapping("/remove")
    public void removeProduct(@RequestParam Integer userId, @RequestParam Integer productId) {
        wishlistService.removeProductFromWishlist(userId, productId);
    }

}
