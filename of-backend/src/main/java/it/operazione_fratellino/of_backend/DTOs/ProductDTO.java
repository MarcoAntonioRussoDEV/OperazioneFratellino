package it.operazione_fratellino.of_backend.DTOs;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Timestamp;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProductDTO {
    private Integer id;
    private String code;
    private String name;
    private String description;
    private Double purchase_price;
    private Double selling_price;
    private Integer category;
    private Integer stock;
    private List<ProductAttributesDTO> attributes;
//    private Boolean is_deleted;
    private Date created_at;
    private String image;

}
