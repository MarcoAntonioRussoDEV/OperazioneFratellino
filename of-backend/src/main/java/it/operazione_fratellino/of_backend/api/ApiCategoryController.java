package it.operazione_fratellino.of_backend.api;

import it.operazione_fratellino.of_backend.DTOs.CategoryDTO;
import it.operazione_fratellino.of_backend.services.CategoryService;
import it.operazione_fratellino.of_backend.utils.DTOConverters.CategoryConverter;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.SQLIntegrityConstraintViolationException;
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
        List<CategoryDTO> categories =
                categoryService.getAll().stream().map(categoryConverter::toDTO).collect(Collectors.toUnmodifiableList());
        return categories;
    }

    @GetMapping("/by-id/{id}")
    public CategoryDTO getCategoryById(@PathVariable Integer id) {
        CategoryDTO category = categoryConverter.toDTO(categoryService.findById(id));
        return category;
    }

    @GetMapping("/by-code/{code}")
    public CategoryDTO getCategoryByCode(@PathVariable String code) {
        CategoryDTO category = categoryConverter.toDTO(categoryService.findByCode(code));
        return category;
    }

    @PostMapping("create")
    public ResponseEntity<String> createCategoty(@RequestBody CategoryDTO categoryDTO) {
        categoryDTO.setCode(categoryDTO.getCode().toUpperCase());

        return categoryService.save(categoryConverter.toEntity(categoryDTO));
    }

    @PostMapping("delete/{categoryID}")
    public ResponseEntity<String> deleteCategory(@PathVariable Integer categoryID) {

        return categoryService.delete(categoryService.findById(categoryID));

    }
}
