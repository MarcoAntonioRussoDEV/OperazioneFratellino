package it.operazione_fratellino.of_backend.DTOs;

import it.operazione_fratellino.of_backend.entities.ProductCart;
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
public class CartDTO {

    private Integer id;
    private Integer user;
    private Integer client;
    private Double totalPrice;
    private Date createdAt;
    private Date updatedAt;
    private List<ProductCartDTO> products;
}
