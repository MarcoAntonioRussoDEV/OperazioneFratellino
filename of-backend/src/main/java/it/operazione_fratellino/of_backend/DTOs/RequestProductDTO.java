package it.operazione_fratellino.of_backend.DTOs;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.util.Date;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RequestProductDTO {
    private String code;
    private String name;
    private String description;
    private Double purchasePrice;
    private Double sellingPrice;
    private String category;
    private Integer stock;
    private List<RequestProductAttributesDTO> newProductAttributes;
    private List<RequestProductAttributesDTO> existingProductAttributes;
    private Date createdAt;
//    private MultipartFile image;
}
