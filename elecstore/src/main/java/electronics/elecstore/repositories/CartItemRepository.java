package electronics.elecstore.repositories;

import electronics.elecstore.models.CartItemModel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartItemRepository extends JpaRepository<CartItemModel, Long> {
	CartItemModel findByCartIdAndProductId(Long cartId, int productId);
	void deleteByCartId(Long cartId);
}
