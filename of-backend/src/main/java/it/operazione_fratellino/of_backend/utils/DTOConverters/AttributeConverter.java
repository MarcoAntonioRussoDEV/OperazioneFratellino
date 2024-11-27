package it.operazione_fratellino.of_backend.utils.DTOConverters;

import it.operazione_fratellino.of_backend.DTOs.AttributeDTO;
import it.operazione_fratellino.of_backend.DTOs.ProductCode;
import it.operazione_fratellino.of_backend.entities.Attribute;
import it.operazione_fratellino.of_backend.entities.Product;
import it.operazione_fratellino.of_backend.entities.ProductAttributes;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class AttributeConverter {

    @Autowired
    ProductAttributesConverter productAttributesConverter;
    @Autowired
    ProductConverter productConverter;

    public AttributeDTO toDTO(Attribute attribute) {
        if (attribute == null) {
            return null;
        }
        AttributeDTO dto = new AttributeDTO();
            dto.setId(attribute.getId());
            dto.setName(attribute.getName());

            List<ProductCode> productCodes = new ArrayList<>();
            for(ProductAttributes productAttributes : attribute.getProductAttributes()){
                    String code = productAttributes.getProduct().getCode();
                    productCodes.add(new ProductCode(code));
                }
            dto.setProducts(productCodes);
        return dto;
    }


    public Attribute toEntity(AttributeDTO dto) {
        Attribute attribute = new Attribute(dto.getId(), dto.getName());

        return attribute;
    }

}
