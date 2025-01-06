package it.operazione_fratellino.of_backend.services;


import it.operazione_fratellino.of_backend.DTOs.CategoryDTO;
import it.operazione_fratellino.of_backend.entities.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Set;

public interface CategoryService {
    List<Category> findAll();


    Page<Category> findAll(PageRequest pageRequest);

    Category findById(Integer id);
    ResponseEntity<String> save(Category category);
    Category findByCode(String code);
    Category findByName(String name);
    ResponseEntity<String> delete(Category category);

    ResponseEntity<String> patch(Category category, CategoryDTO categoryDTO);
}
