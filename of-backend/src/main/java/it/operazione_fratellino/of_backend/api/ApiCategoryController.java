package it.operazione_fratellino.of_backend.api;

import it.operazione_fratellino.of_backend.DTOs.CategoryDTO;
import it.operazione_fratellino.of_backend.services.CategoryService;
import it.operazione_fratellino.of_backend.utils.DTOConverters.CategoryConverter;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@Log
@RestController
@RequestMapping("/api/categories")
public class ApiCategoryController {

    @Autowired
    private CategoryService categoryService;
    @Autowired
    private CategoryConverter categoryConverter;


    @GetMapping("/all")
    public List<CategoryDTO> getAllCategory() {
        List<CategoryDTO> categories = categoryService.getAll().stream().map(categoryConverter::toDTO).collect(Collectors.toUnmodifiableList());
        return categories;
    }

    @GetMapping("/by-id/{id}")
    public CategoryDTO getCategoryById(
            @PathVariable Integer id
    ) {
        CategoryDTO category = categoryConverter.toDTO(categoryService.findById(id));
        return category;
    }

    @GetMapping("/by-code/{code}")
    public CategoryDTO getCategoryByCode(
            @PathVariable String code
    ) {
        CategoryDTO category = categoryConverter.toDTO(categoryService.findByCode(code));
        return category;
    }

    @PostMapping("create")
    public ResponseEntity<String> createCategoty(
            @RequestBody CategoryDTO categoryDTO
    ){
        categoryDTO.setCode(categoryDTO.getCode().toUpperCase());

        return categoryService.save(categoryConverter.toEntity(categoryDTO));
    }

//    @PostMapping("create2")
//    public ResponseEntity<String> createCategoty2(
//            @RequestBody CategoryDTO categoryDTO
//    ){
//        log.info(categoryDTO.getName());
//        return new ResponseEntity<>("category created successfully",HttpStatus.UNAUTHORIZED);
//    }
//    @PostMapping("create3")
//    public ResponseEntity<String> createCategoty3(
//            @RequestBody CategoryDTO categoryDTO
//    ){
//        log.info(categoryDTO.getName());
//        return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
//    }
}
