package it.operazione_fratellino.of_backend.services.implement;

import it.operazione_fratellino.of_backend.components.ExceptionHandlerService;
import it.operazione_fratellino.of_backend.entities.Attribute;
import it.operazione_fratellino.of_backend.entities.Product;
import it.operazione_fratellino.of_backend.entities.ProductAttributes;
import it.operazione_fratellino.of_backend.repositories.AttributeRepository;
import it.operazione_fratellino.of_backend.repositories.ProductAttributesRepository;
import it.operazione_fratellino.of_backend.services.LogService;
import it.operazione_fratellino.of_backend.services.ProductAttributesService;
import it.operazione_fratellino.of_backend.utils.LogUtils;
import it.operazione_fratellino.of_backend.utils.SeverityEnum;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
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
    @Autowired
    private LogService logService;

    @Override
    public List<ProductAttributes> findAll() {
        return productAttributesRepository.findAll();
    }

    @Override
    public Page<ProductAttributes> findAll(PageRequest pageRequest) {
        try {
             return productAttributesRepository.findAll(pageRequest);
        } catch (Exception e) {
            LogUtils.log("Errore durante il recupero del product_attributes paginato: " + e.getMessage(), SeverityEnum.ERROR, logService, "ProductAttributesServiceImpl");
            throw new RuntimeException("Errore durante il recupero del product_attributes paginato", e);
        }
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
    public List<ProductAttributes> findByProduct(Product product) {
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
