package it.operazione_fratellino.of_backend.services.implement;

import it.operazione_fratellino.of_backend.DTOs.RequestProductAttributesDTO;
import it.operazione_fratellino.of_backend.DTOs.RequestProductDTO;
import it.operazione_fratellino.of_backend.components.ExceptionHandlerService;
import it.operazione_fratellino.of_backend.entities.Attribute;
import it.operazione_fratellino.of_backend.entities.Product;
import it.operazione_fratellino.of_backend.entities.ProductAttributes;
import it.operazione_fratellino.of_backend.repositories.AttributeRepository;
import it.operazione_fratellino.of_backend.repositories.CategoryRepository;
import it.operazione_fratellino.of_backend.repositories.ProductAttributesRepository;
import it.operazione_fratellino.of_backend.repositories.ProductRepository;
import it.operazione_fratellino.of_backend.services.ProductService;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Log
@Service
public class ProductServiceImpl implements ProductService {
    @Autowired
    private ProductAttributesRepository productAttributesRepository;
    @Autowired
    private AttributeRepository attributeRepository;
    @Autowired
    CategoryRepository categoryRepository;
    @Autowired
    ProductRepository productRepository;
    @Autowired
    ExceptionHandlerService exceptionHandlerService;
    @Autowired
    FileStoreService fileStoreService;

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<Product> getAll() {
        return productRepository.findAll();
    }

    @Override
    public Product findById(Integer id) {
        Optional<Product> product = productRepository.findById(id);
        if(product.isPresent()){
            return product.get();
        }else{
            throw new RuntimeException(("Product not found"));
        }
    }

    @Override
    public Product findByCode(String code) {
        Optional<Product> product =  productRepository.findByCode(code);
        if(product.isPresent()){
            return product.get();
        }else{
            throw new RuntimeException(("Product not found"));
        }

    }

    @Override
    public ResponseEntity<String> save(Product product) {
        product.setCreated_at(new Date());

        try {
            productRepository.save(product);
            log.info("LOG: Creato prodotto: " + product.getName());
            return new ResponseEntity<String>("Prodotto salvato con successo", HttpStatus.CREATED);
        }catch(Exception e){
            log.info("LOG: Errore creazione prodotto: " + product.getName());
            return exceptionHandlerService.handleException( e, product.getName());
        }
    }

    @Override
    public ResponseEntity<String> saveProductWithAttributes(RequestProductDTO productRequest, MultipartFile image) {

        Product savedProduct = null;
        try {
            Product product = new Product();
            product.setCode(productRequest.getCode());
            product.setName(productRequest.getName());
            product.setDescription(productRequest.getDescription());
            product.setPurchase_price(productRequest.getPurchase_price());
            product.setSelling_price(productRequest.getSelling_price());
            product.setStock(productRequest.getStock());
            product.setCreated_at(new Date());
            if(image != null && !image.isEmpty()){
                product.setImage(fileStoreService.saveImage(image, productRequest.getCode()));
            }


            product.setCategory(categoryRepository.findByCode(productRequest.getCategory()));
            savedProduct = productRepository.save(product);

            if (productRequest.getExistingProductAttributes() != null) {
                for (RequestProductAttributesDTO existingAttr : productRequest.getExistingProductAttributes()) {
                    Attribute attribute = attributeRepository.findByName(existingAttr.getAttributeName())
                            .orElseThrow(() -> new RuntimeException("Attribute not found: " + existingAttr.getAttributeName()));

                    ProductAttributes productAttribute = new ProductAttributes();
                    productAttribute.setProduct(savedProduct);
                    productAttribute.setAttribute(attribute);
                    productAttribute.setValue(existingAttr.getAttributeValue());
                    productAttributesRepository.save(productAttribute);
                }
            }


            if (productRequest.getNewProductAttributes() != null) {
                for (RequestProductAttributesDTO newAttr : productRequest.getNewProductAttributes()) {
                    Attribute attribute = new Attribute();
                    attribute.setName(newAttr.getAttributeName());
                    Attribute savedAttribute = attributeRepository.save(attribute);

                    ProductAttributes productAttribute = new ProductAttributes();
                    productAttribute.setProduct(savedProduct);
                    productAttribute.setAttribute(savedAttribute);
                    productAttribute.setValue(newAttr.getAttributeValue());
                    productAttributesRepository.save(productAttribute);
                }
            }

            log.info("LOG: Creato prodotto: " + savedProduct.getName());
            return new ResponseEntity<String>("Prodotto salvato con successo", HttpStatus.CREATED);
        } catch (RuntimeException | IOException e) {
            log.info("LOG: Errore creazione prodotto: ");
            return exceptionHandlerService.handleException(e, productRequest.getName());
        }

    }

    @Override
    public List<Product> findByCategoryCode(String categoryCode) {
        return productRepository.findByCategory(categoryRepository.findByCode(categoryCode));
    }


}
