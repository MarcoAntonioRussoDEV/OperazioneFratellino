package it.operazione_fratellino.of_backend.utils.DTOConverters;

import it.operazione_fratellino.of_backend.DTOs.ProductAttributesDTO;
import it.operazione_fratellino.of_backend.DTOs.ProductDTO;
import it.operazione_fratellino.of_backend.DTOs.RequestProductAttributesDTO;
import it.operazione_fratellino.of_backend.DTOs.RequestProductDTO;
import it.operazione_fratellino.of_backend.entities.Attribute;
import it.operazione_fratellino.of_backend.entities.Product;
import it.operazione_fratellino.of_backend.entities.ProductAttributes;
import it.operazione_fratellino.of_backend.repositories.AttributeRepository;
import it.operazione_fratellino.of_backend.services.AttributeService;
import it.operazione_fratellino.of_backend.services.CategoryService;
import it.operazione_fratellino.of_backend.services.ProductAttributesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.security.Key;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class ProductConverter {


    @Autowired
    ProductAttributesConverter productAttributesConverter;

    public ProductDTO toDTO(Product product) {

        if (product == null) {
            return null;
        }

        ProductDTO dto = new ProductDTO();
        dto.setId(product.getId());
        dto.setCode(product.getCode());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setPurchase_price(product.getPurchase_price());
        dto.setSelling_price(product.getSelling_price());
        dto.setCategory(product.getCategory() != null ? product.getCategory().getId() : null);
        dto.setStock(product.getStock());
//        dto.setIs_deleted(product.getIs_deleted());
        dto.setCreated_at(product.getCreated_at());
        dto.setImage(product.getImage());
        dto.setAttributes(
                product.getProductAttributes().stream().map(productAttributesConverter::toDTO).toList()
        );

        return dto;
    }

    public Product toEntity(ProductDTO dto) {

        if (dto == null) {
            return null;
        }

        Product product = new Product();

        product.setId(dto.getId());
        product.setCode(dto.getCode());
        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setPurchase_price(dto.getSelling_price());
        product.setSelling_price(dto.getSelling_price());
        product.setStock(dto.getStock());
//        product.setIs_deleted(dto.getIs_deleted());
        product.setCreated_at(dto.getCreated_at());
        product.setImage(dto.getImage());

        return product;
    }

//    public ProductDTO toDTOfromRequest(RequestProductDTO request) {
//        ProductDTO productDTO = new ProductDTO();
//        productDTO.setCode( request.getCode());
//        productDTO.setName( request.getName());
//        productDTO.setDescription(request.getDescription());
//        productDTO.setPrice(request.getPrice());
//        productDTO.setCategory(categoryService.findByCode(request.getCategory()).getName());
//        productDTO.setStock( request.getStock());
//
//
//        return productDTO;
//    }


//    private  Double convertToDouble(Object value) {
//        if (value instanceof Integer) {
//            return ((Integer) value).doubleValue();
//        } else if (value instanceof Double) {
//            return (Double) value;
//        } else {
//            throw new IllegalArgumentException("Invalid type for price: " + value.getClass().getName());
//        }
//    }






//
//
//    public ProductDTO resolveRequestToAttributes(RequestProductDTO request, ProductDTO productDTO){
//        List<ProductAttributesDTO> attributes = convertExistingAttributesToList(request.getExistingProductAttributes(),productDTO);
////        attributes.putAll(convertListToMap(request.getExistingProductAttributes(), productDTO));
//        productDTO.setAttributes(attributes);
//        return productDTO;
//
//    }

//
//    @Transactional
//    private List<ProductAttributesDTO> convertExistingAttributesToList(List<RequestProductAttributesDTO> requestProductAttributes, ProductDTO productDTO){
//        List<ProductAttributesDTO> resultList = new ArrayList<>();
//        for(RequestProductAttributesDTO request : requestProductAttributes){
//            ProductAttributesDTO productAttributesDTO = new ProductAttributesDTO(request.getAttributeName(), productDTO, request.getAttributeValue());
//            productAttributesService.save(productAttributesConverter.toEntity(productAttributesDTO));
//            resultList.add(productAttributesDTO);
//        }
//        return resultList;
//    }
//
//    @Transactional
//    private Map<String,String> convertNewListToMap(List<RequestProductAttributesDTO> requestProductAttributes, ProductDTO productDTO){
//        Map<String,String> resultMap = new HashMap<>();
//        for(RequestProductAttributesDTO request : requestProductAttributes){
//            ProductAttributesDTO productAttributesDTO = new ProductAttributesDTO(request.getAttributeName(), productDTO, request.getAttributeValue());
////            ProductAttributes pa = productAttributesService.saveAndGet(productAttributesConverter.toEntity(productAttributesDTO));
////            ProductAttributesDTO paDTO = productAttributesConverter.toDTO(pa);
//            resultMap.put(productAttributesDTO.getAttribute(),productAttributesDTO.getValue());
//        }
//        return resultMap;
//    }


}