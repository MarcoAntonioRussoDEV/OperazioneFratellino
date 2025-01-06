package it.operazione_fratellino.of_backend.DTOs;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ProductPreorderDTO {

    private Integer id;
//    private String productCode;
    private String product;
    private Integer preorderId;
    private Integer quantity;

}
