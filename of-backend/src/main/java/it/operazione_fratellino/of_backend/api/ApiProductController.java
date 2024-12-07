package it.operazione_fratellino.of_backend.api;

import it.operazione_fratellino.of_backend.DTOs.ProductAttributesDTO;
import it.operazione_fratellino.of_backend.DTOs.ProductDTO;
import it.operazione_fratellino.of_backend.DTOs.RequestProductDTO;
import it.operazione_fratellino.of_backend.entities.Product;
import it.operazione_fratellino.of_backend.entities.ProductAttributes;
import it.operazione_fratellino.of_backend.services.AttributeService;
import it.operazione_fratellino.of_backend.services.ProductAttributesService;
import it.operazione_fratellino.of_backend.services.ProductService;
import it.operazione_fratellino.of_backend.utils.DTOConverters.ProductAttributesConverter;
import it.operazione_fratellino.of_backend.utils.DTOConverters.ProductConverter;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Log
@RestController
@RequestMapping("/api/products")
public class ApiProductController {

    @Autowired
    private ProductService productService;
    @Autowired
    private ProductConverter productConverter;
    @Autowired
    private AttributeService attributeService;
    @Autowired
    private ProductAttributesService productAttributesService;
    @Autowired
    private ProductAttributesConverter productAttributesConverter;

    @GetMapping("/all")
    public List<ProductDTO> getAllProducts(@RequestParam(required = false) String column, @RequestParam(required =
            false) String direction) {
        List<ProductDTO> products;
        if (column != null && direction != null) {
            products = productService.getAll(column, direction).stream().filter(product -> !product.getIs_deleted()).map(productConverter::toDTO).collect(Collectors.toList());
        } else {
            products = productService.getAll().stream().filter(product -> !product.getIs_deleted()).map(productConverter::toDTO).collect(Collectors.toList());
        }
        return products;
    }


    @GetMapping("/by-id/{id}")
    public ProductDTO findProductById(@PathVariable Integer id) {
        ProductDTO product = productConverter.toDTO(productService.findById(id));
        return product;
    }

    @GetMapping("/by-code/{code}")
    public ProductDTO findProductByCode(@PathVariable String code) {
        ProductDTO product = productConverter.toDTO(productService.findByCode(code));
        return product;
    }

    @GetMapping("/by-category-code/{categoryCode}")
    public List<ProductDTO> getProductByCategoryCode(@PathVariable String categoryCode) {
        log.info("execute findProductByCategoryCode");
        List<ProductDTO> products =
                productService.findByCategoryCode(categoryCode).stream().map(productConverter::toDTO).toList();
        return products;
    }

    @PostMapping("/create")
    public ResponseEntity<String> createProduct(@RequestPart("product") RequestProductDTO productData,
                                                @RequestPart(value = "image", required = false) MultipartFile image) {

        return productService.saveProductWithAttributes(productData, image);

    }

    @GetMapping("/get-image/{productCode}")
    @ResponseBody
    public ResponseEntity<Resource> getImage(@PathVariable String productCode) {
        try {
            // Percorso della directory di upload
            Path filePath = Paths.get(productService.findByCode(productCode).getImage());

            Resource resource = new UrlResource(filePath.toUri());
            if (!resource.exists()) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }

            // Determina il tipo di contenuto
            String contentType = Files.probeContentType(filePath);

            return ResponseEntity.ok().header("Content-Type", contentType != null ? contentType :
                    "application/octet" + "-stream").body(resource);
        } catch (IOException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @PostMapping("/delete/{productCode}")
    public ResponseEntity<String> deleteProduct(@PathVariable String productCode) {
        return productService.delete(productService.findByCode(productCode));
    }


}
