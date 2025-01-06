package it.operazione_fratellino.of_backend.DTOs;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class RequestProductsCartDTO {

    private Integer id;
    private Integer cart;
    private Double price;
    private String product;
    private Integer quantity;

}
