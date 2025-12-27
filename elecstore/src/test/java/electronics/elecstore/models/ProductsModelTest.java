package electronics.elecstore.models;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class ProductsModelTest {

    @Test
    void testProductsModelConstructor() {
        ProductsModel product = new ProductsModel(
            1, "Laptop", "Electronics", "Dell", 
            5, 10, "image.jpg", "Black,White", 
            "High performance laptop", null, 1200.00
        );

        assertEquals(1, product.getId());
        assertEquals("Laptop", product.getProductName());
        assertEquals("Electronics", product.getCategory());
        assertEquals("Dell", product.getBrand());
        assertEquals(5, product.getPopularity());
        assertEquals(10, product.getNumberOfSales());
        assertEquals("image.jpg", product.getImage());
        assertEquals("Black,White", product.getAvailableColors());
        assertEquals("High performance laptop", product.getDescription());
        assertEquals(1200.00, product.getPrice());
    }

    @Test
    void testProductsModelSetters() {
        ProductsModel product = new ProductsModel();
        
        product.setId(2);
        product.setProductName("Phone");
        product.setCategory("Mobile");
        product.setBrand("Samsung");
        product.setPopularity(8);
        product.setNumberOfSales(20);
        product.setImage("phone.jpg");
        product.setAvailableColors("Blue,Red");
        product.setDescription("Great phone");
        product.setPrice(800.00);

        assertEquals(2, product.getId());
        assertEquals("Phone", product.getProductName());
        assertEquals("Mobile", product.getCategory());
        assertEquals("Samsung", product.getBrand());
        assertEquals(8, product.getPopularity());
        assertEquals(20, product.getNumberOfSales());
        assertEquals("phone.jpg", product.getImage());
        assertEquals("Blue,Red", product.getAvailableColors());
        assertEquals("Great phone", product.getDescription());
        assertEquals(800.00, product.getPrice());
    }

    @Test
    void testProductsModelDefaultConstructor() {
        ProductsModel product = new ProductsModel();
        assertNotNull(product);
    }
}
