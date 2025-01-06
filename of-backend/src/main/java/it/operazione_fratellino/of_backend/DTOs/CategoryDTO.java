package it.operazione_fratellino.of_backend.DTOs;


import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class CategoryDTO {
    private Integer id;
    private String code;
    private String name;
    private Integer lastCode;
    private List<ProductDTO> products;

}
