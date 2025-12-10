package electronics.elecstore.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import electronics.elecstore.models.CheckoutModel;

@Repository
public interface CheckoutRepository extends JpaRepository<CheckoutModel, Long> {
	 List<CheckoutModel> findByUserId(Long userId);
}

