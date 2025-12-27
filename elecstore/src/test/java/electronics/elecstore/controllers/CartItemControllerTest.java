package electronics.elecstore.controllers;

import electronics.elecstore.models.CartItemModel;
import electronics.elecstore.services.CartItemService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class CartItemControllerTest {
    private MockMvc mockMvc;

    @Mock
    private CartItemService cartItemService;

    @InjectMocks
    private CartItemController controller;

    private CartItemModel item;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
        item = new CartItemModel();
        item.setId(10L);
        item.setQuantity(2);
    }

    @Test
    void addCartItem_returns_ok() throws Exception {
        when(cartItemService.addCartItem(any(CartItemModel.class))).thenReturn(item);

        mockMvc.perform(post("/api/cart-items")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"quantity\":2}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(10)));

        verify(cartItemService).addCartItem(any(CartItemModel.class));
    }

    @Test
    void getAllCartItems_returns_list() throws Exception {
        List<CartItemModel> list = Arrays.asList(item);
        when(cartItemService.getAllCartItems()).thenReturn(list);

        mockMvc.perform(get("/api/cart-items"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)));
    }

    @Test
    void getCartItemById_found() throws Exception {
        when(cartItemService.getCartItemById(10L)).thenReturn(Optional.of(item));

        mockMvc.perform(get("/api/cart-items/10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(10)));
    }

    @Test
    void getCartItemById_not_found() throws Exception {
        when(cartItemService.getCartItemById(99L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/cart-items/99"))
                .andExpect(status().isNotFound());
    }

    @Test
    void deleteCartItem_no_content() throws Exception {
        doNothing().when(cartItemService).deleteCartItem(10L);

        mockMvc.perform(delete("/api/cart-items/10"))
                .andExpect(status().isNoContent());

        verify(cartItemService).deleteCartItem(10L);
    }
}
