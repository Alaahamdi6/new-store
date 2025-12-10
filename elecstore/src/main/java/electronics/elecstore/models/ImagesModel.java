package electronics.elecstore.models;

import jakarta.persistence.*;

@Entity
@Table(name = "images")
public class ImagesModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private ProductsModel product;

    @Column(nullable = false)
    private String name;

    // Constructors
    public ImagesModel() {}

    public ImagesModel(ProductsModel product, String name) {
        this.product = product;
        this.name = name;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ProductsModel getProduct() {
        return product;
    }

    public void setProduct(ProductsModel product) {
        this.product = product;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
