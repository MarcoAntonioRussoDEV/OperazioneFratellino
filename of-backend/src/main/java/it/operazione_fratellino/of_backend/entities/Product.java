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

@Entity
@Table(name = "products")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Product {

    // Columns
    @Id
    @GeneratedValue( strategy = GenerationType.IDENTITY)
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
    private Double purchase_price;

    @NotNull(message = "il campo non può essere vuoto")
    private Double selling_price;

    private Boolean is_deleted;

    @ManyToOne
    @JoinColumn(name = "category_id", referencedColumnName = "id")
    @JsonBackReference
    private Category category;

    private Integer stock;

    @OneToMany(mappedBy = "product", fetch = FetchType.LAZY)
    private List<ProductAttributes> productAttributes;

    @OneToMany(mappedBy = "id", fetch = FetchType.LAZY)
    private List<Sell> sells;

    private Date created_at;

    private String image;

    @PrePersist
    private void defaultsValues(){
        this.stock = 1;
        this.is_deleted = false;
    }


}
