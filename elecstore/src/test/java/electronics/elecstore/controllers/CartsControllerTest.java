package electronics.elecstore.controllers;

import electronics.elecstore.models.CartItemModel;
import electronics.elecstore.models.CartsModel;
import electronics.elecstore.services.CartItemService;
import electronics.elecstore.services.CartsService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.Matchers.*;

class CartsControllerTest {

    private MockMvc mockMvc;

    @Mock
    private CartsService cartService;

    @Mock
    private CartItemService cartItemService;

    @InjectMocks
    private CartsController controller;

    private CartsModel cart;
    private CartItemModel cartItem;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();

        cart = new CartsModel();
        cart.setId(1L);
        cart.setUserId(100L);

        cartItem = new CartItemModel();
        cartItem.setId(1L);
        cartItem.setQuantity(2);
    }

    @Test
    void testGetCart() throws Exception {
        when(cartService.getCartByUserId(100L)).thenReturn(cart);

        mockMvc.perform(get("/api/cart/100"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userId", is(100)));

        verify(cartService, times(1)).getCartByUserId(100L);
    }

    @Test
    void testGetCartItems() throws Exception {
        List<CartItemModel> items = Arrays.asList(cartItem);
        when(cartService.getCartItemsByUserId(100L)).thenReturn(items);

        mockMvc.perform(get("/api/cart/items/100"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].quantity", is(2)));

        verify(cartService, times(1)).getCartItemsByUserId(100L);
    }

    @Test
    void testAddItemToCart() throws Exception {
        when(cartService.addItemToCart(100L, 1, 2)).thenReturn(cartItem);

        mockMvc.perform(post("/api/cart/add")
                .param("userId", "100")
                .param("productId", "1")
                .param("quantity", "2"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.quantity", is(2)));

        verify(cartService, times(1)).addItemToCart(100L, 1, 2);
    }

    @Test
    void testUpdateCartItemQuantity() throws Exception {
        CartItemModel updated = new CartItemModel();
        updated.setQuantity(5);
        
        when(cartService.updateCartItemQuantity(1L, 1, 5)).thenReturn(updated);

        mockMvc.perform(put("/api/cart/update")
                .param("cartId", "1")
                .param("productId", "1")
                .param("newQuantity", "5"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.quantity", is(5)));

        verify(cartService, times(1)).updateCartItemQuantity(1L, 1, 5);
    }
}
