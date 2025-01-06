package it.operazione_fratellino.of_backend.services.implement;

import it.operazione_fratellino.of_backend.DTOs.CategoryDTO;
import it.operazione_fratellino.of_backend.components.ExceptionHandlerService;
import it.operazione_fratellino.of_backend.entities.Category;
import it.operazione_fratellino.of_backend.entities.Product;
import it.operazione_fratellino.of_backend.repositories.CategoryRepository;
import it.operazione_fratellino.of_backend.services.CategoryService;
import it.operazione_fratellino.of_backend.services.ProductService;
import it.operazione_fratellino.of_backend.utils.LogUtils;
import it.operazione_fratellino.of_backend.utils.SeverityEnum;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Log
@Service
public class CategoryServiceImpl implements CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private ExceptionHandlerService exceptionHandlerService;
    @Autowired
    private ProductService productService;

    @Override
    public List<Category> findAll() {
        return categoryRepository.findAll();
    }

    @Override
    public Page<Category> findAll(PageRequest pageRequest) {

        try {
            return categoryRepository.findAll(pageRequest);
        } catch (Exception e) {
            LogUtils.log("Errore durante il recupero delle categorie paginate: " + e.getMessage(), SeverityEnum.ERROR);
            throw new RuntimeException("Errore durante il recupero delle categorie paginato", e);
        }
    }

    @Override
    public Category findById(Integer id) {
        return categoryRepository.findById(id);
    }

    @Override
    public Category findByCode(String code) {
        return categoryRepository.findByCode(code);
    }

    @Override
    public Category findByName(String name) {
        return categoryRepository.findByName(name);
    }

    @Override
    public ResponseEntity<String> save(Category category) {
        try {
            categoryRepository.save(category);
            log.info("LOG: Creata categoria: " + category.getName());
            return new ResponseEntity<String>("Categoria salvata con successo", HttpStatus.CREATED);
        } catch (Exception e) {
            log.info("LOG: Errore creazione categoria: " + category.getName());
            return exceptionHandlerService.handleException(e, category.getName());
        }
    }


    @Override
    public ResponseEntity<String> delete(Category category) {
        try {
            categoryRepository.delete(category);
            return new ResponseEntity<>("categoria eliminata con successo", HttpStatus.OK);
        } catch (DataIntegrityViolationException e) {
            return new ResponseEntity<>("Errore: La categoria è associata a dei prodotti", HttpStatus.CONFLICT);
        } catch (Exception e) {
            return new ResponseEntity<>("Errore interno del server", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @Override
    public ResponseEntity<String> patch(Category category, CategoryDTO categoryDTO) {
        if (!Objects.equals(category.getCode(), categoryDTO.getCode())) {
            for (Product product : category.getProducts()) {
                product.setCode(product.getCode().replace(category.getCode(), categoryDTO.getCode()));
                productService.save(product);
            }
            category.setCode(categoryDTO.getCode());
        }
        category.setName(categoryDTO.getName());
        try{
            categoryRepository.save(category);
            return new ResponseEntity<>(String.format("Edited category: %s into %S - %s", category.getCode(),categoryDTO.getCode(),categoryDTO.getName()),HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Errore interno del server", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
