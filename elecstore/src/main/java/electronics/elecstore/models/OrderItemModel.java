package electronics.elecstore.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "order_items")
public class OrderItemModel {  

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;  // Order item ID

    @ManyToOne
    @JoinColumn(name = "order_id", referencedColumnName = "id")
    private CheckoutModel order;  // Reference to the order

    @ManyToOne
    @JoinColumn(name = "product_id", referencedColumnName = "id")
    private ProductsModel product;  

    private int quantity;
    private double price;

    public OrderItemModel() {}

    public OrderItemModel(CheckoutModel order, ProductsModel product, int quantity, double price) {
        this.order = order;
        this.product = product;
        this.quantity = quantity;
        this.price = price;
    }

	public Long getId() {
		return id;
	}

	public CheckoutModel getOrder() {
		return order;
	}

	public void setOrder(CheckoutModel order) {
		this.order = order;
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

	public double getPrice() {
		return price;
	}

	public void setPrice(double price) {
		this.price = price;
	}
    
    
    
}

