package it.operazione_fratellino.of_backend.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Timestamp;
import java.util.Date;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "products")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Product {

    // Columns
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotBlank(message = "Il campo non può essere vuoto")
    @Column(unique = true)
    @Size(min = 7, max = 7)
    private String code;

    @NotBlank(message = "Il campo non può essere vuoto")
    @Column(unique = true)
    private String name;

    private String description;

    @NotNull(message = "il campo non può essere vuoto")
    @Column(name = "purchase_price")
    private Double purchasePrice;

    @NotNull(message = "il campo non può essere vuoto")
    @Column(name = "selling_price")
    private Double sellingPrice;

    private Boolean isDeleted;

    @ManyToOne
    @JoinColumn(name = "category_id", referencedColumnName = "id")
    @JsonBackReference
    private Category category;

    private Integer stock;

    @Column(name = "reserved_preorders")
    @NotNull
    private Integer reservedPreorders;

    @OneToMany(mappedBy = "product", fetch = FetchType.LAZY, orphanRemoval = true)
    private List<ProductAttributes> productAttributes;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "product", orphanRemoval = true)
    private List<ProductCart> productCarts;

    @Column(name = "created_at")
    private Date createdAt;

    private byte[] image;

    @ManyToMany(mappedBy = "product")
    private List<ProductSale> productSale;

    @OneToMany(mappedBy = "product")
    private List<ProductPreorder> productPreorders;

    @PrePersist
    private void defaultsValues() {
        this.isDeleted = false;
    }

    public void calcReservedPreorders() {
        int totalReserved = this.productPreorders.stream().filter(productPreorder -> {
            String status = productPreorder.getPreorder().getStatus().getValue();
            return Objects.equals(status, "PENDING") || Objects.equals(status, "READY");
        }).mapToInt(ProductPreorder::getQuantity).sum();
        this.setReservedPreorders(totalReserved);
    }
}

