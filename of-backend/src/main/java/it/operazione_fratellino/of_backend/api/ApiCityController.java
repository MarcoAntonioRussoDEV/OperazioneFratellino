package it.operazione_fratellino.of_backend.api;

import it.operazione_fratellino.of_backend.DTOs.CityDTO;
import it.operazione_fratellino.of_backend.services.CityService;
import it.operazione_fratellino.of_backend.utils.DTOConverters.CityConverter;
import it.operazione_fratellino.of_backend.utils.PaginateResponse;
import it.operazione_fratellino.of_backend.utils.PaginationUtils;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Log
@RequestMapping("/api/cities")
public class ApiCityController {

    @Autowired
    private CityService cityService;
    @Autowired
    private CityConverter cityConverter;

    @GetMapping("/all")
    public PaginateResponse<CityDTO> getAllCities(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size){
        return PaginationUtils.getAllEntities(page, size, cityService::findAll, cityConverter::toDTO);

    }

    @GetMapping("/by-name/{cityName}")
    public CityDTO findByName(@PathVariable String cityName){
        return cityConverter.toDTO(cityService.findByName(cityName));
    }
}
