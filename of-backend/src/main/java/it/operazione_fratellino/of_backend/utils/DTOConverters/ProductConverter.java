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
        dto.setPurchasePrice(product.getPurchasePrice());
        dto.setSellingPrice(product.getSellingPrice());
        dto.setCategory(product.getCategory() != null ? product.getCategory().getId() : null);
        dto.setStock(product.getStock());
//        dto.setIs_deleted(product.getIs_deleted());
        dto.setCreatedAt(product.getCreatedAt());
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
        product.setPurchasePrice(dto.getSellingPrice());
        product.setSellingPrice(dto.getSellingPrice());
        product.setStock(dto.getStock());
//        product.setIs_deleted(dto.getIs_deleted());
        product.setCreatedAt(dto.getCreatedAt());
        product.setImage(dto.getImage());

        return product;
    }


}