package it.operazione_fratellino.of_backend.repositories;

import it.operazione_fratellino.of_backend.entities.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart,Integer> {
    Optional<Cart> findById(Integer id);
}
