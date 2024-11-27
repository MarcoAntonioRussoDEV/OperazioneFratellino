package it.operazione_fratellino.of_backend.services;

import it.operazione_fratellino.of_backend.entities.City;

import java.util.List;

public interface CityService {
    List<City> getAll();
    City findByName(String name);
}
