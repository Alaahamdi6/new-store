package electronics.elecstore.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import electronics.elecstore.models.CheckoutModel;
import electronics.elecstore.models.CheckoutModel.OrderStatus;
import electronics.elecstore.models.OrderItemModel;
import electronics.elecstore.repositories.CheckoutRepository;
import electronics.elecstore.repositories.OrderItemRepository;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class CheckoutService {

    @Autowired
    private CheckoutRepository checkoutRepository;
    
    @Autowired
    private OrderItemRepository orderItemRepository;
    
    @Autowired
	private NotificationsService notificationService;

    public List<CheckoutModel> getAllCheckouts() {
        return checkoutRepository.findAll();
    }

    public Optional<CheckoutModel> getCheckoutById(Long id) {
        return checkoutRepository.findById(id);
    }

    public CheckoutModel createCheckout(CheckoutModel checkout) {
        return checkoutRepository.save(checkout);
    }

    public void deleteCheckout(Long id) {
        checkoutRepository.deleteById(id);
    }
    
    public List<CheckoutModel> getCheckoutsByUserId(Long userId) {
        return checkoutRepository.findByUserId(userId); // You'll need to create this method in repository
    }

    public List<OrderItemModel> getOrderItems(Long orderId) {
        return orderItemRepository.findByOrderId(orderId); // Add this method to OrderItemRepository
    }
    

    @Transactional
    public CheckoutModel updateOrderStatus(Long orderId, CheckoutModel.OrderStatus newStatus) {
        CheckoutModel order = checkoutRepository.findById(orderId)
            .orElseThrow(() -> new RuntimeException("Order not found"));
        
        CheckoutModel.OrderStatus oldStatus = order.getStatus();
        order.setStatus(newStatus);
        CheckoutModel updatedOrder = checkoutRepository.save(order);
        
        // Send notification
        notificationService.sendOrderStatusNotification(
        	updatedOrder.getUserId(),
        	updatedOrder.getEmail(),
            orderId,
            newStatus.toString()
        );
        
        return updatedOrder;
    }
}

