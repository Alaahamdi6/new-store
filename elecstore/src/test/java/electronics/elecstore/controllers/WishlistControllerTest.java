package electronics.elecstore.controllers;

import electronics.elecstore.models.WishlistModel;
import electronics.elecstore.services.WishlistService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Optional;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class WishlistControllerTest {

    private MockMvc mockMvc;

    @Mock
    private WishlistService wishlistService;

    @InjectMocks
    private WishlistController controller;

    private WishlistModel wishlist;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();

        wishlist = new WishlistModel();
        wishlist.setId(1);
    }

    @Test
    void testGetWishlist_Success() throws Exception {
        when(wishlistService.getWishlistByUser(100)).thenReturn(Optional.of(wishlist));

        mockMvc.perform(get("/api/wishlist/100"))
                .andExpect(status().isOk());

        verify(wishlistService, times(1)).getWishlistByUser(100);
    }

    @Test
    void testGetWishlist_NotFound() throws Exception {
        when(wishlistService.getWishlistByUser(999)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/wishlist/999"))
                .andExpect(status().isOk());

        verify(wishlistService, times(1)).getWishlistByUser(999);
    }

    @Test
    void testAddProduct() throws Exception {
        when(wishlistService.addProductToWishlist(100, 1)).thenReturn(wishlist);

        mockMvc.perform(post("/api/wishlist/add")
                .contentType("application/json")
                .content("{\"userId\":100,\"productId\":1}"))
                .andExpect(status().isOk());

        verify(wishlistService, times(1)).addProductToWishlist(100, 1);
    }

    @Test
    void testRemoveProduct() throws Exception {
        doNothing().when(wishlistService).removeProductFromWishlist(100, 1);

        mockMvc.perform(delete("/api/wishlist/remove")
                .param("userId", "100")
                .param("productId", "1"))
                .andExpect(status().isOk());

        verify(wishlistService, times(1)).removeProductFromWishlist(100, 1);
    }
}
