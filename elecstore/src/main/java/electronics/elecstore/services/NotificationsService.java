package electronics.elecstore.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import electronics.elecstore.models.NotificationsModel;
import electronics.elecstore.repositories.NotificationsRepository;

import java.util.List;

@Service
public class NotificationsService {
 
 @Autowired
 private NotificationsRepository notificationRepository;
 
 @Autowired
 private EmailService emailService;
 
 public NotificationsModel createNotification(NotificationsModel notification) {
     return notificationRepository.save(notification);
 }
 
 public List<NotificationsModel> getUserNotifications(Long userId) {
     return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
 }
 
 public List<NotificationsModel> getUnreadNotifications(Long userId) {
     return notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId);
 }
 
 public long getUnreadCount(Long userId) {
     return notificationRepository.countByUserIdAndIsReadFalse(userId);
 }
 
 public NotificationsModel markAsRead(Long notificationId) {
	 NotificationsModel notification = notificationRepository.findById(notificationId)
         .orElseThrow(() -> new RuntimeException("Notification not found"));
     notification.setRead(true);
     return notificationRepository.save(notification);
 }
 
 public void sendOrderStatusNotification(Long userId, String userEmail, Long orderId, String newStatus) {
     String title = "Order Status Updated";
     String message = String.format("Your order #%d is now %s", orderId, newStatus);
     String metadata = String.format("{\"orderId\": %d, \"newStatus\": \"%s\"}", orderId, newStatus);
     
     // Save to database
     NotificationsModel notification = new NotificationsModel();
     notification.setUserId(userId);
     notification.setType(NotificationsModel.NotificationType.ORDER_UPDATE);
     notification.setTitle(title);
     notification.setMessage(message);
     notification.setMetadata(metadata);
     createNotification(notification);
     
     // Send email for important status changes
     if (List.of("ORDERED", "DELIVERED", "PRPCESSING", "CANCELLED","SHIPPED").contains(newStatus)) {
         emailService.sendOrderStatusEmail(userEmail, orderId, newStatus);
     }
     
     // TODO: Add WebSocket notification if user is online
 }
}
