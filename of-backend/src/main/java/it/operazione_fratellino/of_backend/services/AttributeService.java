package it.operazione_fratellino.of_backend.services;

import it.operazione_fratellino.of_backend.entities.Attribute;
import it.operazione_fratellino.of_backend.entities.Product;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface AttributeService {

    List<Attribute> getAll();
    Attribute findById(Integer id);
    Attribute findByName(String name);
    ResponseEntity<String> save(Attribute attribute);
    Attribute saveAndGet(Attribute attribute);

}
