package it.operazione_fratellino.of_backend.services;

import it.operazione_fratellino.of_backend.entities.Attribute;
import it.operazione_fratellino.of_backend.entities.Product;
import it.operazione_fratellino.of_backend.entities.ProductAttributes;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface ProductAttributesService {
    List<ProductAttributes> getAll();
    ProductAttributes findByAttribute(Attribute attribute);
    ProductAttributes findByAttributeName(String attributeName);
    ProductAttributes findByProduct(Product product);
    ResponseEntity<String> save(ProductAttributes productAttributes);
    ProductAttributes saveAndGet(ProductAttributes productAttributes);
}
