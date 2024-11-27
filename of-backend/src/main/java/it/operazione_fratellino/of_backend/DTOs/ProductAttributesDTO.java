package it.operazione_fratellino.of_backend.DTOs;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProductAttributesDTO {
    private Integer id;
    private String productCode;
    private String attributeName;
    private String value;


//    public ProductAttributesDTO(String attribute, String value, String productCode) {
//        this.value = value;
//        this.productCode = productCode;
//        this.attribute = attribute;
//    }
}
