package electronics.elecstore.models;

import jakarta.persistence.*;
import java.util.Date;
import java.util.Objects;

@Entity
@Table(name = "products")
public class ProductsModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "product_name", nullable = false)
    private String productName;

    @Column(name = "category", nullable = false)
    private String category;

    @Column(name = "brand", nullable = false)
    private String brand;

    @Column(name = "popularity")
    private int popularity;

    @Column(name = "number_of_sales")
    private int numberOfSales;

    @Column(name = "image")
    private String image;

    @Column(name = "available_colors")
    private String availableColors;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "date")
    @Temporal(TemporalType.DATE)
    private Date date;

    @Column(name = "price")
    private double price;

    public ProductsModel() {
		super();
	}
    
	public ProductsModel(String productName, String category, String brand, int popularity, int numberOfSales,
			String image, String availableColors, String description, Date date, double price) {
		super();
		this.productName = productName;
		this.category = category;
		this.brand = brand;
		this.popularity = popularity;
		this.numberOfSales = numberOfSales;
		this.image = image;
		this.availableColors = availableColors;
		this.description = description;
		this.date = date;
		this.price = price;
	}

	public ProductsModel(int id, String productName, String category, String brand, int popularity, int numberOfSales,
			String image, String availableColors, String description, Date date, double d) {
		super();
		this.id = id;
		this.productName = productName;
		this.category = category;
		this.brand = brand;
		this.popularity = popularity;
		this.numberOfSales = numberOfSales;
		this.image = image;
		this.availableColors = availableColors;
		this.description = description;
		this.date = date;
		this.price = d;
	}

	// Getters and Setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }
    public int getPopularity() { return popularity; }
    public void setPopularity(int popularity) { this.popularity = popularity; }
    public int getNumberOfSales() { return numberOfSales; }
    public void setNumberOfSales(int numberOfSales) { this.numberOfSales = numberOfSales; }
    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }
    public String getAvailableColors() { return availableColors; }
    public void setAvailableColors(String availableColors) { this.availableColors = availableColors; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Date getDate() { return date; }
    public void setDate(Date date) { this.date = date; }
    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ProductsModel that = (ProductsModel) o;
        return Objects.equals(id, that.id); // Compare by product ID
    }

    @Override
    public int hashCode() {
        return Objects.hash(id); // Use product ID for hashing
    }
}

