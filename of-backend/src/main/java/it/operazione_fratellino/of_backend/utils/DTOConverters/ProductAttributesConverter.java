package it.operazione_fratellino.of_backend.utils.DTOConverters;

import it.operazione_fratellino.of_backend.DTOs.ProductAttributesDTO;
import it.operazione_fratellino.of_backend.DTOs.ProductDTO;
import it.operazione_fratellino.of_backend.DTOs.RequestProductAttributesDTO;
import it.operazione_fratellino.of_backend.DTOs.RequestProductDTO;
import it.operazione_fratellino.of_backend.entities.Attribute;
import it.operazione_fratellino.of_backend.entities.Product;
import it.operazione_fratellino.of_backend.entities.ProductAttributes;
import it.operazione_fratellino.of_backend.services.AttributeService;
import it.operazione_fratellino.of_backend.services.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Component
public class ProductAttributesConverter {


    @Autowired
    private AttributeService attributeService;
    @Autowired
    private ProductService productService;

    public ProductAttributesDTO toDTO(ProductAttributes productAttributes){
        if (productAttributes == null) {
            return null;
        }

        ProductAttributesDTO dto = new ProductAttributesDTO(
                productAttributes.getId(),
                productAttributes.getProduct().getId(),
                productAttributes.getAttribute().getName(),
                productAttributes.getValue());
        return dto;
    }

    public ProductAttributes toEntity(ProductAttributesDTO dto){

        if (dto == null) {
            return null;
        }

        ProductAttributes productAttributes = new ProductAttributes();

        productAttributes.setId(dto.getId());
        Product product = new Product();
        product.setCode(productService.findById(dto.getProduct()).getCode());
        productAttributes.setProduct(product);
        Attribute attribute = new Attribute(dto.getName());
        productAttributes.setAttribute(attribute);
        productAttributes.setValue(dto.getValue());
        return productAttributes;
    }

//    public ProductAttributes toEntityNoProduct(ProductAttributesDTO dto){
//        ProductAttributes productAttributes = new ProductAttributes(dto.getId(),attributeService.findByName(dto.getAttribute()),dto.getValue());
//        return productAttributes;
//    }
//
//
//    public List<ProductAttributesDTO> toDTOfromRequest(RequestProductDTO requestProductDTO, ProductDTO productDTO){
//        List<ProductAttributesDTO> productAttributesDTOList = new ArrayList<>();
//
//        for(RequestProductAttributesDTO attribute : requestProductDTO.getExistingProductAttributes()){
//                productAttributesDTOList.add(this.toDTOfromRequestDTO(attribute, productDTO.getCode()));
//        };
//
//        return productAttributesDTOList;
//    }
//
//    public ProductAttributesDTO toDTOfromRequestDTO(RequestProductAttributesDTO requestProductAttributesDTO, String productCode){
//        ProductAttributesDTO productAttributesDTO = new ProductAttributesDTO(requestProductAttributesDTO.getAttributeName(), requestProductAttributesDTO.getAttributeValue(),productCode);
//        return productAttributesDTO;
//    }
}
