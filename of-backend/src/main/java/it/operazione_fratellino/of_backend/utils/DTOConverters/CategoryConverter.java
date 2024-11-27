package it.operazione_fratellino.of_backend.utils.DTOConverters;

import it.operazione_fratellino.of_backend.DTOs.CategoryDTO;
import it.operazione_fratellino.of_backend.entities.Category;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class CategoryConverter {

    @Autowired
    ProductConverter productConverter;

    public CategoryDTO toDTO(Category category){
        CategoryDTO dto = new CategoryDTO();
        dto.setId(category.getId());
        dto.setCode(category.getCode());
        dto.setName(category.getName());
        dto.setProducts(category.getProducts().stream().map(productConverter::toDTO).collect(Collectors.toList()));
        return dto;
    }

    public Category toEntity(CategoryDTO dto){
        Category category = new Category(dto.getName(), dto.getCode());
        return category;
    }
}
