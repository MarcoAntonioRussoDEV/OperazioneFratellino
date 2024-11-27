package it.operazione_fratellino.of_backend.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "sells")
public class Sell {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "product_code", referencedColumnName = "code")
    private Product product;

    @NotNull
    private Integer quantity;

    @NotNull
    private Double total_price;

    @NotNull
    private Date created_at;

    @PrePersist
    private void defaultsValues(){
        this.total_price = product.getSelling_price() * this.quantity;
        this.created_at = new Date();
    }
}


