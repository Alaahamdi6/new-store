package electronics.elecstore.repositories;

import electronics.elecstore.models.ProductsModel;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductsRepository extends JpaRepository<ProductsModel, Integer> {
	
	List<ProductsModel> findByCategory(String category);
    
}

