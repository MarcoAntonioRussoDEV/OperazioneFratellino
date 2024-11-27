package it.operazione_fratellino.of_backend.repositories;

import it.operazione_fratellino.of_backend.entities.Sell;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SellRepository extends JpaRepository<Sell,Integer> {

    List<Sell> findAll();
}
