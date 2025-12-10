package electronics.elecstore.controllers;

import electronics.elecstore.models.ProductsModel;
import electronics.elecstore.services.ProductsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:4200")
public class ProductsController {

    @Autowired
    private ProductsService productsService;

    @GetMapping
    public List<ProductsModel> getAllProducts() {
        return productsService.getAllProducts();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductsModel> getProductById(@PathVariable int id) {
        return productsService.getProductById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/category/{category}")
    public List<ProductsModel> getProductsByCategory(@PathVariable String category) {
        return productsService.getProductsByCategory(category);
    }

    @PostMapping
    public ProductsModel addProduct(@RequestBody ProductsModel product) {
        return productsService.saveProduct(product);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductsModel> updateProduct(@PathVariable int id, @RequestBody ProductsModel productDetails) {
        return productsService.getProductById(id)
                .map(existingProduct -> {
                    existingProduct.setProductName(productDetails.getProductName());
                    existingProduct.setCategory(productDetails.getCategory());
                    existingProduct.setBrand(productDetails.getBrand());
                    existingProduct.setPopularity(productDetails.getPopularity());
                    existingProduct.setNumberOfSales(productDetails.getNumberOfSales());
                    existingProduct.setImage(productDetails.getImage());
                    existingProduct.setAvailableColors(productDetails.getAvailableColors());
                    existingProduct.setDescription(productDetails.getDescription());
                    existingProduct.setDate(productDetails.getDate());
                    existingProduct.setPrice(productDetails.getPrice());
                    return ResponseEntity.ok(productsService.saveProduct(existingProduct));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable int id) {
        if (productsService.getProductById(id).isPresent()) {
            productsService.deleteProduct(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}

