package it.operazione_fratellino.of_backend.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;
import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Table(name = "carts")
public class Cart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;


    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;



    private Double totalPrice;

    @NonNull
    private Date createdAt;

    @NonNull
    private Date updatedAt;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "cart", orphanRemoval = true)
    private List<ProductCart> productCarts;

    public void addProductCart(ProductCart productCart) {
        productCarts.add(productCart);
        productCart.setCart(this);
    }

    public void removeProductCart(ProductCart productCart) {
        productCarts.remove(productCart);
        productCart.setCart(null);
    }

    @PrePersist
    private void prePersist() {
        if (this.totalPrice == null) {
            this.totalPrice = 0D;
        }
    }


}
