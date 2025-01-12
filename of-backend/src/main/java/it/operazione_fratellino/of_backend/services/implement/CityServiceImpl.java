package it.operazione_fratellino.of_backend.services.implement;

import it.operazione_fratellino.of_backend.entities.City;
import it.operazione_fratellino.of_backend.repositories.CityRepository;
import it.operazione_fratellino.of_backend.services.CityService;
import it.operazione_fratellino.of_backend.services.LogService;
import it.operazione_fratellino.of_backend.utils.LogUtils;
import it.operazione_fratellino.of_backend.utils.SeverityEnum;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CityServiceImpl implements CityService {

    @Autowired
    CityRepository cityRepository;
    @Autowired
    private LogService logService;

    @Override
    public List<City> findAll() {
        return cityRepository.findAll();
    }


    @Override
    public Page<City> findAll(PageRequest pageRequest) {
        try {
            return cityRepository.findAll(pageRequest);
        } catch (Exception e) {
            LogUtils.log("Errore durante il recupero della città paginata: " + e.getMessage(), SeverityEnum.ERROR, logService, "CityServiceImpl");
            throw new RuntimeException("Errore durante il recupero della città paginato", e);
        }
    }

    @Override
    public City findByName(String name) {
        return cityRepository.findByName(name).orElseThrow();
    }

    @Override
    public City findOrNew(String name){
        return cityRepository.findByName(name).orElseGet(()-> cityRepository.save(new City(name)));
    }

    @Override
    public City saveAndGet(City city){
        return cityRepository.save(city);
    }

    @Override
    public boolean exists(String city){
        return cityRepository.findByName(city).isPresent();
    }


}
