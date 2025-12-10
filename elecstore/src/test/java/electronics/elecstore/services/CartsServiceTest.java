package electronics.elecstore.services;

import electronics.elecstore.models.CartsModel;
import electronics.elecstore.models.CartItemModel;
import electronics.elecstore.models.ProductsModel;
import electronics.elecstore.repositories.CartsRepository;
import electronics.elecstore.repositories.CartItemRepository;
import electronics.elecstore.repositories.ProductsRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class CartsServiceTest {

    @Mock
    private CartsRepository cartsRepository;

    @Mock
    private CartItemRepository cartItemRepository;

    @Mock
    private ProductsRepository productsRepository;

    @InjectMocks
    private CartsService cartsService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetCartByUserId_NewCartCreatedIfNotFound() {
        Long userId = 1L;
        when(cartsRepository.findByUserId(userId)).thenReturn(Optional.empty());
        CartsModel newCart = new CartsModel(userId);
        when(cartsRepository.save(any(CartsModel.class))).thenReturn(newCart);

        CartsModel result = cartsService.getCartByUserId(userId);

        assertNotNull(result);
        assertEquals(userId, result.getUserId());
        verify(cartsRepository, times(1)).findByUserId(userId);
        verify(cartsRepository, times(1)).save(any(CartsModel.class));
    }

    @Test
    void testGetCartItemsByUserId() {
        Long userId = 1L;
        CartsModel cart = new CartsModel(userId);
        List<CartItemModel> items = new ArrayList<>();
        cart.setCartItems(items);
        when(cartsRepository.findByUserId(userId)).thenReturn(Optional.of(cart));

        List<CartItemModel> result = cartsService.getCartItemsByUserId(userId);

        assertNotNull(result);
        assertEquals(items, result);
        verify(cartsRepository, times(1)).findByUserId(userId);
    }


    @Test
    void testAddItemToCart_ExistingItemUpdated() {
        Long userId = 1L;
        int productId = 100;
        int initialQuantity = 3;
        int addedQuantity = 2;

        CartsModel cart = new CartsModel(userId);
        ProductsModel product = new ProductsModel();
        product.setId(productId);
        CartItemModel existingItem = new CartItemModel(cart, product, initialQuantity);
        List<CartItemModel> items = new ArrayList<>();
        items.add(existingItem);
        cart.setCartItems(items);

        when(cartsRepository.findByUserId(userId)).thenReturn(Optional.of(cart));
        when(cartItemRepository.save(existingItem)).thenReturn(existingItem);

        CartItemModel result = cartsService.addItemToCart(userId, productId, addedQuantity);

        assertNotNull(result);
        assertEquals(initialQuantity + addedQuantity, result.getQuantity());
        verify(cartItemRepository, times(1)).save(existingItem);
    }

    @Test
    void testUpdateCartItemQuantity() {
        Long cartId = 1L;
        int productId = 100;
        int newQuantity = 5;

        CartItemModel cartItem = new CartItemModel();
        cartItem.setQuantity(1);
        when(cartItemRepository.findByCartIdAndProductId(cartId, productId)).thenReturn(cartItem);
        when(cartItemRepository.save(cartItem)).thenReturn(cartItem);

        CartItemModel result = cartsService.updateCartItemQuantity(cartId, productId, newQuantity);

        assertNotNull(result);
        assertEquals(newQuantity, result.getQuantity());
        verify(cartItemRepository, times(1)).findByCartIdAndProductId(cartId, productId);
        verify(cartItemRepository, times(1)).save(cartItem);
    }

    @Test
    void testClearCart() {
        Long userId = 1L;

        CartsModel cart = new CartsModel(userId);
        cart.setCartItems(new ArrayList<>());
        when(cartsRepository.findByUserId(userId)).thenReturn(Optional.of(cart));

        cartsService.clearCart(userId);

        assertTrue(cart.getCartItems().isEmpty());
        verify(cartsRepository, times(1)).save(cart);
    }
}
