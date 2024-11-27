package it.operazione_fratellino.of_backend.api;

import it.operazione_fratellino.of_backend.DTOs.ProductAttributesDTO;
import it.operazione_fratellino.of_backend.entities.ProductAttributes;
import it.operazione_fratellino.of_backend.services.ProductAttributesService;
import it.operazione_fratellino.of_backend.utils.DTOConverters.ProductAttributesConverter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
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
    public List<ProductAttributesDTO> getAll(){
        List<ProductAttributesDTO> productAttributes = productAttributesService.getAll().stream().map(productAttributesConverter::toDTO).collect(Collectors.toUnmodifiableList());
        return productAttributes;
    }


}
