package it.operazione_fratellino.of_backend.services.implement;

import it.operazione_fratellino.of_backend.components.ExceptionHandlerService;
import it.operazione_fratellino.of_backend.entities.Attribute;
import it.operazione_fratellino.of_backend.entities.Product;
import it.operazione_fratellino.of_backend.entities.ProductAttributes;
import it.operazione_fratellino.of_backend.repositories.AttributeRepository;
import it.operazione_fratellino.of_backend.repositories.ProductAttributesRepository;
import it.operazione_fratellino.of_backend.services.ProductAttributesService;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Log
@Service
public class ProductAttributesServiceImpl implements ProductAttributesService {

    @Autowired
    ProductAttributesRepository productAttributesRepository;
    @Autowired
    AttributeRepository attributeRepository;
    @Autowired
    ExceptionHandlerService exceptionHandlerService;

    @Override
    public List<ProductAttributes> getAll() {
        return productAttributesRepository.findAll();
    }

    @Override
    public ProductAttributes findByAttribute(Attribute attribute) {
        return productAttributesRepository.findByAttribute(attribute);
    }

    @Override
    public ProductAttributes findByAttributeName(String attributeName) {
        Attribute attribute =attributeRepository.findByName(attributeName).orElseThrow(()->new RuntimeException("Attribute not found"));
        return productAttributesRepository.findByAttribute(attribute);
    }

    @Override
    public ProductAttributes findByProduct(Product product) {
        return productAttributesRepository.findByProduct(product);
    }

    @Override
    public ResponseEntity<String> save(ProductAttributes productAttributes) {
        try {
            productAttributesRepository.save(productAttributes);
            log.info("LOG: Creata categoria: " + productAttributes.getAttribute().getName());
            return new ResponseEntity<String>("Categoria salvata con successo", HttpStatus.CREATED);
        }catch(Exception e){
            log.info("LOG: Errore creazione categoria: " + productAttributes.getAttribute().getName());
            return exceptionHandlerService.handleException( e, productAttributes.getAttribute().getName());
        }
    }

    @Override
    public ProductAttributes saveAndGet(ProductAttributes productAttributes) {
        ProductAttributes pa = productAttributesRepository.save(productAttributes);
        return pa;
    }
}
