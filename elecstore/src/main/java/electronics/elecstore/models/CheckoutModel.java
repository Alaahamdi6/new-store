package electronics.elecstore.models;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;

@Entity
@Table(name = "orders")
public class CheckoutModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String firstName;
    private String secondName;
    private String address;
    private String city;
    private String country;
    private Integer postcode;
    private Long mobile;
    private String email;
    
    @Column(columnDefinition = "TEXT")
    private String notes;

    private String payment; 
    
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<OrderItemModel> orderItems;
    
    @Column(nullable = false)
    private LocalDateTime purchaseDate; 

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status; 

 
    public enum OrderStatus {
        ORDERED, PROCESSING, DELIVERED
    }
    
    @Column(name = "user_id")
    private Long userId;
    
    @Column(nullable = false)
    private Double totalPrice;

    // Constructors
    public CheckoutModel() {
    	this.purchaseDate = LocalDateTime.now(); 
        this.status = OrderStatus.ORDERED;
    }

    public CheckoutModel(String firstName, String secondName, String address, String city, String country,
			Integer postcode, Long mobile, String email, String notes, String payment,
			List<OrderItemModel> orderItems, LocalDateTime purchaseDate, OrderStatus status, Long userId, Double totalPrice) {
		super();
		this.firstName = firstName;
		this.secondName = secondName;
		this.address = address;
		this.city = city;
		this.country = country;
		this.postcode = postcode;
		this.mobile = mobile;
		this.email = email;
		this.notes = notes;
		this.payment = payment;
		this.orderItems = orderItems;
		this.purchaseDate = purchaseDate;
		this.status = status;
		this.userId = userId;
		this.totalPrice = totalPrice;
	}

	// Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getSecondName() { return secondName; }
    public void setSecondName(String secondName) { this.secondName = secondName; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public Integer getPostcode() { return postcode; }
    public void setPostcode(Integer postcode) { this.postcode = postcode; }

    public Long getMobile() { return mobile; }
    public void setMobile(Long mobile) { this.mobile = mobile; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public String getPayment() { return payment; }
    public void setPayment(String payment) { this.payment = payment; }
    
    public LocalDateTime getPurchaseDate() { return purchaseDate; }
    public void setPurchaseDate(LocalDateTime purchaseDate) { this.purchaseDate = purchaseDate; }

    public OrderStatus getStatus() { return status; }
    public void setStatus(OrderStatus status) { this.status = status; }

	public List<OrderItemModel> getOrderItems() { return orderItems; }
	public void setOrderItems(List<OrderItemModel> orderItems) { this.orderItems = orderItems; }
	
	public Long getUserId() { return userId; }
	public void setUserId(Long userId) { this.userId = userId; }
	 
	public Double getTotalPrice() { return totalPrice; }
	public void setTotalPrice(Double totalPrice) { this.totalPrice = totalPrice; }
    
    
}

