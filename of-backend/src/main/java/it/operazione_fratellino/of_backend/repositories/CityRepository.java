package it.operazione_fratellino.of_backend.repositories;


import it.operazione_fratellino.of_backend.entities.City;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CityRepository extends JpaRepository<City, Integer>{

    List<City> findAll();
    Optional<City> findByName(String name);

}