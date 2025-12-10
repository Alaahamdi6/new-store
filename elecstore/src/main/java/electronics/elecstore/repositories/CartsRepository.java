package electronics.elecstore.repositories;

import electronics.elecstore.models.CartsModel;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface CartsRepository extends JpaRepository<CartsModel, Long> {
	@Query("SELECT c FROM CartsModel c LEFT JOIN FETCH c.cartItems WHERE c.userId = :userId")
	Optional<CartsModel> findByUserId(Long userId);
}
