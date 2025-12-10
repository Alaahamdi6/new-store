package electronics.elecstore.models;

import jakarta.persistence.*;

@Entity
@Table(name = "cart_items")
public class CartItemModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "cart_id", nullable = false)
    private CartsModel cart;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private ProductsModel product;

    @Column(nullable = false)
    private int quantity;

    // Constructors
    public CartItemModel() {}

    public CartItemModel(CartsModel cart, ProductsModel product, int quantity) {
        this.cart = cart;
        this.product = product;
        this.quantity = quantity;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public CartsModel getCart() {
        return cart;
    }

    public void setCart(CartsModel cart) {
        this.cart = cart;
    }

    public ProductsModel getProduct() {
        return product;
    }

    public void setProduct(ProductsModel product) {
        this.product = product;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
}
