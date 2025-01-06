package it.operazione_fratellino.of_backend.services;

import it.operazione_fratellino.of_backend.entities.City;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import java.util.List;

public interface CityService {
    List<City> findAll();

    Page<City> findAll(PageRequest pageRequest);

    City findByName(String name);

    City findOrNew(String name);

    City saveAndGet(City city);

    boolean exists(String city);
}
