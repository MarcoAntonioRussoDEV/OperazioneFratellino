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
import it.operazione_fratellino.of_backend.utils.LogUtils;
import it.operazione_fratellino.of_backend.utils.SeverityEnum;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
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
    public List<Product> findAll() {
        return productRepository.findAll();
    }

    @Override
    public Page<Product> findAll(PageRequest pageRequest) {
        try {
            return productRepository.findAll(pageRequest);
        } catch (Exception e) {
            LogUtils.log("Errore durante il recupero del prodotto paginato: " + e.getMessage(), SeverityEnum.ERROR);
            throw new RuntimeException("Errore durante il recupero del prodotto paginato", e);
        }
    }

    @Override
    public List<Product> getAll(String column, String direction) {
        Sort sort = Sort.by(Sort.Direction.fromString(direction), column);
        return productRepository.findAll(sort);
    }


    @Override
    public Product findById(Integer id) {
        Optional<Product> product = productRepository.findById(id);
        if (product.isPresent()) {
            return product.get();
        } else {
            throw new RuntimeException(("Product not found"));
        }
    }

    @Override
    public Product findByCode(String code) {
        Optional<Product> product = productRepository.findByCode(code);
        if (product.isPresent()) {
            return product.get();
        } else {
            throw new RuntimeException(("Product not found"));
        }

    }

    @Override
    public ResponseEntity<String> save(Product product) {
        product.setCreatedAt(new Date());

        try {
            productRepository.save(product);
            log.info("LOG: Creato prodotto: " + product.getName());
            return new ResponseEntity<String>("Prodotto salvato con successo", HttpStatus.CREATED);
        } catch (Exception e) {
            log.info("LOG: Errore creazione prodotto: " + product.getName());
            return exceptionHandlerService.handleException(e, product.getName());
        }
    }

    @Override
    public List<Product> saveAll(List<Product> products) {
        return productRepository.saveAll(products);
    }

    @Override
    public Product saveAndGet(Product product) {
        return productRepository.save(product);
    }

    @Override
    @Transactional
    public ResponseEntity<String> patch(RequestProductDTO productDTO, MultipartFile image) {
        try {
            Product product = productRepository.findByCode(productDTO.getCode()).orElseThrow();
            product.setName(productDTO.getName());
            product.setDescription(productDTO.getDescription());
            product.setPurchasePrice(productDTO.getPurchasePrice());
            product.setSellingPrice(productDTO.getSellingPrice());
            product.setStock(productDTO.getStock());
            product.setCategory(categoryRepository.findByCode(productDTO.getCategory()));
            product.setCode(productDTO.getCode());

            if (image != null && !image.isEmpty()) {
                product.setImage(image.getBytes());
            }

            if (productDTO.getExistingProductAttributes() != null) {
                for (RequestProductAttributesDTO existingAttr : productDTO.getExistingProductAttributes()) {
                    Attribute attribute =
                            attributeRepository.findByName(existingAttr.getAttributeName()).orElseThrow(() -> new RuntimeException("Attribute not found: " + existingAttr.getAttributeName()));

                    if (productAttributesRepository.findByAttributeValue(product,attribute, existingAttr.getAttributeValue()).isEmpty()) {
                        ProductAttributes productAttribute = new ProductAttributes();
                        productAttribute.setProduct(product);
                        productAttribute.setAttribute(attribute);
                        productAttribute.setValue(existingAttr.getAttributeValue());
                        productAttributesRepository.save(productAttribute);
                    }
                }
            }


            if (productDTO.getNewProductAttributes() != null) {
                for (RequestProductAttributesDTO newAttr : productDTO.getNewProductAttributes()) {
                    if(attributeRepository.findByName(newAttr.getAttributeName()).isPresent()){
                        return new ResponseEntity<>(String.format("La specifica %s esiste già, selezionarla nel menù apposito", newAttr.getAttributeName()),HttpStatus.BAD_REQUEST);
                    }

                    if (productAttributesRepository.findByAttributeValue(product,attributeRepository.findByName(newAttr.getAttributeName()).get(), newAttr.getAttributeValue()).isEmpty()) {

                        Attribute attribute = new Attribute();
                        attribute.setName(newAttr.getAttributeName());
                        Attribute savedAttribute = attributeRepository.save(attribute);

                        ProductAttributes productAttribute = new ProductAttributes();
                        productAttribute.setProduct(product);
                        productAttribute.setAttribute(savedAttribute);
                        productAttribute.setValue(newAttr.getAttributeValue());
                        productAttributesRepository.save(productAttribute);
                    }
                }
            }


            LogUtils.log(String.format("Edited product: %s", product.getCode()), SeverityEnum.INFO);
            productRepository.save(product);
            return new ResponseEntity<String>("Prodotto modificato con successo", HttpStatus.OK);
        } catch (RuntimeException | IOException e) {
            LogUtils.log(String.format("PRODUCT.SERVICE:Error editing product: %s", productDTO.getCode()),
                    SeverityEnum.ERROR);
            return exceptionHandlerService.handleException(e, productDTO.getName());
        }


    }

    @Override
    public ResponseEntity<String> saveProductWithAttributes(RequestProductDTO productRequest, MultipartFile image) {

        Product savedProduct;
        if (productRepository.findByCode(productRequest.getCode()).isPresent()) {
            return this.patch(productRequest, image);
        }
        try {
            Product product = new Product();
            product.setCode(productRequest.getCode()); //TODO generated
            product.setName(productRequest.getName());
            product.setDescription(productRequest.getDescription());
            product.setPurchasePrice(productRequest.getPurchasePrice());
            product.setSellingPrice(productRequest.getSellingPrice());
            product.setStock(productRequest.getStock());
            product.setReservedPreorders(0);
            product.setCreatedAt(new Date());
            if (image != null && !image.isEmpty()) {
                //                product.setImage(fileStoreService.saveImage(image, productRequest.getCode()));
                product.setImage(image.getBytes());
            }


            product.setCategory(categoryRepository.findByCode(productRequest.getCategory()));
            savedProduct = productRepository.save(product);

            if (productRequest.getExistingProductAttributes() != null) {
                for (RequestProductAttributesDTO existingAttr : productRequest.getExistingProductAttributes()) {
                    Attribute attribute =
                            attributeRepository.findByName(existingAttr.getAttributeName()).orElseThrow(() -> new RuntimeException("Attribute not found: " + existingAttr.getAttributeName()));

                    ProductAttributes productAttribute = new ProductAttributes();
                    productAttribute.setProduct(savedProduct);
                    productAttribute.setAttribute(attribute);
                    productAttribute.setValue(existingAttr.getAttributeValue());
                    productAttributesRepository.save(productAttribute);
                }
            }


            //            if (productRequest.getNewProductAttributes() != null) {
            //                for (RequestProductAttributesDTO newAttr : productRequest.getNewProductAttributes()) {
            //                    Attribute attribute = new Attribute();
            //                    attribute.setName(newAttr.getAttributeName());
            //                    Attribute savedAttribute = attributeRepository.save(attribute);
            //
            //                    ProductAttributes productAttribute = new ProductAttributes();
            //                    productAttribute.setProduct(savedProduct);
            //                    productAttribute.setAttribute(savedAttribute);
            //                    productAttribute.setValue(newAttr.getAttributeValue());
            //                    productAttributesRepository.save(productAttribute);
            //                }
            //            }
            if (productRequest.getNewProductAttributes() != null) {
                for (RequestProductAttributesDTO newAttr : productRequest.getNewProductAttributes()) {
                    if (attributeRepository.findByName(newAttr.getAttributeName()).isPresent() && productAttributesRepository.findByAttributeValue(product,attributeRepository.findByName(newAttr.getAttributeName()).get(), newAttr.getAttributeValue()).isEmpty()) {

                        Attribute attribute = new Attribute();
                        attribute.setName(newAttr.getAttributeName());
                        Attribute savedAttribute = attributeRepository.save(attribute);

                        ProductAttributes productAttribute = new ProductAttributes();
                        productAttribute.setProduct(product);
                        productAttribute.setAttribute(savedAttribute);
                        productAttribute.setValue(newAttr.getAttributeValue());
                        productAttributesRepository.save(productAttribute);
                    }
                }
            }
            savedProduct.getCategory().setLastCode(savedProduct.getCategory().getLastCode() +1);
            categoryRepository.save(savedProduct.getCategory());
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

    @Override
    public ResponseEntity<String> delete(Product product) {
        try {
            productRepository.delete(product);
            LogUtils.log(String.format("PRODUCT.SERVICE: deleted product: %s", product.getCode()),SeverityEnum.WARNING);
            return new ResponseEntity<>("prodotto eliminato con successo", HttpStatus.OK);
        } catch (DataIntegrityViolationException e) {
            return new ResponseEntity<>("Errore: il prodotto è associata ad altri dati", HttpStatus.CONFLICT);
        } catch (Exception e) {
            return new ResponseEntity<>("Errore interno del server", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<String> toggleDeleted(Product product) {
        try {
            product.setIsDeleted(!product.getIsDeleted());
            product = productRepository.save(product);

            if (product.getIsDeleted()) {
                LogUtils.log(String.format("PRODUCT.SERVICE: disabled product: %s", product.getCode()),
                        SeverityEnum.WARNING);
                return new ResponseEntity<>("prodotto disabilitato", HttpStatus.OK);
            } else {
                LogUtils.log(String.format("PRODUCT.SERVICE: enabled product: %s", product.getCode()),
                        SeverityEnum.WARNING);
                return new ResponseEntity<>("prodotto abilitato", HttpStatus.OK);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Errore nella modifica del prodotto", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
