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
    private Double purchasePrice;
    private Double sellingPrice;
    private Integer category;
    private Integer stock;
    private Integer reservedPreorders;
    private List<ProductAttributesDTO> attributes;
    private List<ProductCartDTO> carts;
    private Boolean isDeleted;
    private Date createdAt;
    private byte[] image;

}
