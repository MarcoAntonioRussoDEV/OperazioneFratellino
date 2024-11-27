package it.operazione_fratellino.of_backend.DTOs;

import it.operazione_fratellino.of_backend.entities.Product;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.Map;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AttributeDTO {
    private Integer id;
    private String name;
    private List<ProductCode> products;
//    private List<ProductAttributesDTO> productAttributes;
//    private List<ProductDTO> products;
}

