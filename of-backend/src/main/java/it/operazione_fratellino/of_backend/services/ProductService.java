package it.operazione_fratellino.of_backend.services;

import it.operazione_fratellino.of_backend.DTOs.RequestProductDTO;
import it.operazione_fratellino.of_backend.entities.Product;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

public interface ProductService {
    List<Product> getAll();
    Product findById(Integer id);
    Product findByCode(String code);
    ResponseEntity<String> save(Product product);

    ResponseEntity<String> saveProductWithAttributes(RequestProductDTO productRequest, MultipartFile image);

    List<Product> findByCategoryCode(String categoryCode);

}
