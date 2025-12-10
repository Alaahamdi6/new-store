package electronics.elecstore.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import electronics.elecstore.models.CartItemModel;
import electronics.elecstore.models.CartsModel;
import electronics.elecstore.models.CheckoutModel;
import electronics.elecstore.models.OrderItemModel;
import electronics.elecstore.repositories.CartItemRepository;
import electronics.elecstore.repositories.CartsRepository;
import electronics.elecstore.repositories.OrderItemRepository;
import electronics.elecstore.services.CheckoutService;
import jakarta.transaction.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/checkouts")
@CrossOrigin(origins = "http://localhost:4200")
public class CheckoutController {

    @Autowired
    private CheckoutService checkoutService;
    
    @Autowired
    private CartsRepository cartRepository;
    
    @Autowired
    private OrderItemRepository orderItemRepository;
    
    @Autowired
    private CartItemRepository cartItemRepository;

    @GetMapping
    public List<CheckoutModel> getAllCheckouts() {
        return checkoutService.getAllCheckouts();
    }

    @GetMapping("/{id}")
    public Optional<CheckoutModel> getCheckoutById(@PathVariable Long id) {
        return checkoutService.getCheckoutById(id);
    }

    @PostMapping("/{cartId}")
    @Transactional
    public CheckoutModel createCheckout(@RequestBody CheckoutModel checkout, @PathVariable Long cartId) {    

    	CartsModel cart = cartRepository.findById(cartId)
    	        .orElseThrow(() -> new RuntimeException("Cart not found"));
    	Long userId = cart.getUserId(); 
        checkout.setUserId(userId);



        checkout = checkoutService.createCheckout(checkout); 

        List<OrderItemModel> orderItems = new ArrayList<>();
        for (CartItemModel cartItem : cart.getCartItems()) {
            OrderItemModel orderItem = new OrderItemModel(
                checkout, 
                cartItem.getProduct(),
                cartItem.getQuantity(),
                cartItem.getProduct().getPrice()
            );
            orderItems.add(orderItem);
        }
        orderItemRepository.saveAll(orderItems);  
        cartItemRepository.deleteByCartId(cartId);
        cartRepository.deleteById(cartId);  

        return checkout;
    }


    @DeleteMapping("/{id}")
    public void deleteCheckout(@PathVariable Long id) {
        checkoutService.deleteCheckout(id);
    }
    
    @GetMapping("/user/{userId}")
    public List<CheckoutModel> getCheckoutsByUser(@PathVariable Long userId) {
        return checkoutService.getCheckoutsByUserId(userId);
    }

    @GetMapping("/{orderId}/items")
    public List<OrderItemModel> getOrderItems(@PathVariable Long orderId) {
        return checkoutService.getOrderItems(orderId);
    }
    
    @PutMapping("/{orderId}/status")
    public ResponseEntity<CheckoutModel> updateOrderStatus(
        @PathVariable Long orderId,
        @RequestBody Map<String, String> request) {

        String statusStr = request.get("status"); // Get the status as a string
        if (statusStr == null) {
            return ResponseEntity.badRequest().build(); // Return 400 if status is not provided
        }

        try {
            // Convert the string to the OrderStatus enum
            CheckoutModel.OrderStatus status = CheckoutModel.OrderStatus.valueOf(statusStr.toUpperCase());

            // Update the order status
            CheckoutModel updatedOrder = checkoutService.updateOrderStatus(orderId, status);
            if (updatedOrder != null) {
                return ResponseEntity.ok(updatedOrder); // Return 200 with the updated order
            } else {
                return ResponseEntity.notFound().build(); // Return 404 if the order is not found
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build(); // Return 400 if the status is invalid
        }
    }
}

