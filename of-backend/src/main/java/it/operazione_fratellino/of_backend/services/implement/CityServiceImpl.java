package it.operazione_fratellino.of_backend.services.implement;

import it.operazione_fratellino.of_backend.entities.City;
import it.operazione_fratellino.of_backend.repositories.CityRepository;
import it.operazione_fratellino.of_backend.services.CityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CityServiceImpl implements CityService {

    @Autowired
    CityRepository cityRepository;

    @Override
    public List<City> getAll() {
        return cityRepository.findAll();
    }

    @Override
    public City findByName(String name) {
        return cityRepository.findByName(name);
    }
}
