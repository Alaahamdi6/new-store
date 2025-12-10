package electronics.elecstore.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import electronics.elecstore.models.NotificationsModel;

import java.util.List;

@Repository
public interface NotificationsRepository extends JpaRepository<NotificationsModel, Long> {
	 List<NotificationsModel> findByUserIdOrderByCreatedAtDesc(Long userId);
	 List<NotificationsModel> findByUserIdAndIsReadFalseOrderByCreatedAtDesc(Long userId);
	 long countByUserIdAndIsReadFalse(Long userId);
}