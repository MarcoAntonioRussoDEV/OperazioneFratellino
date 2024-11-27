package it.operazione_fratellino.of_backend.utils.DTOConverters;

import it.operazione_fratellino.of_backend.DTOs.CityDTO;
import it.operazione_fratellino.of_backend.entities.City;
import it.operazione_fratellino.of_backend.services.CityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class CityConverter {

    @Autowired
    UserConverter userConverter;
    @Autowired
    CityService cityService;

    public CityDTO toDTO(City city){
        CityDTO dto = new CityDTO();
            dto.setName(city.getName());
            dto.setUsers(city.getUsers().stream().map(userConverter::toDTO).toList());
        return dto;
    }

    public City toEntity(CityDTO dto){

        if(cityService.findByName(dto.getName()) != null){
            return cityService.findByName(dto.getName());
        }

        City city = new City();
            city.setName(dto.getName());
            city.setUsers(dto.getUsers().stream().map(userConverter::toEntity).toList());
        return city;
    }
}
