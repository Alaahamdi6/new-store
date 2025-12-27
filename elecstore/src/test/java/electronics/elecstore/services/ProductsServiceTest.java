package electronics.elecstore.services;

import electronics.elecstore.models.ProductsModel;
import electronics.elecstore.repositories.ProductsRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ProductsServiceTest {

    @InjectMocks
    private ProductsService productsService;

    @Mock
    private ProductsRepository productsRepository;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }
    
    @Test
    void testGetAllProducts() {
        ProductsModel product1 = new ProductsModel(1, "Laptop", "Electronics", "Dell", 5, 10, "image1.jpg", "Black,White", "A great laptop", null, 1200.00);
        ProductsModel product2 = new ProductsModel(2, "Smartphone", "Electronics", "Samsung", 10, 20, "image2.jpg", "Blue,Red", "A great phone", null, 800.00);
        List<ProductsModel> mockProducts = Arrays.asList(product1, product2);

        when(productsRepository.findAll()).thenReturn(mockProducts);

        List<ProductsModel> result = productsService.getAllProducts();

        assertEquals(2, result.size());
        assertEquals("Laptop", result.get(0).getProductName());
        verify(productsRepository, times(1)).findAll();
    }
    
    @Test
    void testGetProductById_ExistingId() {
        ProductsModel product = new ProductsModel(1, "Laptop", "Electronics", "Dell", 5, 10, "image1.jpg", "Black,White", "A great laptop", null, 1200.00);

        when(productsRepository.findById(1)).thenReturn(Optional.of(product));

        Optional<ProductsModel> result = productsService.getProductById(1);

        assertTrue(result.isPresent());
        assertEquals("Laptop", result.get().getProductName());
        verify(productsRepository, times(1)).findById(1);
    }
    
    @Test
    void testSaveProduct() {
        ProductsModel product = new ProductsModel(1, "Laptop", "Electronics", "Dell", 5, 10, "image1.jpg", "Black,White", "A great laptop", null, 1200.00);

        when(productsRepository.save(product)).thenReturn(product);

        ProductsModel result = productsService.saveProduct(product);

        assertNotNull(result);
        assertEquals("Laptop", result.getProductName());
        verify(productsRepository, times(1)).save(product);
    }

    @Test
    void testGetProductById_NonExistingId() {
        when(productsRepository.findById(99)).thenReturn(Optional.empty());

        Optional<ProductsModel> result = productsService.getProductById(99);

        assertFalse(result.isPresent());
        verify(productsRepository, times(1)).findById(99);
    }

    @Test
    void testDeleteProduct() {
        doNothing().when(productsRepository).deleteById(1);

        productsService.deleteProduct(1);

        verify(productsRepository, times(1)).deleteById(1);
    }

    @Test
    void testGetProductsByCategory() {
        ProductsModel product1 = new ProductsModel(1, "Laptop", "Electronics", "Dell", 5, 10, "image1.jpg", "Black,White", "A great laptop", null, 1200.00);
        ProductsModel product2 = new ProductsModel(2, "Phone", "Electronics", "Samsung", 10, 20, "image2.jpg", "Blue,Red", "A great phone", null, 800.00);
        List<ProductsModel> mockProducts = Arrays.asList(product1, product2);

        when(productsRepository.findByCategory("Electronics")).thenReturn(mockProducts);

        List<ProductsModel> result = productsService.getProductsByCategory("Electronics");

        assertEquals(2, result.size());
        assertEquals("Electronics", result.get(0).getCategory());
        verify(productsRepository, times(1)).findByCategory("Electronics");
    }

    @Test
    void testGetProductsByCategory_Empty() {
        when(productsRepository.findByCategory("Unknown")).thenReturn(Arrays.asList());

        List<ProductsModel> result = productsService.getProductsByCategory("Unknown");

        assertTrue(result.isEmpty());
        verify(productsRepository, times(1)).findByCategory("Unknown");
    }

    @Test
    void testSaveProduct_UpdateExisting() {
        ProductsModel product = new ProductsModel(1, "Laptop Pro", "Electronics", "Apple", 8, 15, "image1.jpg", "Silver", "Premium laptop", null, 2000.00);

        when(productsRepository.save(product)).thenReturn(product);

        ProductsModel result = productsService.saveProduct(product);

        assertEquals("Laptop Pro", result.getProductName());
        assertEquals(2000.00, result.getPrice());
        verify(productsRepository, times(1)).save(product);
    }
}

