package it.operazione_fratellino.of_backend.services;

import it.operazione_fratellino.of_backend.DTOs.RequestProductDTO;
import it.operazione_fratellino.of_backend.entities.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

public interface ProductService {
    List<Product> findAll();

    Page<Product> findAll(PageRequest pageRequest);

    List<Product> getAll(String column, String direction);

    Product findById(Integer id);
    Product findByCode(String code);
    ResponseEntity<String> save(Product product);
    ResponseEntity<String> delete(Product product);

    List<Product> saveAll(List<Product> products);

    Product saveAndGet(Product product);

    ResponseEntity<String> patch(RequestProductDTO productDTO, MultipartFile image) throws IOException;

    ResponseEntity<String> saveProductWithAttributes(RequestProductDTO productRequest, MultipartFile image);

    List<Product> findByCategoryCode(String categoryCode);

    ResponseEntity<String> toggleDeleted(Product product);
}
