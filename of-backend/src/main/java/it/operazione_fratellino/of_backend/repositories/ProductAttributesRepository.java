package it.operazione_fratellino.of_backend.repositories;

import it.operazione_fratellino.of_backend.entities.Attribute;
import it.operazione_fratellino.of_backend.entities.Product;
import it.operazione_fratellino.of_backend.entities.ProductAttributes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductAttributesRepository extends JpaRepository<ProductAttributes, Integer> {

    List<ProductAttributes> findAll();
    ProductAttributes findByProduct(Product product);
    ProductAttributes findByAttribute(Attribute attribute);
}
