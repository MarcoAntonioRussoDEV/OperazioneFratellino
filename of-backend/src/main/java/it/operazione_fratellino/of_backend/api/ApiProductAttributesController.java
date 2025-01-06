package it.operazione_fratellino.of_backend.api;

import it.operazione_fratellino.of_backend.DTOs.ProductAttributesDTO;
import it.operazione_fratellino.of_backend.entities.ProductAttributes;
import it.operazione_fratellino.of_backend.services.ProductAttributesService;
import it.operazione_fratellino.of_backend.utils.DTOConverters.ProductAttributesConverter;
import it.operazione_fratellino.of_backend.utils.PaginateResponse;
import it.operazione_fratellino.of_backend.utils.PaginationUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/product-attributes")
public class ApiProductAttributesController {

    @Autowired
    ProductAttributesService productAttributesService;
    @Autowired
    ProductAttributesConverter productAttributesConverter;


    @GetMapping("/all")
    public PaginateResponse<ProductAttributesDTO> getAllProductAttributes(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size){
        return PaginationUtils.getAllEntities(page, size, productAttributesService::findAll, productAttributesConverter::toDTO);

    }


}
