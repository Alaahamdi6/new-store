package electronics.elecstore.controllers;

import electronics.elecstore.models.*;
import electronics.elecstore.repositories.CartItemRepository;
import electronics.elecstore.repositories.CartsRepository;
import electronics.elecstore.repositories.OrderItemRepository;
import electronics.elecstore.services.CheckoutService;
import electronics.elecstore.security.JwtTokenUtil;
import electronics.elecstore.security.CustomUserDetailsService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(CheckoutController.class)
@AutoConfigureMockMvc(addFilters = false)
class CheckoutControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CheckoutService checkoutService;

    @MockBean
    private CartsRepository cartsRepository;

    @MockBean
    private OrderItemRepository orderItemRepository;

    @MockBean
    private CartItemRepository cartItemRepository;

    @MockBean
    private JwtTokenUtil jwtTokenUtil;

    @MockBean
    private CustomUserDetailsService customUserDetailsService;

    private CheckoutModel checkout1;
    private CheckoutModel checkout2;
    private CartsModel cart;
    private ProductsModel product;

    @BeforeEach
    void setUp() {
        checkout1 = new CheckoutModel();
        checkout1.setId(1L);
        checkout1.setUserId(100L);
        checkout1.setAddress("123 Main St");
        checkout1.setCity("New York");

        checkout2 = new CheckoutModel();
        checkout2.setId(2L);
        checkout2.setUserId(101L);
        checkout2.setAddress("456 Oak Ave");
        checkout2.setCity("Los Angeles");

        product = new ProductsModel();
        product.setId(1);
        product.setProductName("Laptop");
        product.setPrice(1200.0);

        CartItemModel cartItem = new CartItemModel();
        cartItem.setId(1L);
        cartItem.setProduct(product);
        cartItem.setQuantity(2);

        cart = new CartsModel();
        cart.setId(1L);
        cart.setUserId(100L);
        cart.setCartItems(Arrays.asList(cartItem));
    }

    @Test
    void testGetAllCheckouts() throws Exception {
        List<CheckoutModel> checkouts = Arrays.asList(checkout1, checkout2);
        when(checkoutService.getAllCheckouts()).thenReturn(checkouts);

        mockMvc.perform(get("/api/checkouts"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
            .andExpect(jsonPath("$[0].id").value(1))
            .andExpect(jsonPath("$[1].id").value(2));

        verify(checkoutService, times(1)).getAllCheckouts();
    }

    @Test
    void testGetCheckoutById_Found() throws Exception {
        when(checkoutService.getCheckoutById(1L)).thenReturn(Optional.of(checkout1));

        mockMvc.perform(get("/api/checkouts/1"))
                .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.address").value("123 Main St"));

        verify(checkoutService, times(1)).getCheckoutById(1L);
    }

    @Test
    void testGetCheckoutById_NotFound() throws Exception {
        when(checkoutService.getCheckoutById(999L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/checkouts/999"))
                .andExpect(status().isOk())
                .andExpect(content().string("null"));

        verify(checkoutService, times(1)).getCheckoutById(999L);
    }

    @Test
    void testCreateCheckout_Success() throws Exception {
        when(cartsRepository.findById(1L)).thenReturn(Optional.of(cart));
        when(checkoutService.createCheckout(any(CheckoutModel.class))).thenReturn(checkout1);
        when(orderItemRepository.saveAll(any())).thenReturn(new ArrayList<>());
        doNothing().when(cartItemRepository).deleteByCartId(1L);
        doNothing().when(cartsRepository).deleteById(1L);

        String checkoutJson = "{\"address\":\"123 Main St\",\"city\":\"New York\"}";

        mockMvc.perform(post("/api/checkouts/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(checkoutJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.userId").value(100));

        verify(cartsRepository, times(1)).findById(1L);
        verify(checkoutService, times(1)).createCheckout(any(CheckoutModel.class));
        verify(orderItemRepository, times(1)).saveAll(any());
        verify(cartItemRepository, times(1)).deleteByCartId(1L);
        verify(cartsRepository, times(1)).deleteById(1L);
    }

    @Test
    void testDeleteCheckout() throws Exception {
        doNothing().when(checkoutService).deleteCheckout(1L);

        mockMvc.perform(delete("/api/checkouts/1"))
                .andExpect(status().isOk());

        verify(checkoutService, times(1)).deleteCheckout(1L);
    }

    @Test
    void testGetAllCheckouts_EmptyList() throws Exception {
        when(checkoutService.getAllCheckouts()).thenReturn(new ArrayList<>());

        mockMvc.perform(get("/api/checkouts"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));
    }
}
