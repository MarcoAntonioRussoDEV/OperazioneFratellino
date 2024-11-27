package it.operazione_fratellino.of_backend.services;


import it.operazione_fratellino.of_backend.entities.Category;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Set;

public interface CategoryService {
    List<Category> getAll();
    Category findById(Integer id);
    ResponseEntity<String> save(Category category);
    Category findByCode(String code);
    Category findByName(String name);

}
