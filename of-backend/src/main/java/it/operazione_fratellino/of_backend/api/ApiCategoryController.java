package it.operazione_fratellino.of_backend.api;

import it.operazione_fratellino.of_backend.DTOs.CategoryDTO;
import it.operazione_fratellino.of_backend.entities.Category;
import it.operazione_fratellino.of_backend.services.CategoryService;
import it.operazione_fratellino.of_backend.utils.DTOConverters.CategoryConverter;
import it.operazione_fratellino.of_backend.utils.PaginateResponse;
import it.operazione_fratellino.of_backend.utils.PaginationUtils;
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
    public PaginateResponse<CategoryDTO> getAllCategory(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        return PaginationUtils.getAllEntities(page, size, categoryService::findAll, categoryConverter::toDTO);
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

    @DeleteMapping("delete/{categoryID}")
    public ResponseEntity<String> deleteCategory(@PathVariable Integer categoryID) {

        return categoryService.delete(categoryService.findById(categoryID));

    }

    @PatchMapping("edit/{id}")
    public ResponseEntity<String> editCategory(@RequestBody CategoryDTO categoryDTO,@PathVariable Integer id){
        Category category = categoryService.findById(id);
        return categoryService.patch(category,categoryDTO);
    }
}
