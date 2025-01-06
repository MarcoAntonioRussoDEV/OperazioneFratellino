package it.operazione_fratellino.of_backend.repositories;

import it.operazione_fratellino.of_backend.entities.ProductPreorder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProductPreorderRepository extends JpaRepository<ProductPreorder,Integer> {

    Optional<ProductPreorder> findById(Integer id);

}
