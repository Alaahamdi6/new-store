package electronics.elecstore.services;

import electronics.elecstore.models.CartItemModel;
import electronics.elecstore.repositories.CartItemRepository;
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

class CartItemServiceTest {

    @Mock
    private CartItemRepository cartItemRepository;

    @InjectMocks
    private CartItemService cartItemService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void addCartItem() {
        CartItemModel cartItem = new CartItemModel();
        when(cartItemRepository.save(cartItem)).thenReturn(cartItem);

        CartItemModel savedCartItem = cartItemService.addCartItem(cartItem);

        assertNotNull(savedCartItem);
        verify(cartItemRepository, times(1)).save(cartItem);
    }

    @Test
    void getAllCartItems() {
        List<CartItemModel> cartItems = Arrays.asList(new CartItemModel(), new CartItemModel());
        when(cartItemRepository.findAll()).thenReturn(cartItems);

        List<CartItemModel> result = cartItemService.getAllCartItems();

        assertEquals(2, result.size());
        verify(cartItemRepository, times(1)).findAll();
    }

    @Test
    void getCartItemById() {
        CartItemModel cartItem = new CartItemModel();
        when(cartItemRepository.findById(1L)).thenReturn(Optional.of(cartItem));

        Optional<CartItemModel> result = cartItemService.getCartItemById(1L);

        assertTrue(result.isPresent());
        verify(cartItemRepository, times(1)).findById(1L);
    }

    @Test
    void deleteCartItem() {
        doNothing().when(cartItemRepository).deleteById(1L);

        cartItemService.deleteCartItem(1L);

        verify(cartItemRepository, times(1)).deleteById(1L);
    }
}
