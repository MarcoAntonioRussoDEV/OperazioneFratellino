package it.operazione_fratellino.of_backend.repositories;

import it.operazione_fratellino.of_backend.entities.Attribute;
import it.operazione_fratellino.of_backend.entities.Product;
import it.operazione_fratellino.of_backend.entities.ProductAttributes;
import jakarta.persistence.criteria.CriteriaBuilder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductAttributesRepository extends JpaRepository<ProductAttributes, Integer> {

    List<ProductAttributes> findAll();
    ProductAttributes findByProduct(Product product);
    ProductAttributes findByAttribute(Attribute attribute);

    @Query("SELECT pa FROM ProductAttributes pa WHERE pa.product = :product AND pa.attribute = :attribute AND pa.value = :value")
    Optional<ProductAttributes> findByAttributeValue(@Param("product") Product product,@Param("attribute") Attribute attribute, @Param("value") String value);
}
