package electronics.elecstore.models;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "coupons")
public class CouponsModel {
	    
	    @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long id;

	    @Column(nullable = false, unique = true)
	    private String code;

	    @ManyToMany
	    @JoinTable(
	        name = "coupon_products",
	        joinColumns = @JoinColumn(name = "coupon_id"),
	        inverseJoinColumns = @JoinColumn(name = "product_id")
	    )
	    private List<ProductsModel> products;

	    @Column(nullable = false)
	    private float percentage;
	    
	    private LocalDate expirationDate;
	    
	    // Constructors
	    public CouponsModel() {}

	    public CouponsModel(String code, List<ProductsModel> products, float percentage, LocalDate expirationDate) {
	        this.code = code;
	        this.products = products;
	        this.percentage = percentage;
	        this.expirationDate = expirationDate;
	    }

	    // Getters and Setters
	    public Long getId() { return id; }
	    public void setId(Long id) { this.id = id; }

	    public String getCode() { return code; }
	    public void setCode(String code) { this.code = code; }

	    public List<ProductsModel> getProducts() { return products; }
	    public void setProducts(List<ProductsModel> products) { this.products = products; }

	    public float getPercentage() { return percentage; }
	    public void setPercentage(float percentage) { this.percentage = percentage; }
	    
	    public LocalDate getExpirationDate() { return expirationDate; }
	    public void setExpirationDate(LocalDate expirationDate) { this.expirationDate = expirationDate; }
	


}
