package it.operazione_fratellino.of_backend.repositories;

import it.operazione_fratellino.of_backend.entities.Category;
import it.operazione_fratellino.of_backend.entities.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {

    Optional<Product> findById(Integer id);
    List<Product> findByCategory(Category category);
    Optional<Product> findByCode(String code);
}
