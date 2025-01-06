package it.operazione_fratellino.of_backend.repositories;

import it.operazione_fratellino.of_backend.entities.ProductCart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductCartRepository extends JpaRepository<ProductCart, Integer> {


}
