package it.operazione_fratellino.of_backend.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "product_preorder")
@AllArgsConstructor
@NoArgsConstructor
public class ProductPreorder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "product_id", referencedColumnName = "id")
    @JsonBackReference
    private Product product;

    @ManyToOne
    @JoinColumn(name = "preorder_id", referencedColumnName = "id")
    private Preorder preorder;

    @NotNull
    private Integer quantity;

    public void decreaseProductReservation(){
        this.product.setReservedPreorders(this.product.getReservedPreorders() - this.getQuantity());
    }

}