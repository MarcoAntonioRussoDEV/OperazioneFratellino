package it.operazione_fratellino.of_backend.repositories;

import it.operazione_fratellino.of_backend.entities.Attribute;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AttributeRepository extends JpaRepository<Attribute, Integer>{

  List<Attribute> findAll();
  Optional<Attribute> findById(Integer id);
  Optional<Attribute> findByName(String name);

}