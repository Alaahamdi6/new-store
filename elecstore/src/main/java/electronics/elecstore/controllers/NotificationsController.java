package electronics.elecstore.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import electronics.elecstore.models.NotificationsModel;
import electronics.elecstore.services.NotificationsService;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationsController {
 
	 @Autowired
	 private NotificationsService notificationService;
	 
	 @GetMapping("/user/{userId}")
	 public ResponseEntity<List<NotificationsModel>> getUserNotifications(@PathVariable Long userId) {
	     return ResponseEntity.ok(notificationService.getUserNotifications(userId));
	 }
	 
	 @GetMapping("/user/{userId}/unread")
	 public ResponseEntity<List<NotificationsModel>> getUnreadNotifications(@PathVariable Long userId) {
	     return ResponseEntity.ok(notificationService.getUnreadNotifications(userId));
	 }
	 
	 @GetMapping("/user/{userId}/unread-count")
	 public ResponseEntity<Long> getUnreadCount(@PathVariable Long userId) {
	     return ResponseEntity.ok(notificationService.getUnreadCount(userId));
	 }
	 
	 @PutMapping("/{notificationId}/mark-as-read")
	 public ResponseEntity<NotificationsModel> markAsRead(@PathVariable Long notificationId) {
	     return ResponseEntity.ok(notificationService.markAsRead(notificationId));
	 }
	 
	 @Autowired
     private SimpMessagingTemplate messagingTemplate;

     public void sendPrivateNotification(Long userId, NotificationsModel notification) {
        messagingTemplate.convertAndSendToUser(
            userId.toString(), 
            "/queue/notifications", 
            notification
        );
     }
	 
}
