package electronics.elecstore.services;

import electronics.elecstore.models.ProductsModel;
import electronics.elecstore.repositories.ProductsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductsService {

    @Autowired
    private ProductsRepository productsRepository;

    public List<ProductsModel> getAllProducts() {
        return productsRepository.findAll();
    }

    public Optional<ProductsModel> getProductById(int id) {
        return productsRepository.findById(id);
    }
    
    public List<ProductsModel> getProductsByCategory(String category) {
        return productsRepository.findByCategory(category);
    }

    public ProductsModel saveProduct(ProductsModel product) {
        return productsRepository.save(product);
    }

    public void deleteProduct(int id) {
        productsRepository.deleteById(id);
    }
}
