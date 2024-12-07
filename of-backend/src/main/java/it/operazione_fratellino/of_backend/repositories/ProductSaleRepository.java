package it.operazione_fratellino.of_backend.repositories;

import it.operazione_fratellino.of_backend.entities.ProductSale;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductSaleRepository extends JpaRepository<ProductSale, ProductSale> {
    ProductSale findById(Integer id);

}