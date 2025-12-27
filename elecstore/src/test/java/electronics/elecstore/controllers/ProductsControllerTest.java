package electronics.elecstore.controllers;

import electronics.elecstore.models.ProductsModel;
import electronics.elecstore.services.ProductsService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.Matchers.*;

class ProductsControllerTest {

    private MockMvc mockMvc;

    @Mock
    private ProductsService productsService;

    @InjectMocks
    private ProductsController controller;

    private ProductsModel product1;
    private ProductsModel product2;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();

        product1 = new ProductsModel();
        product1.setId(1);
        product1.setProductName("Laptop");
        product1.setCategory("Electronics");
        product1.setPrice(1200);

        product2 = new ProductsModel();
        product2.setId(2);
        product2.setProductName("Phone");
        product2.setCategory("Electronics");
        product2.setPrice(800);
    }

    @Test
    void testGetAllProducts() throws Exception {
        List<ProductsModel> products = Arrays.asList(product1, product2);
        when(productsService.getAllProducts()).thenReturn(products);

        mockMvc.perform(get("/api/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].productName", is("Laptop")))
                .andExpect(jsonPath("$[1].productName", is("Phone")));

        verify(productsService, times(1)).getAllProducts();
    }

    @Test
    void testGetProductById_Success() throws Exception {
        when(productsService.getProductById(1)).thenReturn(Optional.of(product1));

        mockMvc.perform(get("/api/products/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.productName", is("Laptop")))
                .andExpect(jsonPath("$.price", is(1200.0)));

        verify(productsService, times(1)).getProductById(1);
    }

    @Test
    void testGetProductById_NotFound() throws Exception {
        when(productsService.getProductById(999)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/products/999"))
                .andExpect(status().isNotFound());

        verify(productsService, times(1)).getProductById(999);
    }

    @Test
    void testGetProductsByCategory() throws Exception {
        List<ProductsModel> products = Arrays.asList(product1, product2);
        when(productsService.getProductsByCategory("Electronics")).thenReturn(products);

        mockMvc.perform(get("/api/products/category/Electronics"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)));

        verify(productsService, times(1)).getProductsByCategory("Electronics");
    }

    @Test
    void testAddProduct() throws Exception {
        when(productsService.saveProduct(any(ProductsModel.class))).thenReturn(product1);

        mockMvc.perform(post("/api/products")
                .contentType("application/json")
                .content("{\"productName\":\"Laptop\",\"category\":\"Electronics\",\"price\":1200}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.productName", is("Laptop")));

        verify(productsService, times(1)).saveProduct(any(ProductsModel.class));
    }

    @Test
    void testUpdateProduct_Success() throws Exception {
        when(productsService.getProductById(1)).thenReturn(Optional.of(product1));
        when(productsService.saveProduct(any(ProductsModel.class))).thenReturn(product1);

        mockMvc.perform(put("/api/products/1")
                .contentType("application/json")
                .content("{\"productName\":\"Laptop Pro\",\"price\":1500}"))
                .andExpect(status().isOk());

        verify(productsService, times(1)).getProductById(1);
        verify(productsService, times(1)).saveProduct(any(ProductsModel.class));
    }

    @Test
    void testUpdateProduct_NotFound() throws Exception {
        when(productsService.getProductById(999)).thenReturn(Optional.empty());

        mockMvc.perform(put("/api/products/999")
                .contentType("application/json")
                .content("{\"productName\":\"Unknown\"}"))
                .andExpect(status().isNotFound());

        verify(productsService, times(1)).getProductById(999);
    }

    @Test
    void testDeleteProduct_Success() throws Exception {
        when(productsService.getProductById(1)).thenReturn(Optional.of(product1));
        doNothing().when(productsService).deleteProduct(1);

        mockMvc.perform(delete("/api/products/1"))
                .andExpect(status().isNoContent());

        verify(productsService, times(1)).getProductById(1);
        verify(productsService, times(1)).deleteProduct(1);
    }

    @Test
    void testDeleteProduct_NotFound() throws Exception {
        when(productsService.getProductById(999)).thenReturn(Optional.empty());

        mockMvc.perform(delete("/api/products/999"))
                .andExpect(status().isNotFound());

        verify(productsService, times(1)).getProductById(999);
    }
}
