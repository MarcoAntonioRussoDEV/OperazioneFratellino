package it.operazione_fratellino.of_backend.repositories;

import it.operazione_fratellino.of_backend.entities.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    List<Category> findAll();
    Category findById(Integer id);
    Category findByCode(String code);
    Category findByName(String name);

}