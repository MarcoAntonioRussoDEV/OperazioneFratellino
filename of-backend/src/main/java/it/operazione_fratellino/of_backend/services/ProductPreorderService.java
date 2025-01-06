package it.operazione_fratellino.of_backend.services;

import it.operazione_fratellino.of_backend.entities.ProductPreorder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import java.util.List;

public interface ProductPreorderService {
    List<ProductPreorder> findAll();

    Page<ProductPreorder> findAll(PageRequest pageRequest);

    ProductPreorder findById(Integer id);

    ProductPreorder saveAndGet(ProductPreorder productPreorder);
}
