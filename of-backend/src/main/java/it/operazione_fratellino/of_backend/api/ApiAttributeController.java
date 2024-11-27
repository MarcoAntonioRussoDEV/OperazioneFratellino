package it.operazione_fratellino.of_backend.api;

import it.operazione_fratellino.of_backend.DTOs.AttributeDTO;
import it.operazione_fratellino.of_backend.services.AttributeService;
import it.operazione_fratellino.of_backend.utils.BooleanUtils;
import it.operazione_fratellino.of_backend.utils.DTOConverters.AttributeConverter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/attributes")
public class ApiAttributeController {

    @Autowired
    private AttributeService attributeService;
    @Autowired
    private AttributeConverter attributeConverter;

    @GetMapping
    public AttributeDTO getAttributeByParams(
            @RequestParam(required = false) Integer id,
            @RequestParam(required = false) String name
    ){
        if(BooleanUtils.exists(id)){
            return attributeConverter.toDTO(attributeService.findById(id));

        }else if(BooleanUtils.exists(name)){
            return attributeConverter.toDTO(attributeService.findByName(name));
        }

        throw new RuntimeException("Attribute not found");
    }


    @GetMapping("/all")
    public List<AttributeDTO> getAllAttributes(){
        List<AttributeDTO> attributes = attributeService.getAll().stream().map(attributeConverter::toDTO).toList();
        return attributes;
    }

//    @GetMapping("/all/prod")
//    public List<AttributeDTO> getAllAttributesProd(){
//        List<AttributeDTO> attributes = attributeService.getAll().stream().map(attributeConverter::toDTO).collect(Collectors.toUnmodifiableList());
//        return attributes;
//    }

    @GetMapping("/by-id/{id}")
    public AttributeDTO getAttributeById(
            @PathVariable Integer id
    ){
        return attributeConverter.toDTO(attributeService.findById(id));
    }

    @GetMapping("/by-name/{name}")
    public AttributeDTO getAttributeByName(
            @PathVariable String name
    ){
        return attributeConverter.toDTO(attributeService.findByName(name));
    }

}