package electronics.elecstore.models;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "notifications")
public class NotificationsModel {
	 @Id
	 @GeneratedValue(strategy = GenerationType.IDENTITY)
	 private Long id;
	 
	 @Column(nullable = false)
	 private Long userId;
	 
	 @Enumerated(EnumType.STRING)
	 @Column(nullable = false)
	 private NotificationType type;
	 
	 @Column(nullable = false)
	 private String title;
	 
	 @Column(nullable = false, length = 500)
	 private String message;
	 
	 @Column(nullable = false)
	 private boolean isRead = false;
	 
	 @Column(nullable = false)
	 @Temporal(TemporalType.TIMESTAMP)
	 private Date createdAt = new Date();
	 
	 @Column(columnDefinition = "JSON")
	 private String metadata; // Stores additional data like orderId, status, etc.
	 
	 public enum NotificationType {
	     ORDER_UPDATE, SYSTEM, PROMOTION
	 }

	public NotificationsModel() {
		super();
	}

	public NotificationsModel(Long userId, NotificationType type, String title, String message, boolean isRead,
			Date createdAt, String metadata) {
		super();
		this.userId = userId;
		this.type = type;
		this.title = title;
		this.message = message;
		this.isRead = isRead;
		this.createdAt = createdAt;
		this.metadata = metadata;
	}

	public Long getId() {
		return id;
	}

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public NotificationType getType() {
		return type;
	}

	public void setType(NotificationType type) {
		this.type = type;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public boolean isRead() {
		return isRead;
	}

	public void setRead(boolean isRead) {
		this.isRead = isRead;
	}

	public Date getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(Date createdAt) {
		this.createdAt = createdAt;
	}

	public String getMetadata() {
		return metadata;
	}

	public void setMetadata(String metadata) {
		this.metadata = metadata;
	}
	 
	 
}
