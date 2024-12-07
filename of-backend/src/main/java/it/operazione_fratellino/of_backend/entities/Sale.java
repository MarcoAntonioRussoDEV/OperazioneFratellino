package it.operazione_fratellino.of_backend.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "sales")
public class Sale {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;


    private Double total_price;

    private Double profit;

    private Date createdAt;

    @OneToMany(mappedBy = "sale", cascade = CascadeType.ALL)
    private List<ProductSale> productSale;


    @PrePersist
    private void defaultsValues(){
        this.createdAt = new Date();
    }
}


