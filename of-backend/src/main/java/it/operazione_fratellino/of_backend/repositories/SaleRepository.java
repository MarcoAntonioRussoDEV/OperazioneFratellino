package it.operazione_fratellino.of_backend.repositories;

import it.operazione_fratellino.of_backend.entities.Sale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SaleRepository extends JpaRepository<Sale,Integer> {

    List<Sale> findAll();
}
